import { createBrowserRouter } from "react-router";
import { OrganizerRoute } from "./components/OrganizerRoute";
import { guestLoader } from "./loaders/guestLoader";
import { loginLoader } from "./loaders/loginLoader";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EventBrowsingPage } from "./pages/EventBrowsingPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPassword";
import { TransactionPaymentPage } from "./pages/TransactionPaymentPage";

import AdminDashboardLayout from "./pages/dashboards/admin/AdminDashboardLayout";
import { AdminOverview } from "./pages/dashboards/admin/AdminOverview";
import { AdminManageUsers } from "./pages/dashboards/admin/AdminManageUsers";
import AdminManageEvents from "./pages/dashboards/admin/AdminManageEvents";
import { AdminCategory } from "./pages/dashboards/admin/AdminCategory";
import { ProfileUser } from "./pages/dashboards/shared/ProfileUser";
import { ChangePasswordUser } from "./pages/dashboards/shared/ChangePasswordUser";

import CustomerDashboardLayout from "./pages/dashboards/customer/CustomerDashboardLayout";
import { CustomerTransactions } from "./pages/dashboards/customer/CustomerTransactions";
import { CustomerPoints } from "./pages/dashboards/customer/CustomerPoints";
import { CustomerReview } from "./pages/dashboards/customer/CustomerReview";

import OrganizerDashboardLayout from "./pages/dashboards/event-organizer/EventOrganizerDashboardLayout";
import EventOrganizerOverview from "./pages/dashboards/event-organizer/EventOrganizerOverview";
import EventOrganizerMyEvents from "./pages/dashboards/event-organizer/EventOrganizerMyEvents";
import EventOrganizerTransactions from "./pages/dashboards/event-organizer/EventOrganizerTransactions";
import { EventOrganizerReviews } from "./pages/dashboards/event-organizer/EventOrganizerReviews";
import { adminDashboardLoader, customerDashboardLoader, organizerDashboardLoader } from "./loaders/roleDashboardLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: guestLoader,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: guestLoader,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    loader: loginLoader,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/event-creation",
    element: (
      <OrganizerRoute>
        <CreateEventPage />
      </OrganizerRoute>
    ),
  },
  {
    path: "/events",
    element: <EventBrowsingPage />,
  },
  {
    path: "/events/:id",
    element: <EventDetailPage />,
  },
  {
    path: "/transactions/:id",
    element: <TransactionPaymentPage />,
    loader: loginLoader,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/customer-dashboard",
    loader: customerDashboardLoader,
    element: <CustomerDashboardLayout />,
    children: [
      {
        index: true,
        element: <CustomerTransactions />,
      },
      {
        path: "transactions",
        element: <CustomerTransactions />,
      },
      {
        path: "points",
        element: <CustomerPoints />,
      },
      {
        path: "reviews",
        element: <CustomerReview />,
      },
      {
        path: "profile",
        element: <ProfileUser />,
      },
      {
        path: "change-password",
        element: <ChangePasswordUser />,
      },
    ],
  },
  {
    path: "/event-organizer-dashboard",
    loader: organizerDashboardLoader,
    element: <OrganizerDashboardLayout />,
    children: [
      {
        index: true,
        element: <EventOrganizerOverview />,
      },
      {
        path: "events",
        element: <EventOrganizerMyEvents />,
      },
      {
        path: "transactions",
        element: <EventOrganizerTransactions />,
      },
      {
        path: "reviews",
        element: <EventOrganizerReviews />,
      },
      {
        path: "profile",
        element: <ProfileUser />,
      },
      {
        path: "change-password",
        element: <ChangePasswordUser />,
      },
    ],
  },
  {
    path: "/admin",
    loader: adminDashboardLoader,
    element: <AdminDashboardLayout />,
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: "users",
        element: <AdminManageUsers />,
      },
      {
        path: "events",
        element: <AdminManageEvents />,
      },
      {
        path: "categories",
        element: <AdminCategory />,
      },
      {
        path: "profile",
        element: <ProfileUser />,
      },
      {
        path: "change-password",
        element: <ChangePasswordUser />,
      },
    ],
  },
]);
