import { DEFAULT_LANGUAGE } from '../i18n/languages'
import { common as englishCommon } from '../i18n/messages/en/common'
import { apiUrl } from '../platform/api-base'
import { sessionTransport } from '../platform/session-transport'
import type {
  AddToCartRequest,
  AdminCommodityPrice,
  AdminMarket,
  AdminOverview,
  AdminPayment,
  AdminProduct,
  AdminRentalListing,
  AdminUser,
  Agronomist,
  ApiErrorBody,
  AppNotification,
  AssistantAnswer,
  AssistantQuestion,
  AuthSession,
  BookingReasonRequest,
  BookingStatus,
  BookRentalRequest,
  BuyerInquiry,
  Cart,
  ChangePasswordRequest,
  CheckoutRequest,
  CommodityPriceInput,
  ConfirmPaymentRequest,
  CreatePaymentRequest,
  CreateScanInput,
  CreateUserRequest,
  CropOption,
  CurrentUser,
  DashboardResponse,
  FarmerPreferences,
  FarmerProfile,
  FieldPlot,
  LanguageCode,
  LoginRequest,
  MandiMarketOption,
  MandiOverview,
  NearbyStock,
  OrderConfirmation,
  OrderStatus,
  OrderSummary,
  OwnerBooking,
  OwnerBookingDetail,
  OwnerDashboard,
  OwnerListing,
  OwnerListingInput,
  OwnerProfileInput,
  PageResponse,
  PaymentCheckout,
  PaymentStatus,
  PaymentStatusCode,
  PlotInput,
  Product,
  ProductCategory,
  RateUnit,
  RentalBooking,
  RentalBookingDetail,
  RentalHubOption,
  RentalListing,
  RentalsOverview,
  ResetPasswordRequest,
  Role,
  ScanAndPayRequest,
  ScanContext,
  ScanDetail,
  ScanSummary,
  SellerPayment,
  ShopDashboard,
  ShopOrder,
  ShopProduct,
  ShopProductInput,
  ShopProfile,
  ShopProfileInput,
  StoreHome,
  TreatmentPlan,
  UnreadCount,
  UpdateProfileRequest,
  UpdateUserRequest,
  VehicleOwnerProfile,
} from './types'

export class ApiError extends Error {
  /** HTTP status, or 0 when no response arrived (offline, connection refused). */
  readonly status: number
  /** The server's key for this error, for the few a screen reacts to, e.g. "store.cart.other-shop". */
  readonly code: string | null

  constructor(status: number, message: string, code: string | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/** The text to show for a failed call: the server's (or the connection's) explanation, else `fallback`. */
export function describeError(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

// ---------------------------------------------------------------- Language (set by I18nProvider)

/** Texts for failures the server did not explain; I18nProvider keeps them in the app language. */
export interface ApiMessages {
  serverUnreachable: string
  noConnection: string
  sessionExpired: string
  requestFailed: (status: number) => string
}

let requestLanguage: LanguageCode = DEFAULT_LANGUAGE
let messages: ApiMessages = englishCommon.errors

/** Sends `language` as Accept-Language (the server localizes its texts) and reports failures with `texts`. */
export function setApiLanguage(language: LanguageCode, texts: ApiMessages): void {
  requestLanguage = language
  messages = texts
}

// ---------------------------------------------------------------- Session (D2)

/**
 * The signed-in session. Its access token lives only in this module's memory. The refresh token is an HttpOnly
 * cookie the browser sends to /api/auth only, or, in the installed app, kept in the app's private storage
 * (platform/session-transport).
 */
let session: AuthSession | null = null
const sessionListeners = new Set<() => void>()

function setSession(next: AuthSession | null): void {
  session = next
  if (!next) void sessionTransport.forget()
  sessionListeners.forEach((listener) => listener())
}

/** The current session, or null when signed out (a stable snapshot for useSyncExternalStore). */
export function getSession(): AuthSession | null {
  return session
}

/** Calls `listener` after every session change: sign-in, refresh, profile update, sign-out, expiry. */
export function subscribeSession(listener: () => void): () => void {
  sessionListeners.add(listener)
  return () => {
    sessionListeners.delete(listener)
  }
}

/** Keeps the session's copy of the user current after the server returned a fresh one. */
function rememberUser(user: CurrentUser): CurrentUser {
  if (session) setSession({ ...session, user })
  return user
}

const REFRESH_LOCK = 'agriscan.refresh'
let refreshing: Promise<AuthSession> | null = null

/** Refresh tokens rotate on every use and a reused one revokes the session, so tabs refresh one at a time. */
function inRefreshLock<T>(task: () => Promise<T>): Promise<T> {
  return 'locks' in navigator ? navigator.locks.request(REFRESH_LOCK, task) : task()
}

/**
 * Trades the refresh cookie for a new session. Concurrent callers share one request. A rejected cookie
 * ends the session; a network failure leaves it as it is.
 */
function refreshSession(): Promise<AuthSession> {
  refreshing ??= inRefreshLock(() =>
    request<AuthSession>(
      '/auth/refresh',
      { method: 'POST', headers: { 'X-Requested-With': 'agriscan' } },
      { renewSession: false },
    ),
  )
    .then(
      (next) => {
        setSession(next)
        return next
      },
      (error: unknown) => {
        if (error instanceof ApiError && error.status === 401) setSession(null)
        throw error
      },
    )
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

/**
 * A usable access token after the server refused `expired`: the current one when another request renewed
 * the session meanwhile, else a refreshed one. Throws "session expired" when the session cannot be renewed.
 */
async function renewedToken(expired: string): Promise<string> {
  if (session && session.accessToken !== expired) return session.accessToken
  try {
    return (await refreshSession()).accessToken
  } catch (error) {
    // Offline or server trouble: the session may still be valid, so report that problem instead.
    if (error instanceof ApiError && error.status !== 401) throw error
    throw new ApiError(401, messages.sessionExpired)
  }
}

// ---------------------------------------------------------------- Requests

/** Returned by a proxy or load balancer when the API server behind it is down or restarting. */
const GATEWAY_STATUSES: ReadonlySet<number> = new Set([502, 503, 504])

/** Developers learn why the server is unreachable: the Vite proxy expects the backend on :8080. */
const DEV_SERVER_HINT = import.meta.env.DEV ? ' (Development: start the backend on port 8080.)' : ''

/** The server's explanation of a failed call (and its key, if any), else a generic one in the app language. */
async function errorOf(res: Response): Promise<ApiError> {
  if (GATEWAY_STATUSES.has(res.status)) return new ApiError(res.status, messages.serverUnreachable + DEV_SERVER_HINT)
  try {
    const body = (await res.json()) as Partial<ApiErrorBody>
    if (body.message) return new ApiError(res.status, body.message, body.code ?? null)
  } catch {
    // the error body was not JSON; fall back to the generic message
  }
  return new ApiError(res.status, messages.requestFailed(res.status))
}

async function send(path: string, init: RequestInit, accessToken: string | undefined): Promise<Response> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  headers.set('Accept-Language', requestLanguage)
  if (typeof init.body === 'string') headers.set('Content-Type', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  for (const [name, value] of Object.entries(await sessionTransport.headersFor(path))) headers.set(name, value)
  let res: Response
  try {
    res = await fetch(apiUrl(`/api${path}`), { ...init, headers })
  } catch {
    throw new ApiError(0, messages.noConnection)
  }
  await sessionTransport.received(res)
  return res
}

interface RequestOptions {
  /** On 401, renew the session once and retry; off for the auth endpoints, where 401 is the answer itself. */
  renewSession: boolean
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  { renewSession }: RequestOptions = { renewSession: true },
): Promise<T> {
  const token = session?.accessToken
  let res = await send(path, init, token)
  if (res.status === 401 && token && renewSession) {
    res = await send(path, init, await renewedToken(token))
    if (res.status === 401) {
      // Refused even with a fresh token (e.g. the account was just deactivated): the session is over.
      setSession(null)
      throw new ApiError(401, messages.sessionExpired)
    }
  }
  if (!res.ok) throw await errorOf(res)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

const json = (body: unknown) => (body === undefined ? undefined : JSON.stringify(body))

const get = <T>(path: string) => request<T>(path)
const post = <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: json(body) })
const put = <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: json(body) })
const patch = <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: json(body) })
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' })

type QueryValue = string | number | boolean | null | undefined

/** "?a=1&b=x" from the defined values, or "" when there are none. */
function query(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

export const api = {
  farmer: () => get<FarmerProfile>('/farmer/me'),
  dashboard: () => get<DashboardResponse>('/dashboard'),

  scanContext: () => get<ScanContext>('/scans/context'),
  recentScans: (limit = 10) => get<ScanSummary[]>(`/scans?limit=${limit}`),
  scan: (id: number) => get<ScanDetail>(`/scans/${id}`),
  latestScan: () => get<ScanDetail>('/scans/latest'),
  createScan: ({ image, crop, mode }: CreateScanInput) => {
    const form = new FormData()
    if (image) form.append('image', image)
    if (crop) form.append('crop', crop)
    if (mode) form.append('mode', mode)
    return request<ScanDetail>('/scans', { method: 'POST', body: form })
  },

  activeTreatmentPlan: () => get<TreatmentPlan>('/treatment-plans/active'),
  treatmentPlan: (id: number) => get<TreatmentPlan>(`/treatment-plans/${id}`),
  completeTreatmentStep: (planId: number, stepId: number) =>
    post<TreatmentPlan>(`/treatment-plans/${planId}/steps/${stepId}/complete`),
  toggleStepReminder: (planId: number, stepId: number) =>
    post<TreatmentPlan>(`/treatment-plans/${planId}/steps/${stepId}/reminder`),

  nearbyStock: () => get<NearbyStock>('/care/nearby-stock'),
  agronomist: () => get<Agronomist>('/care/agronomist'),

  updateFarmerPreferences: (preferences: Partial<FarmerPreferences>) =>
    put<FarmerProfile>('/farmer/me/preferences', preferences),

  crops: () => get<CropOption[]>('/crops'),
  plots: () => get<FieldPlot[]>('/plots'),
  createPlot: (input: PlotInput) => post<FieldPlot>('/plots', input),
  updatePlot: (id: number, input: PlotInput) => put<FieldPlot>(`/plots/${id}`, input),
  deletePlot: (id: number) => del<void>(`/plots/${id}`),

  mandiMarkets: () => get<MandiMarketOption[]>('/mandi/markets'),
  mandi: (marketId?: number) => get<MandiOverview>(`/mandi${query({ marketId })}`),
  respondToInquiry: (id: number) => post<BuyerInquiry>(`/mandi/inquiries/${id}/respond`),

  rentalHubs: () => get<RentalHubOption[]>('/rentals/hubs'),
  rentals: (hubId?: number) => get<RentalsOverview>(`/rentals${query({ hubId })}`),
  bookRental: (id: number, request: BookRentalRequest = {}) => post<RentalBooking>(`/rentals/${id}/bookings`, request),
  toggleRentalFavorite: (id: number) => post<RentalListing>(`/rentals/${id}/favorite`),
  myBookings: () => get<RentalBooking[]>('/rentals/bookings'),
  booking: (id: number) => get<RentalBookingDetail>(`/rentals/bookings/${id}`),
  cancelBooking: (id: number, reason: string | null = null) =>
    post<RentalBookingDetail>(`/rentals/bookings/${id}/cancel`, { reason } satisfies BookingReasonRequest),

  store: () => get<StoreHome>('/store'),
  products: (filter: { category?: ProductCategory; q?: string } = {}) =>
    get<Product[]>(`/store/products${query(filter)}`),
  productByBarcode: (code: string) => get<Product>(`/store/products/barcode/${encodeURIComponent(code)}`),
  cart: () => get<Cart>('/cart'),
  /** Another shop's product is refused (409) unless replaceCart, which empties the cart first: ask the farmer. */
  addToCart: (productId: number, replaceCart = false, quantity = 1) =>
    post<Cart>('/cart/items', { productId, quantity, replaceCart } satisfies AddToCartRequest),
  removeFromCart: (itemId: number) => del<Cart>(`/cart/items/${itemId}`),
  checkout: (request: CheckoutRequest) => post<OrderConfirmation>('/cart/checkout', request),
  orders: () => get<OrderSummary[]>('/orders'),
  order: (id: number) => get<OrderSummary>(`/orders/${id}`),

  askAssistant: (question: AssistantQuestion) => post<AssistantAnswer>('/assistant/ask', question),

  payments: {
    create: (request: CreatePaymentRequest) => post<PaymentCheckout>('/payments', request),
    get: (id: number) => get<PaymentStatus>(`/payments/${id}`),
    confirm: (id: number, request: ConfirmPaymentRequest = {}) => post<PaymentStatus>(`/payments/${id}/confirm`, request),
    /** The farmer paid the seller directly by Scan & Pay; the seller confirms it later. */
    scanAndPay: (request: ScanAndPayRequest) => post<PaymentStatus>('/payments/scan-and-pay', request),
  },

  /** Shopkeepers and vehicle owners: the Scan & Pay payments farmers sent them, and their word on each. */
  seller: {
    payments: (status?: PaymentStatusCode) => get<SellerPayment[]>(`/seller/payments${query({ status })}`),
    received: (paymentId: number) => post<SellerPayment>(`/seller/payments/${paymentId}/received`),
    notReceived: (paymentId: number, reason: string | null) =>
      post<SellerPayment>(`/seller/payments/${paymentId}/not-received`, { reason }),
  },

  /** The shopkeeper portal. */
  shop: {
    me: () => get<ShopProfile>('/shop/me'),
    updateMe: (input: ShopProfileInput) => put<ShopProfile>('/shop/me', input),
    uploadUpiQr: (image: File) => {
      const form = new FormData()
      form.append('image', image)
      return request<ShopProfile>('/shop/me/upi-qr', { method: 'POST', body: form })
    },
    removeUpiQr: () => del<ShopProfile>('/shop/me/upi-qr'),
    dashboard: () => get<ShopDashboard>('/shop/dashboard'),
    orders: (status?: OrderStatus) => get<ShopOrder[]>(`/shop/orders${query({ status })}`),
    products: () => get<ShopProduct[]>('/shop/products'),
    product: (id: number) => get<ShopProduct>(`/shop/products/${id}`),
    createProduct: (input: ShopProductInput) => post<ShopProduct>('/shop/products', input),
    updateProduct: (id: number, input: ShopProductInput) => put<ShopProduct>(`/shop/products/${id}`, input),
    setProductStock: (id: number, inStock: boolean) => patch<ShopProduct>(`/shop/products/${id}/stock`, { inStock }),
    uploadProductPhoto: (id: number, image: File) => {
      const form = new FormData()
      form.append('image', image)
      return request<ShopProduct>(`/shop/products/${id}/photo`, { method: 'POST', body: form })
    },
  },

  /** Every call here keeps the session (getSession / subscribeSession) up to date. */
  auth: {
    login: async (credentials: LoginRequest) => {
      const next = await request<AuthSession>(
        '/auth/login',
        { method: 'POST', body: json(credentials) },
        { renewSession: false },
      )
      setSession(next)
      return next
    },
    refresh: () => refreshSession(),
    /** Rejects, keeping the session, when the server cannot be told (its refresh cookie would stay valid). */
    logout: async () => {
      await request<void>('/auth/logout', { method: 'POST' }, { renewSession: false })
      setSession(null)
    },
    me: () => get<CurrentUser>('/auth/me').then(rememberUser),
    updateMe: (update: UpdateProfileRequest) => patch<CurrentUser>('/auth/me', update).then(rememberUser),
    changePassword: (change: ChangePasswordRequest) => post<void>('/auth/me/password', change),
  },

  owner: {
    me: () => get<VehicleOwnerProfile>('/owner/me'),
    updateMe: (input: OwnerProfileInput) => put<VehicleOwnerProfile>('/owner/me', input),
    uploadUpiQr: (image: File) => {
      const form = new FormData()
      form.append('image', image)
      return request<VehicleOwnerProfile>('/owner/me/upi-qr', { method: 'POST', body: form })
    },
    removeUpiQr: () => del<VehicleOwnerProfile>('/owner/me/upi-qr'),
    dashboard: () => get<OwnerDashboard>('/owner/dashboard'),
    listings: () => get<OwnerListing[]>('/owner/listings'),
    listing: (id: number) => get<OwnerListing>(`/owner/listings/${id}`),
    createListing: (input: OwnerListingInput) => post<OwnerListing>('/owner/listings', input),
    updateListing: (id: number, input: OwnerListingInput) => put<OwnerListing>(`/owner/listings/${id}`, input),
    setListingOnline: (id: number, online: boolean) => patch<OwnerListing>(`/owner/listings/${id}/online`, { online }),
    uploadListingPhoto: (id: number, image: File) => {
      const form = new FormData()
      form.append('image', image)
      return request<OwnerListing>(`/owner/listings/${id}/photo`, { method: 'POST', body: form })
    },
    deleteListing: (id: number) => del<void>(`/owner/listings/${id}`),
    bookings: (status?: BookingStatus) => get<OwnerBooking[]>(`/owner/bookings${query({ status })}`),
    booking: (id: number) => get<OwnerBookingDetail>(`/owner/bookings/${id}`),
    acceptBooking: (id: number) => post<OwnerBookingDetail>(`/owner/bookings/${id}/accept`),
    declineBooking: (id: number, reason: string | null = null) =>
      post<OwnerBookingDetail>(`/owner/bookings/${id}/decline`, { reason } satisfies BookingReasonRequest),
    startBooking: (id: number) => post<OwnerBookingDetail>(`/owner/bookings/${id}/start`),
    completeBooking: (id: number) => post<OwnerBookingDetail>(`/owner/bookings/${id}/complete`),
  },

  /** Every signed-in role. The live stream (GET /api/notifications/stream) is read by lib/notification-stream. */
  notifications: {
    list: (page = 0, size = 20) => get<PageResponse<AppNotification>>(`/notifications${query({ page, size })}`),
    unreadCount: () => get<UnreadCount>('/notifications/unread-count'),
    markRead: (id: number) => post<AppNotification>(`/notifications/${id}/read`),
    markAllRead: () => post<void>('/notifications/read-all'),
  },

  admin: {
    overview: () => get<AdminOverview>('/admin/overview'),
    users: (filter: { q?: string; role?: Role; page?: number; size?: number } = {}) =>
      get<PageResponse<AdminUser>>(`/admin/users${query(filter)}`),
    createUser: (request: CreateUserRequest) => post<AdminUser>('/admin/users', request),
    updateUser: (id: number, update: UpdateUserRequest) => patch<AdminUser>(`/admin/users/${id}`, update),
    resetPassword: (id: number, reset: ResetPasswordRequest) => post<void>(`/admin/users/${id}/reset-password`, reset),
    markets: () => get<AdminMarket[]>('/admin/markets'),
    updateMarket: (id: number, update: { open?: boolean; arrivalsQuintals?: number }) =>
      patch<AdminMarket>(`/admin/markets/${id}`, update),
    marketPrices: (marketId: number) => get<AdminCommodityPrice[]>(`/admin/markets/${marketId}/prices`),
    createPrice: (marketId: number, input: CommodityPriceInput) =>
      post<AdminCommodityPrice>(`/admin/markets/${marketId}/prices`, input),
    updatePrice: (id: number, input: CommodityPriceInput) => put<AdminCommodityPrice>(`/admin/prices/${id}`, input),
    deletePrice: (id: number) => del<void>(`/admin/prices/${id}`),
    rentals: () => get<AdminRentalListing[]>('/admin/rentals'),
    updateRental: (id: number, update: { rate?: number; rateUnit?: RateUnit; online?: boolean }) =>
      patch<AdminRentalListing>(`/admin/rentals/${id}`, update),
    products: () => get<AdminProduct[]>('/admin/products'),
    updateProduct: (id: number, update: { price?: number; mrp?: number | null; flashDeal?: boolean; inStock?: boolean }) =>
      patch<AdminProduct>(`/admin/products/${id}`, update),
    payments: (filter: { status?: PaymentStatusCode; page?: number; size?: number } = {}) =>
      get<PageResponse<AdminPayment>>(`/admin/payments${query(filter)}`),
  },
}
