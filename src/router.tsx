import { createBrowserRouter } from "react-router";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { guestLoader } from "./loaders/guestLoader";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EventBrowsingPage } from "./pages/EventBrowsingPage";
import { EventDetailPage } from "./pages/EventDetailPage";

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
    path: "/event-creation",
    element: <CreateEventPage/>
  },
  {
    path: "/events",
    element: <EventBrowsingPage/>
  },
  {
    path: "/events/:id",
    element: <EventDetailPage/>
  },
]);