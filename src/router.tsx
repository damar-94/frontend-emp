import { createBrowserRouter } from "react-router";
import { OrganizerRoute } from "./components/OrganizerRoute";
import { guestLoader } from "./loaders/guestLoader";
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
import EventOrganizerDashboardPage from "./pages/EventOrganizerDashboardPage";
import { loginLoader } from "./loaders/loginLoader";
import { CategoryPage } from "./pages/CategoryPage";
import { TransactionPaymentPage } from "./pages/TransactionPaymentPage";

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
    path: "event-organizer-dashboard",
    element: <EventOrganizerDashboardPage />,
  },
  {
    path: "/categories",
    element: <CategoryPage />,
  },
]);
