import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import LoginPage from './auth/LoginPage'
import { RequireRole } from './auth/RequireRole'
import { AdminLayout } from './components/layout/AdminLayout'
import { AppShell } from './components/layout/AppShell'
import { FarmerLayout } from './components/layout/FarmerLayout'
import { OwnerLayout } from './components/layout/OwnerLayout'
import type { RouteHandle } from './components/layout/route-handle'
import { RouteError } from './components/layout/RouteError'
import { TabLayout } from './components/layout/TabLayout'
import { SplashScreen } from './components/SplashScreen'
import type { MessageSelector } from './i18n/translation'
import NotificationsPage from './notifications/NotificationsPage'
import AgroStorePage from './pages/AgroStorePage'
import BookingDetailPage from './pages/bookings/BookingDetailPage'
import BookingsPage from './pages/bookings/BookingsPage'
import DiagnosisPage from './pages/DiagnosisPage'
import HomePage from './pages/HomePage'
import MandiPage from './pages/MandiPage'
import NotFoundPage from './pages/NotFoundPage'
import OrdersPage from './pages/orders/OrdersPage'
import PaymentPage from './pages/payments/PaymentPage'
import PaymentResultPage from './pages/payments/PaymentResultPage'
import PlotsPage from './pages/plots/PlotsPage'
import ProfilePage from './pages/ProfilePage'
import RentalsPage from './pages/RentalsPage'
import ScanPage from './pages/ScanPage'
import CatalogPage from './pages/store/CatalogPage'
import TreatmentPage from './pages/TreatmentPage'

const screen = (title: MessageSelector): RouteHandle => ({ title })

/** Loads a default-exported page on first visit: the partner and admin portals download only for those roles. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default })

const profile = { path: 'profile', element: <ProfilePage />, handle: screen((t) => t.nav.screens.profile) }
const notFound = { path: '*', element: <NotFoundPage />, handle: screen((t) => t.nav.screens.notFound) }

/**
 * /login, the farmer app (FARMER) at the root, the partner portal under /owner (VEHICLE_OWNER) and the admin
 * portal under /admin (ADMIN) (D8). The farmer tab screens are the Stitch screens of the "Smart Crop Health
 * Advisor" project.
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <SplashScreen />,
    children: [
      { path: 'login', element: <LoginPage />, handle: screen((t) => t.nav.screens.login) },
      {
        element: (
          <RequireRole roles={['FARMER']}>
            <FarmerLayout />
          </RequireRole>
        ),
        children: [
          // Full-screen flows with a back header instead of the tab bar
          { path: 'scan', element: <ScanPage />, handle: screen((t) => t.nav.screens.scan) },
          { path: 'pay/:paymentId', element: <PaymentPage />, handle: screen((t) => t.nav.screens.payment) },
          {
            path: 'pay/:paymentId/result',
            element: <PaymentResultPage />,
            handle: screen((t) => t.nav.screens.paymentResult),
          },
          {
            element: <TabLayout />,
            children: [
              { index: true, element: <HomePage />, handle: screen((t) => t.nav.screens.home) },
              // Diagnosis of the latest scan, or of a specific one
              { path: 'diagnosis', element: <DiagnosisPage />, handle: screen((t) => t.nav.screens.diagnosis) },
              { path: 'diagnosis/:scanId', element: <DiagnosisPage />, handle: screen((t) => t.nav.screens.diagnosis) },
              // The active treatment plan, or a specific one
              { path: 'treatment', element: <TreatmentPage />, handle: screen((t) => t.nav.screens.treatment) },
              { path: 'treatment/:planId', element: <TreatmentPage />, handle: screen((t) => t.nav.screens.treatment) },
              { path: 'mandi', element: <MandiPage />, handle: screen((t) => t.nav.screens.mandi) },
              { path: 'rentals', element: <RentalsPage />, handle: screen((t) => t.nav.screens.rentals) },
              { path: 'store', element: <AgroStorePage />, handle: screen((t) => t.nav.screens.store) },
              { path: 'store/catalog', element: <CatalogPage />, handle: screen((t) => t.nav.screens.catalog) },
              { path: 'plots', element: <PlotsPage />, handle: screen((t) => t.nav.screens.plots) },
              { path: 'bookings', element: <BookingsPage />, handle: screen((t) => t.nav.screens.bookings) },
              // Booking tracking: the owner's confirmation, the job's progress and payment (D9)
              { path: 'bookings/:id', element: <BookingDetailPage />, handle: screen((t) => t.nav.screens.bookingDetail) },
              {
                path: 'notifications',
                element: <NotificationsPage />,
                handle: screen((t) => t.nav.screens.notifications),
              },
              { path: 'orders', element: <OrdersPage />, handle: screen((t) => t.nav.screens.orders) },
              profile,
              notFound,
            ],
          },
        ],
      },
      {
        path: 'owner',
        element: (
          <RequireRole roles={['VEHICLE_OWNER']}>
            <OwnerLayout />
          </RequireRole>
        ),
        children: [
          {
            index: true,
            lazy: page(() => import('./owner/OwnerDashboardPage')),
            handle: screen((t) => t.nav.screens.ownerDashboard),
          },
          {
            path: 'vehicles',
            lazy: page(() => import('./owner/vehicles/VehiclesPage')),
            handle: screen((t) => t.nav.screens.vehicles),
          },
          {
            path: 'vehicles/new',
            lazy: page(() => import('./owner/vehicles/VehicleFormPage')),
            handle: screen((t) => t.nav.screens.newVehicle),
          },
          {
            path: 'vehicles/:id',
            lazy: page(() => import('./owner/vehicles/VehicleFormPage')),
            handle: screen((t) => t.nav.screens.editVehicle),
          },
          {
            path: 'bookings',
            lazy: page(() => import('./owner/bookings/OwnerBookingsPage')),
            handle: screen((t) => t.nav.screens.ownerBookings),
          },
          {
            path: 'bookings/:id',
            lazy: page(() => import('./owner/bookings/OwnerBookingDetailPage')),
            handle: screen((t) => t.nav.screens.ownerBookingDetail),
          },
          {
            path: 'notifications',
            lazy: page(() => import('./notifications/NotificationsPage')),
            handle: screen((t) => t.nav.screens.notifications),
          },
          profile,
          notFound,
        ],
      },
      {
        path: 'admin',
        element: (
          <RequireRole roles={['ADMIN']}>
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          {
            index: true,
            lazy: page(() => import('./admin/AdminOverviewPage')),
            handle: screen((t) => t.nav.screens.adminOverview),
          },
          {
            path: 'users',
            lazy: page(() => import('./admin/users/UsersPage')),
            handle: screen((t) => t.nav.screens.users),
          },
          {
            path: 'users/new',
            lazy: page(() => import('./admin/users/UserCreatePage')),
            handle: screen((t) => t.nav.screens.newUser),
          },
          {
            path: 'users/:id',
            lazy: page(() => import('./admin/users/UserDetailsPage')),
            handle: screen((t) => t.nav.screens.userDetails),
          },
          {
            path: 'rates/mandi',
            lazy: page(() => import('./admin/rates/MandiRatesPage')),
            handle: screen((t) => t.nav.screens.mandiRates),
          },
          {
            path: 'rates/rentals',
            lazy: page(() => import('./admin/rates/RentalRatesPage')),
            handle: screen((t) => t.nav.screens.rentalRates),
          },
          {
            path: 'rates/products',
            lazy: page(() => import('./admin/rates/ProductPricesPage')),
            handle: screen((t) => t.nav.screens.productPrices),
          },
          {
            path: 'payments',
            lazy: page(() => import('./admin/payments/AdminPaymentsPage')),
            handle: screen((t) => t.nav.screens.payments),
          },
          profile,
          notFound,
        ],
      },
    ],
  },
])
