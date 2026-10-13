import { createBrowserRouter } from "react-router";
import { OrganizerRoute } from "./components/OrganizerRoute";
import { guestLoader } from "./loaders/guestLoader";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EventBrowsingPage } from "./pages/EventBrowsingPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

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
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>,
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
]);
