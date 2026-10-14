/**
 * API contract between the Spring Boot backend (/api/**) and the React frontend.
 *
 * Field names, nesting and enum values here are authoritative: the backend DTOs mirror them exactly.
 * - Timestamps are ISO-8601 instants ("2026-09-29T11:00:00Z"); dates are ISO local dates ("2026-09-29").
 * - Money values are whole rupees (numbers, no currency symbol).
 * - Fields documented as "rich" may contain **bold** markers; render them with <RichText>.
 * - Icon fields hold Material Symbols names (e.g. "partly_cloudy_day").
 * - Display text is localized to the request's `Accept-Language` (en | mr | hi, English fallback).
 *   Editable content in the admin and owner portals travels as LocalizedText instead.
 * - Every endpoint except /api/auth/login|refresh|logout and the payment webhooks needs
 *   `Authorization: Bearer <accessToken>`; 401 = not signed in / expired, 403 = wrong role.
 * - Resources owned by another farmer or owner answer 404, never 403.
 */

export type Tone = 'neutral' | 'success' | 'warning' | 'error'

export interface ApiErrorBody {
  status: number
  error: string
  message: string
  code: string | null // the message key for errors a screen reacts to, e.g. "store.cart.other-shop"
}

/** Paged admin lists: GET …?page=0&size=20 (page is zero-based). */
export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

// ---------------------------------------------------------------- Languages & accounts

/** UI and content languages. The frontend sends the active one as the Accept-Language header. */
export type LanguageCode = 'en' | 'mr' | 'hi'

/** Editable text in three languages; mr/hi fall back to en when null or blank. */
export interface LocalizedText {
  en: string
  mr: string | null
  hi: string | null
}

export type Role = 'FARMER' | 'VEHICLE_OWNER' | 'SHOPKEEPER' | 'ADMIN'

/** GET /api/auth/me, PATCH /api/auth/me */
export interface CurrentUser {
  id: number
  name: string
  phone: string // 10-digit mobile, e.g. "9876543210"
  email: string | null
  roles: Role[]
  preferredLanguage: LanguageCode
  farmerId: number | null // set when the user has the FARMER role
  ownerId: number | null // set when the user has the VEHICLE_OWNER role
  shopId: number | null // set when the user has the SHOPKEEPER role
}

/** POST /api/auth/login */
export interface LoginRequest {
  phone: string
  password: string
}

/**
 * POST /api/auth/login and POST /api/auth/refresh. The access token lives 15 minutes; the refresh token
 * (30 days, rotated on every refresh) travels only in the HttpOnly cookie `agriscan_refresh`.
 * POST /api/auth/refresh must carry the header `X-Requested-With: agriscan` (CSRF guard).
 * POST /api/auth/logout revokes the refresh token and clears the cookie (204).
 */
export interface AuthSession {
  accessToken: string
  expiresAt: string // ISO instant
  user: CurrentUser
}

/** PATCH /api/auth/me */
export interface UpdateProfileRequest {
  name?: string
  email?: string | null
  preferredLanguage?: LanguageCode
}

/** POST /api/auth/me/password (204). Passwords: 8–64 chars with at least one letter and one digit. */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// ---------------------------------------------------------------- Farmer

export interface FarmerPreferences {
  rentalHubId: number | null // chosen with "Change" on the rentals screen
  mandiMarketId: number | null // chosen with the market selector on the mandi screen
}

/** GET /api/farmer/me; PUT /api/farmer/me/preferences (body: Partial<FarmerPreferences>) */
export interface FarmerProfile {
  id: number
  name: string // "Rishikesh"
  location: string // "Solapur, Maharashtra"
  season: string // "Rabi 2024"
  avatarUrl: string
  preferences: FarmerPreferences
}

// ---------------------------------------------------------------- Home dashboard

export interface WeatherSummary {
  temperatureC: number // 29
  condition: string // "Partly Cloudy"
  conditionIcon: string // "partly_cloudy_day"
  humidityPercent: number // 68
  rainInDays: number | null // 2 -> "2 Days / Rain Forecast"; null when no rain expected
}

export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH'

export interface RiskAlert {
  id: number
  title: string // "High Blight Risk in Karmala Taluka"
  message: string
  severity: AlertSeverity
  region: string // "Karmala Taluka"
}

export type PlotHealth = 'ACTION_NEEDED' | 'MODERATE_RISK' | 'HEALTHY'

export interface PlotMetric {
  label: string // "Harvest Cycle"
  value: string // "12 days left"
  tone: Tone
}

export type CropCode = 'TOMATO' | 'WHEAT' | 'PADDY' | 'COTTON' | 'CHILLI' | 'SUGARCANE'

export interface FieldPlot {
  id: number
  code: string // "Plot A" (assigned by the server: next free letter)
  fieldName: string // "North Field"
  cropCode: CropCode
  crop: string // localized crop name, "Tomato"
  variety: string // "Arka Rakshak"
  areaAcres: number // 2.5
  sowingDate: string | null // ISO date
  imageUrl: string | null // null for crops without a photo: show the crop emoji tile instead
  health: PlotHealth
  metrics: PlotMetric[] // two tiles per plot in the design
  pendingAction: string | null // "Fungicide spray pending"
  activeTreatmentPlanId: number | null
  latestScanId: number | null
}

export interface ScanSummary {
  id: number
  cropLabel: string // "Tomato", "Bt Cotton Stem"
  diseaseName: string // "Early Blight", "Healthy Foliage"
  healthy: boolean
  confidence: number // 0-100
  imageUrl: string
  scannedAt: string // ISO instant
  prescriptionShort: string | null // "Mancozeb 75% WP (2.5g/L)"
  note: string | null // "No pathogen or fungal trace"
  stockistCount: number // "2 local stores stock this Rx"
  plotId: number | null
}

export interface Helpline {
  name: string // "Kisan Call Center"
  phone: string // "18001801551" (for tel: links)
  displayNumber: string // "1800-180-1551"
  hours: string // "Toll-Free 24/7"
}

/**
 * GET /api/plots (the farmer's plots, by code); POST /api/plots (201) and PUT /api/plots/{id} take this body
 * and return FieldPlot; DELETE /api/plots/{id} (204; 409 while the plot has an unfinished treatment plan).
 * New plots start HEALTHY with server-computed metrics (crop age from sowingDate, days to harvest).
 */
export interface PlotInput {
  fieldName: string // 1–40 chars
  cropCode: CropCode
  variety: string // 1–60 chars
  areaAcres: number // 0.1–1000
  sowingDate: string | null // ISO date, not in the future
}

/** GET /api/dashboard */
export interface DashboardResponse {
  farmer: FarmerProfile
  weather: WeatherSummary
  alerts: RiskAlert[]
  plots: FieldPlot[]
  recentScans: ScanSummary[]
  helpline: Helpline
}

// ---------------------------------------------------------------- Crop scan & diagnosis

export type Severity = 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE'
export type ScanMode = 'LEAF' | 'PEST'

export interface Prescription {
  category: string // "Chemical Fungicide (Fast Acting)"
  recommended: boolean
  activeIngredient: string // "Mancozeb 75% WP"
  marketBrands: string // "Dithane M-45, Indofil M-45, or Chlorothalonil 75% WP"
  dilution: string // "2.5g / Liter"
  dilutionNote: string // "Water mix"
  tankSize: string // "15L Knapsack Tank"
  tankDose: string // "38 - 40 Grams"
  tankNote: string // "1 standard pump"
  applicationWindow: string
  preHarvestIntervalDays: number // 7
  preHarvestNote: string // rich: "Wait strictly **7 days** before harvesting any mature tomatoes."
}

export interface OrganicAlternative {
  summary: string // rich
  note: string
  badge: string // "Residue Free"
}

export interface ScanDetail extends ScanSummary {
  cropScientificName: string | null // "Solanum lycopersicum"
  pathogen: string | null // "Alternaria solani"
  symptom: string | null // "Concentric brown ring lesions (Alternaria spp.)"
  finding: string | null // "Early Blight pattern detected on lower foliage"
  severity: Severity
  severityStage: number | null // 2
  severityLabel: string // "Severe Risk • Spreading"
  plotLabel: string | null // "North Field • Plot A"
  verifiedBy: string | null // "AI Verified Agronomist"
  cause: string | null // "Why This Happened" paragraph
  climateTrigger: string | null // "27°C with 86% leaf wetness"
  audioLanguages: string | null // "Hindi, English"
  audioDurationSeconds: number | null // 42
  prescription: Prescription | null
  organicAlternative: OrganicAlternative | null
  sanitationSteps: string[]
  treatmentPlanId: number | null
}

/** Also served by GET /api/crops for the plot form. */
export interface CropOption {
  code: CropCode // "TOMATO"
  label: string // localized, "Tomato"
  emoji: string // "🍅"
}

/** GET /api/scans/context — data for the scanner screen */
export interface ScanContext {
  modelVersion: string // "Neural AI Vision v4.2"
  supportedCrops: CropOption[]
  fieldMoisturePercent: number // 78
  fieldMoistureNote: string // "Optimal for Fungal Check"
  nearbyOutbreakCount: number // 3
  nearbyOutbreakNote: string // "Blight within 5 km"
  latestScan: ScanDetail | null // drives the floating "Live Diagnosis" card
}

/** POST /api/scans (multipart/form-data) */
export interface CreateScanInput {
  image?: File // optional; the backend falls back to a sample photo
  crop?: string // CropOption.code; omit for auto-detect
  mode?: ScanMode // defaults to LEAF
}

// ---------------------------------------------------------------- Treatment plan

export type StepStatus = 'COMPLETED' | 'UPCOMING' | 'SCHEDULED'

export interface TreatmentStep {
  id: number
  dayNumber: number // 1, 4, 7
  dayLabel: string // "Today", "In 3 Days", "Scheduled"
  scheduledDate: string // ISO date
  title: string // "Fungicide Spray 1"
  detail: string // rich: "Mancozeb 75% WP • **40g per 15L Knapsack Pump**"
  note: string | null // "Applied with fine hollow-cone nozzle under dry leaf surface"
  badge: string | null // "Critical Check", "FRAC Group Rotation"
  status: StepStatus
  completedAt: string | null // ISO instant -> "Completed at 07:30 AM"
  reminderTime: string | null // "07:00 AM"
  reminderSet: boolean
}

/** GET /api/treatment-plans/active, GET /api/treatment-plans/{id} */
export interface TreatmentPlan {
  id: number
  plotId: number
  plotCode: string // "Plot A"
  title: string // "Treatment Plan: Plot A"
  target: string // "Tomato Early Blight"
  pathogen: string // "Alternaria solani"
  scanId: number
  startDate: string // ISO date
  durationDays: number // 7 -> "7-Day Protocol Timeline"
  completedSteps: number
  totalSteps: number
  progressPercent: number // 33
  steps: TreatmentStep[]
}

// ---------------------------------------------------------------- Stores & agronomist care

export type DealerCertification = 'GOVT_CERTIFIED' | 'AUTHORIZED_RETAILER'

export interface DealerStock {
  headline: string // "Ready Stock Available"
  priceLabel: string // "₹280 / 500g" or "Spares Avail."
  detail: string
  note: string // "Batch No: IND-2024 • Expiry: Aug 2026"
}

export interface AgroDealer {
  id: number
  name: string
  certification: DealerCertification
  distanceKm: number
  address: string
  rating: number // 4.8
  reviewCount: number // 140
  phone: string
  stock: DealerStock
}

export interface OnlineOffer {
  label: string // "Buy Online from AgriScan Mandi Depot"
  price: number // 420
  productId: number
}

/** GET /api/care/nearby-stock */
export interface NearbyStock {
  hubName: string // "Kem & Karmala Agro Hub"
  district: string // "Solapur Dist."
  radiusKm: number // 5
  productsLabel: string // "Mancozeb & Azoxystrobin"
  mapImageUrl: string
  onlineOffer: OnlineOffer | null
  dealers: AgroDealer[]
}

/** GET /api/care/agronomist */
export interface Agronomist {
  id: number
  name: string // "Dr. Suresh Patel"
  title: string // "Plant Pathologist • ICAR Certified"
  photoUrl: string
  phone: string
  onDuty: boolean
  pitch: string
}

// ---------------------------------------------------------------- Mandi market

export type DemandLevel = 'HIGH_DEMAND' | 'HOT' | 'STABLE' | 'STEADY'

/** GET /api/mandi/markets — the selector behind "Solapur Main APMC ▾" */
export interface MandiMarketOption {
  id: number
  name: string // "Solapur APMC Mandi"
  shortName: string // "Solapur Main APMC"
  district: string // "Solapur"
}

export interface MandiMarket {
  id: number
  name: string // "Solapur APMC Mandi"
  shortName: string // "Solapur Main APMC"
  district: string // "Solapur"
  open: boolean
  statusLabel: string // "Market Open • Trading Active"
  boardLabel: string // "Live Wholesale Board • आजचे बाजारभाव"
  arrivalsQuintals: number // 8450
  imageUrl: string
  helplinePhone: string // "18002331020"
  helplineDisplay: string // "1800-233-1020"
  helplineHours: string // "6 AM - 8 PM"
}

export interface PriceForecast {
  tag: string // "Festive Surge"
  message: string // rich
}

export interface CommodityPrice {
  id: number
  category: string // "Vegetable"
  name: string // "Tomato (Hybrid)"
  grade: string // "Grade A (Crates)"
  minPrice: number
  maxPrice: number
  unit: string // "Quintal"
  changeAmount: number // +180, 0 = unchanged
  demand: DemandLevel
}

export interface BuyerInquiry {
  id: number
  buyerName: string
  verified: boolean
  subtitle: string
  icon: string // "storefront", "public", "factory"
  badge: string // "Spot Settlement", "+₹200 Premium", "Grade B Accepted"
  badgeHighlighted: boolean
  volumeTonnes: number // 15 -> "15 Metric Tonnes"
  produce: string // "Table Tomatoes"
  priceLabel: string // "Offered Price", "Purchase Price", "Contract Price"
  pricePerQuintal: number
  priceNote: string // "Direct DBT in 24 Hrs"
  priceNoteHighlighted: boolean // green emphasis, e.g. "Bonus Grade Incentive"
  highlighted: boolean // primary-coloured produce/price styling
  specsTitle: string | null // "Grade A Spec Requirements:"
  specs: string[]
  footerIcon: string // "pin_drop"
  footerText: string // "APMC Gate 3 • Pickup available"
  actionLabel: string // "Sell Harvest"
  actionIcon: string | null // "arrow_forward"
  actionPrimary: boolean
  responded: boolean // whether the signed-in farmer has registered a lot
}

/**
 * GET /api/mandi?marketId= — without marketId: the farmer's preferred market, else the first market.
 * Inquiries belong to the market; POST /api/mandi/inquiries/{id}/respond records the signed-in farmer's lot.
 */
export interface MandiOverview {
  market: MandiMarket
  forecast: PriceForecast
  pricesUpdatedAt: string // ISO instant -> "Updated 18 min ago"
  commodities: CommodityPrice[]
  inquiries: BuyerInquiry[]
}

// ---------------------------------------------------------------- Farm rentals & transport

export type RentalCategory = 'MACHINERY' | 'TRANSPORT'
export type RateUnit = 'HOUR' | 'KM' | 'DAY'

export interface RentalOperator {
  name: string // "Rameshwar Patil"
  initials: string // "RP"
  stats: string // "120+ acres tilled • 4.9 ★★★★★"
}

export interface RentalSpec {
  value: string // "6 Feet"
  label: string // "Rotavator Width"
}

export interface RentalFeature {
  icon: string
  text: string // "Solapur APMC Direct Entry Pass"
}

export interface RentalListing {
  id: number
  category: RentalCategory
  name: string
  description: string
  imageUrl: string | null // machinery cards show a photo
  icon: string | null // transport cards show an icon tile
  badge: string | null // "Verified Field Tested"
  badgeIcon: string | null
  distanceKm: number | null
  locality: string | null // "Kem Shivar"
  rate: number
  rateUnit: RateUnit
  rateNote: string | null // "With Diesel + Driver", "or ₹2,800/Day", "Min ₹350 Base"
  rateNoteHighlighted: boolean
  operator: RentalOperator
  availability: string // "Slot: 02:00 PM Today", "At Farm in 20m"
  availabilityHighlighted: boolean
  specs: RentalSpec[]
  features: RentalFeature[]
  phone: string
  callLabel: string // "Call Rameshwar"
  bookLabel: string // "Book Slot", "Dispatch to Farm", "Reserve 4 AM Run"
  bookIcon: string
  favorite: boolean
}

export interface RentalPerk {
  icon: string
  title: string // "Zero Spill"
  subtitle: string // "Tarpaulin Tied"
}

export interface RentalSpotlight {
  listingId: number
  title: string // "Mahindra Bolero Pickup"
  subtitle: string // "Rated 1.7 Tonne • 65–75 Vegetable Crates"
  label: string // "Mandi Harvest Express • ताजी मंडी रवानगी"
  imageUrl: string
  baseFare: number // 450
  perKmRate: number // 22
  dispatchMinutes: number // 25
  perks: RentalPerk[]
}

/** GET /api/rentals/hubs — the list behind the rentals "Change" button */
export interface RentalHubOption {
  id: number
  name: string // "Solapur APMC Hub"
  radiusKm: number
  routes: string
}

/**
 * GET /api/rentals?hubId= — without hubId: the farmer's preferred hub, else the first hub.
 * Only listings their owners have switched online are shown. `favorite` is per farmer
 * (POST /api/rentals/{id}/favorite toggles it for the signed-in farmer).
 */
export interface RentalsOverview {
  hubId: number
  hubName: string // "Solapur APMC Hub"
  radiusKm: number // 12
  routes: string // "Karmala, Kem & Kurduwadi routes"
  onlineCount: number // 14
  spotlight: RentalSpotlight | null // null when the hub has no spotlight offer
  listings: RentalListing[]
}

/**
 * Booking lifecycle (D9): the farmer requests → the owner accepts or declines → the owner starts the job
 * ("on the way") → the owner marks it completed. The farmer may cancel while REQUESTED or ACCEPTED.
 */
export type BookingStatus = 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

/** One step of a booking's history, oldest first. */
export interface BookingEvent {
  status: BookingStatus
  at: string // ISO instant
  actor: 'FARMER' | 'OWNER' | 'SYSTEM'
  note: string | null // decline or cancel reason
}

/** Body of POST /api/owner/bookings/{id}/decline and POST /api/rentals/bookings/{id}/cancel. */
export interface BookingReasonRequest {
  reason: string | null // ≤ 200 chars
}

/** VERIFYING: the farmer paid the owner by Scan & Pay and the owner has yet to confirm it. */
export type BookingPaymentStatus = 'UNPAID' | 'VERIFYING' | 'PAID'

/** POST /api/rentals/{id}/bookings (201). estimatedUnits: hours for HOUR, km for KM, days for DAY. */
export interface BookRentalRequest {
  slotLabel?: string
  estimatedUnits?: number // 1–500; defaults: 2 hours, 15 km, 1 day
}

/**
 * The farmer's view of a booking. GET /api/rentals/bookings (newest first);
 * POST /api/rentals/bookings/{id}/cancel (body BookingReasonRequest → RentalBookingDetail). Pay online via
 * POST /api/payments { purpose: 'RENTAL_BOOKING' } once ACCEPTED, or settle with the owner after the job
 * ("Post-Sale Payment Option").
 */
export interface RentalBooking {
  id: number
  listingId: number
  listingName: string
  operatorName: string
  operatorPhone: string
  status: BookingStatus
  slotLabel: string
  estimatedUnits: number
  rateUnit: RateUnit
  amount: number // rate × units (+ base fare for fare-based transport)
  paymentStatus: BookingPaymentStatus
  createdAt: string
  message: string // localized, "Request sent to Rameshwar Patil. We will notify you when they accept."
}

/** GET /api/rentals/bookings/{id} — the farmer's tracking screen (/bookings/:id). */
export interface RentalBookingDetail extends RentalBooking {
  listingImageUrl: string | null
  listingIcon: string | null
  hubName: string
  timeline: BookingEvent[]
  canCancel: boolean // REQUESTED or ACCEPTED
  canPay: boolean // ACCEPTED or IN_PROGRESS or COMPLETED, and UNPAID
  paymentId: number | null // latest unfinished or successful payment for this booking
}

// ---------------------------------------------------------------- Agro store & cart

export type ProductCategory = 'CROP_MEDICINE' | 'SEEDS' | 'TOOLS' | 'DAIRY'

export interface Product {
  id: number
  name: string // "Syngenta Abhinav Tomato Seeds"
  shortName: string // "Syngenta Abhinav Seeds"
  category: ProductCategory
  tag: string | null // "Blight Tolerant"
  tagTone: Tone
  packSize: string | null // "10g Pkt"
  description: string
  price: number
  mrp: number | null
  imageUrl: string | null // null for catalogue items without a photo: show the category icon tile
  rating: number | null
  imageBadge: string | null // "28% OFF", "Vet Seal"
  imageBadgeTone: Tone
  stockNote: string // "In Stock", "Only 4 Left"
  stockTone: Tone
  footerIcon: string
  footerText: string // "Delivers Tomorrow morning"
  footerTone: Tone
  flashDeal: boolean
  inStock: boolean
  barcode: string | null // EAN-13 printed on the pack; GET /api/store/products/barcode/{code} finds it
  shopId: number // the shop selling it; a cart holds one shop's products
  shopName: string // "Solapur Mandi Agro Depot"
}

export interface RxBundle {
  productId: number
  scanId: number | null
  label: string // "Plot A • Blight Triage Rx"
  prescribedAt: string // ISO instant -> "Prescribed 3 hrs ago"
  name: string // "Mancozeb 75% WP + Nozzle Kit"
  description: string // "Indofil M-45 (500g) + Brass Mist Nozzle"
  price: number // 420
  mrp: number // 530
  imageUrl: string
  genuineLabel: string // "100% Genuine Lab-Tested"
  subsidyLabel: string // "DBT Subsidy Eligible"
}

export interface StoreCategory {
  category: ProductCategory
  title: string // "Crop Medicines"
  localTitle: string // "फसल सुरक्षा व कीटनाशक"
  description: string // "Fungicides, Bio-sprays & Tonics"
  icon: string // "vaccines"
  badge: string // "140+ Items"
}

/** GET /api/store */
export interface StoreHome {
  depotName: string // "Solapur Mandi Agro Depot"
  open: boolean
  deliveryLabel: string // "24h Express"
  rxBundle: RxBundle | null
  rxCount: number // badge on the "Crop Medicines & Rx" chip
  categories: StoreCategory[]
  flashDealEndsAt: string // ISO instant, drives the countdown
  flashDeals: Product[]
}

export interface CartItem {
  id: number
  productId: number
  name: string
  shortName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

/** GET /api/cart */
export interface Cart {
  items: CartItem[]
  itemCount: number // sum of quantities
  total: number
  freeDelivery: boolean
  summary: string // "Mancozeb 500g + Doodh Dhara 5kg"
  shopId: number | null // the one shop whose products the cart holds; null when empty
  shopName: string | null
}

/**
 * POST /api/cart/items. A product of another shop is refused (409) unless replaceCart is true, which empties the cart
 * first: ask the farmer before sending it.
 */
export interface AddToCartRequest {
  productId: number
  quantity: number
  replaceCart?: boolean
}

export type PaymentMethod = 'ONLINE' | 'CASH_ON_DELIVERY'

/**
 * AWAITING_PAYMENT → PAID for online orders, through VERIFYING_PAYMENT when the farmer paid the shop by Scan & Pay
 * (back to AWAITING_PAYMENT if the shop did not receive it); PLACED for cash on delivery.
 */
export type OrderStatus = 'AWAITING_PAYMENT' | 'VERIFYING_PAYMENT' | 'PLACED' | 'PAID' | 'CANCELLED'

/** POST /api/cart/checkout (201). The cart is emptied; an online order is then paid via POST /api/payments. */
export interface CheckoutRequest {
  paymentMethod: PaymentMethod
}

export interface OrderConfirmation {
  orderId: number
  itemCount: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  message: string // localized, "Order #12 placed • ₹730 • Cash on Delivery"
}

export interface OrderLine {
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

/** GET /api/orders (newest first), GET /api/orders/{id} */
export interface OrderSummary {
  id: number
  placedAt: string
  itemCount: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  summary: string // "Mancozeb 500g + Doodh Dhara 5kg"
  lines: OrderLine[]
  shopName: string
}

// ---------------------------------------------------------------- Payments (Stripe | Razorpay | simulated)

/**
 * Chosen by the server (`agriscan.payments.provider`: auto | stripe | razorpay | simulated). `auto` picks
 * Stripe when its keys are set, else Razorpay, else the simulated test provider (no real money).
 */
export type PaymentProviderKind = 'STRIPE' | 'RAZORPAY' | 'SIMULATED' | 'SCAN_AND_PAY'

export type PaymentPurpose = 'STORE_ORDER' | 'RENTAL_BOOKING'

export type PaymentStatusCode = 'REQUIRES_PAYMENT' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED'

/**
 * POST /api/payments (201). The server computes the amount from the order or booking; asking again for a
 * reference with an unfinished payment returns that payment instead of creating another.
 */
export interface CreatePaymentRequest {
  purpose: PaymentPurpose
  referenceId: number // orderId or bookingId
}

/** Stripe Payment Element (shows Card and, on India-enabled accounts, UPI). */
export interface StripeCheckout {
  publishableKey: string
  clientSecret: string
}

/** Razorpay Checkout (card, UPI, netbanking, wallets). */
export interface RazorpayCheckout {
  keyId: string
  orderId: string
  amountPaise: number
  currency: 'INR'
  merchantName: string // "AgriScan"
  description: string
  prefillName: string
  prefillContact: string
}

/**
 * Paying the seller (shop or vehicle owner) directly: scan their QR, or open their UPI ID in a UPI app, then submit the
 * UPI reference (POST /api/payments/scan-and-pay); the seller confirms the money arrived. Offered when the seller has
 * set it up.
 */
export interface ScanAndPayOption {
  payeeName: string
  upiId: string | null
  upiLink: string | null // "upi://pay?pa=...&am=730.00&..." with the amount filled in; with the UPI ID
  qrImageUrl: string | null // the QR the seller uploaded (signed media URL), shown first
  generatedQr: string | null // a QR of upiLink as a PNG data URL
}

export interface PaymentCheckout {
  paymentId: number
  purpose: PaymentPurpose
  referenceId: number
  amount: number // rupees
  currency: 'INR'
  description: string // localized, "Agro Store order #12"
  provider: PaymentProviderKind
  status: PaymentStatusCode
  stripe: StripeCheckout | null // set when provider is STRIPE
  razorpay: RazorpayCheckout | null // set when provider is RAZORPAY
  scanAndPay: ScanAndPayOption | null
}

/** POST /api/payments/scan-and-pay (201, PaymentStatus with status PROCESSING) */
export interface ScanAndPayRequest {
  purpose: PaymentPurpose
  referenceId: number
  upiReference: string // the 12-digit UPI transaction ID (UTR) the UPI app showed
}

/**
 * GET /api/payments/{id}; POST /api/payments/{id}/confirm (body: ConfirmPaymentRequest).
 * Stripe confirmations need no body (the server re-reads the PaymentIntent). Webhooks
 * (POST /api/payments/webhooks/stripe|razorpay, signature-verified) settle payments server-side too.
 */
export interface PaymentStatus {
  paymentId: number
  purpose: PaymentPurpose
  referenceId: number
  amount: number
  description: string
  provider: PaymentProviderKind
  status: PaymentStatusCode
  failureReason: string | null
  payeeName: string | null // Scan & Pay: who the farmer paid, and who confirms it
  upiReference: string | null // Scan & Pay: the UPI reference the farmer entered
  updatedAt: string
}

/** How a test payment with the SIMULATED provider ends, and what the tester "paid" with. */
export type SimulatedOutcome = 'SUCCEEDED' | 'FAILED'
export type SimulatedMethod = 'CARD' | 'UPI'

export interface ConfirmPaymentRequest {
  razorpayPaymentId?: string
  razorpayOrderId?: string
  razorpaySignature?: string
  simulatedOutcome?: SimulatedOutcome // SIMULATED provider only
  simulatedMethod?: SimulatedMethod
}

// ---------------------------------------------------------------- Voice assistant

export interface AssistantTurn {
  role: 'user' | 'assistant'
  text: string
}

/** POST /api/assistant/ask */
export interface AssistantQuestion {
  question: string // 1–500 chars, in any of the three languages
  language: LanguageCode // the answer's language
  history?: AssistantTurn[] // up to the last 6 turns of this conversation
}

export interface AssistantAction {
  label: string // localized, "Open treatment plan"
  route: string // app route, "/treatment"
}

export interface AssistantAnswer {
  answer: string // plain text, 1–4 short sentences in `language`; safe to read aloud
  language: LanguageCode
  engine: 'CLAUDE' | 'RULES' // CLAUDE when ANTHROPIC_API_KEY is configured and the call succeeded
  suggestions: string[] // up to 3 follow-up questions in `language`
  actions: AssistantAction[]
}

// ---------------------------------------------------------------- Vehicle-owner portal (/api/owner/**)

/** GET /api/owner/me; PUT /api/owner/me (body: OwnerProfileInput) */
export interface VehicleOwnerProfile {
  id: number
  userId: number
  name: string // shown to farmers as the operator, "Rameshwar Patil"
  businessName: string | null // "Shivraj Agro Service"
  phone: string
  hubId: number
  hubName: string
  upiId: string | null // where Scan & Pay sends farmers' payments
  upiQrUrl: string | null // the UPI QR the owner uploaded; POST/DELETE /api/owner/me/upi-qr
  acceptsScanAndPay: boolean
}

export interface OwnerProfileInput {
  name: string
  businessName: string | null
  hubId: number
  upiId: string | null // "" or null removes it
}

/** GET /api/owner/dashboard */
export interface OwnerDashboard {
  listingsTotal: number
  listingsOnline: number
  pendingRequests: number
  earningsThisMonth: number // rupees from PAID bookings completed this month
  upcoming: OwnerBooking[] // ACCEPTED bookings, soonest first (max 5)
}

export interface OwnerSpec {
  value: LocalizedText // "6 Feet"
  label: LocalizedText // "Rotavator Width"
}

export interface OwnerFeature {
  icon: string
  text: LocalizedText
}

/** GET /api/owner/listings; PUT/PATCH responses. The owner's editable view of a vehicle. */
export interface OwnerListing {
  id: number
  category: RentalCategory
  hubId: number
  name: LocalizedText
  description: LocalizedText
  imageUrl: string | null
  icon: string | null // shown when there is no photo
  rate: number
  rateUnit: RateUnit
  rateNote: LocalizedText | null
  availability: LocalizedText
  online: boolean
  specs: OwnerSpec[]
  features: OwnerFeature[]
  openBookings: number // REQUESTED + ACCEPTED
}

/** POST /api/owner/listings (201), PUT /api/owner/listings/{id}. */
export interface OwnerListingInput {
  category: RentalCategory
  hubId: number
  name: LocalizedText
  description: LocalizedText
  icon: string | null // Material Symbol for the tile when there is no photo; default by category
  rate: number // 1–100000
  rateUnit: RateUnit
  rateNote: LocalizedText | null
  availability: LocalizedText
  online: boolean
  specs: OwnerSpec[] // max 3
  features: OwnerFeature[] // max 4
}

/**
 * PATCH /api/owner/listings/{id}/online (body { online: boolean }); POST /api/owner/listings/{id}/photo
 * (multipart part `image`, max 10 MB); DELETE /api/owner/listings/{id} (204; 409 with open bookings).
 * GET /api/owner/bookings?status= ; POST /api/owner/bookings/{id}/accept, /decline (body BookingReasonRequest),
 * /start (ACCEPTED → IN_PROGRESS) and /complete (IN_PROGRESS → COMPLETED); invalid transitions answer 409.
 */
export interface OwnerBooking {
  id: number
  listingId: number
  listingName: string
  farmerName: string
  farmerPhone: string
  farmerLocation: string
  slotLabel: string
  estimatedUnits: number
  rateUnit: RateUnit
  amount: number
  status: BookingStatus
  paymentStatus: BookingPaymentStatus
  createdAt: string
}

/** GET /api/owner/bookings/{id} — the owner's booking screen with the same timeline the farmer sees. */
export interface OwnerBookingDetail extends OwnerBooking {
  timeline: BookingEvent[]
  canAccept: boolean
  canDecline: boolean
  canStart: boolean
  canComplete: boolean
}

// ---------------------------------------------------------------- Notifications (D10, every role)

/**
 * Who receives what: BOOKING_REQUESTED and BOOKING_CANCELLED go to the owner; BOOKING_ACCEPTED, _DECLINED,
 * _STARTED and _COMPLETED go to the farmer; PAYMENT_SUCCEEDED goes to the payer (and, for a booking, the
 * owner); PAYMENT_FAILED goes to the payer.
 */
export type NotificationType =
  | 'BOOKING_REQUESTED'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_DECLINED'
  | 'BOOKING_STARTED'
  | 'BOOKING_COMPLETED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_SUCCEEDED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_TO_CONFIRM' // to the shopkeeper or owner: a farmer paid them by Scan & Pay
  | 'PAYMENT_NOT_RECEIVED' // to the payer: the seller did not receive a Scan & Pay payment

/**
 * GET /api/notifications?page=&size= (PageResponse<AppNotification>, newest first);
 * GET /api/notifications/unread-count ({ count }); POST /api/notifications/{id}/read (AppNotification);
 * POST /api/notifications/read-all (204).
 * GET /api/notifications/stream — text/event-stream with events `notification` (data: AppNotification JSON)
 * and `ping` (every 25 s). Send the bearer token, so read it with fetch, not EventSource; titles and bodies
 * come in the stream request's Accept-Language (reconnect after a language switch or token refresh).
 */
export interface AppNotification {
  id: number
  type: NotificationType
  title: string // localized, "New booking request"
  body: string // localized, "Rishikesh wants Mahindra 575 DI for Slot: 02:00 PM Today (2 hrs, ₹1,300)"
  route: string // screen to open, "/owner/bookings/7" or "/bookings/7"
  read: boolean
  createdAt: string
}

export interface UnreadCount {
  count: number
}

// ---------------------------------------------------------------- Admin portal (/api/admin/**)

/** GET /api/admin/overview */
export interface AdminOverview {
  usersByRole: Record<Role, number>
  activeListings: number
  pendingBookings: number
  ordersToday: number
  revenueThisMonth: number // rupees from SUCCEEDED payments
  scansThisWeek: number
}

/** GET /api/admin/users?q=&role=&page=&size= (PageResponse<AdminUser>); PATCH /api/admin/users/{id} */
export interface AdminUser {
  id: number
  name: string
  phone: string
  email: string | null
  roles: Role[]
  active: boolean
  preferredLanguage: LanguageCode
  createdAt: string
  lastLoginAt: string | null
  farmerId: number | null
  ownerId: number | null
}

/**
 * POST /api/admin/users (201; 409 when the phone is taken). A FARMER role needs `farmer`, a VEHICLE_OWNER
 * role needs `owner`: the matching profile is created with the account.
 */
export interface CreateUserRequest {
  name: string
  phone: string
  email: string | null
  roles: Role[]
  password: string
  preferredLanguage: LanguageCode
  farmer: { location: string; season: string } | null
  owner: { businessName: string | null; hubId: number } | null
}

/** PATCH /api/admin/users/{id}. Admins cannot deactivate themselves or drop their own ADMIN role (409). */
export interface UpdateUserRequest {
  name?: string
  email?: string | null
  roles?: Role[]
  active?: boolean
  preferredLanguage?: LanguageCode
}

/** POST /api/admin/users/{id}/reset-password (204) */
export interface ResetPasswordRequest {
  newPassword: string
}

/** GET /api/admin/markets; PATCH /api/admin/markets/{id} (body { open?, arrivalsQuintals? }) */
export interface AdminMarket {
  id: number
  name: LocalizedText
  shortName: LocalizedText
  district: string
  open: boolean
  arrivalsQuintals: number
  pricesUpdatedAt: string
  commodityCount: number
}

/** GET /api/admin/markets/{id}/prices */
export interface AdminCommodityPrice {
  id: number
  marketId: number
  category: LocalizedText
  name: LocalizedText
  grade: LocalizedText
  unit: LocalizedText
  minPrice: number
  maxPrice: number
  changeAmount: number // server-computed: new maxPrice − previous maxPrice
  demand: DemandLevel
  updatedAt: string
}

/**
 * POST /api/admin/markets/{id}/prices (201), PUT /api/admin/prices/{id}, DELETE /api/admin/prices/{id} (204).
 * Saving a price stamps the market's pricesUpdatedAt. minPrice ≤ maxPrice, both 1–1,000,000.
 */
export interface CommodityPriceInput {
  category: LocalizedText
  name: LocalizedText
  grade: LocalizedText
  unit: LocalizedText
  minPrice: number
  maxPrice: number
  demand: DemandLevel
}

/** GET /api/admin/rentals; PATCH /api/admin/rentals/{id} (body { rate?, rateUnit?, online? }) */
export interface AdminRentalListing {
  id: number
  name: string // localized display name
  category: RentalCategory
  hubName: string
  ownerName: string
  ownerPhone: string
  rate: number
  rateUnit: RateUnit
  online: boolean
  imageUrl: string | null
  icon: string | null
}

/** GET /api/admin/products; PATCH /api/admin/products/{id} (body { price?, mrp?, flashDeal?, inStock? }) */
export interface AdminProduct {
  id: number
  name: string // localized display name
  category: ProductCategory
  price: number
  mrp: number | null
  flashDeal: boolean
  inStock: boolean
  imageUrl: string | null
  barcode: string | null
  shopName: string
}

/** GET /api/admin/payments?status=&page=&size= (PageResponse<AdminPayment>, newest first) */
export interface AdminPayment {
  id: number
  purpose: PaymentPurpose
  referenceId: number
  payerName: string
  payerPhone: string
  amount: number
  provider: PaymentProviderKind
  status: PaymentStatusCode
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------- Sellers: Scan & Pay confirmations (/api/seller/**)

/**
 * GET /api/seller/payments?status= (newest first; status=PROCESSING lists those to confirm), for shopkeepers and
 * vehicle owners; POST /api/seller/payments/{id}/received and /not-received (body { reason? }) return it updated.
 */
export interface SellerPayment {
  paymentId: number
  purpose: PaymentPurpose
  referenceId: number // the order or booking id
  amount: number
  description: string // "Agro Store order #12"
  payerName: string
  payerPhone: string
  upiReference: string // look for it in the bank statement
  status: PaymentStatusCode // PROCESSING until the seller decides, then SUCCEEDED or FAILED
  failureReason: string | null
  submittedAt: string
  updatedAt: string
}

// ---------------------------------------------------------------- Shopkeeper portal (/api/shop/**)

/** GET /api/shop/me; PUT /api/shop/me (body: ShopProfileInput); POST/DELETE /api/shop/me/upi-qr (multipart "image") */
export interface ShopProfile {
  id: number
  name: string // "Solapur Mandi Agro Depot"
  place: string // "Karmala, Solapur"
  phone: string
  upiId: string | null
  upiQrUrl: string | null
  acceptsScanAndPay: boolean
}

export interface ShopProfileInput {
  name: string
  place: string
  upiId: string | null // "" or null removes it
}

/**
 * GET /api/shop/products (newest first), GET /api/shop/products/{id}; POST and PUT take ShopProductInput;
 * PATCH /api/shop/products/{id}/stock ({ inStock }); POST /api/shop/products/{id}/photo (multipart "image").
 */
export interface ShopProduct {
  id: number
  name: LocalizedText
  category: ProductCategory
  packSize: LocalizedText | null
  description: LocalizedText
  price: number
  mrp: number | null
  inStock: boolean
  barcode: string | null
  imageUrl: string | null
}

export interface ShopProductInput {
  name: LocalizedText
  category: ProductCategory
  packSize: LocalizedText | null
  description: LocalizedText
  price: number // 1 to 10,00,000
  mrp: number | null // at least the price
  inStock: boolean
  barcode: string | null // 13-digit EAN-13
}

/** GET /api/shop/orders?status= (newest first): an order placed with the shop, with the customer to deliver to. */
export interface ShopOrder {
  id: number
  placedAt: string
  customerName: string
  customerPhone: string
  itemCount: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  summary: string
  lines: OrderLine[]
}

/** GET /api/shop/dashboard */
export interface ShopDashboard {
  shopName: string
  ordersToday: number
  salesToday: number
  paymentsToVerify: number // orders paid by Scan & Pay waiting for the shopkeeper
  products: number
  outOfStock: number
  acceptsScanAndPay: boolean
  recentOrders: ShopOrder[]
}
