import { useAuth } from "@/stores/useAuth";
import { redirect } from "react-router";

export const adminDashboardLoader = () => {
  const { user } = useAuth.getState();

  if (!user) return redirect("/login");

  if (user.role !== "ADMIN") {
    return redirect("/");
  }

  return null;
};

export const customerDashboardLoader = () => {
  const { user } = useAuth.getState();

  if (!user) return redirect("/login");

  if (user.role !== "CUSTOMER") {
    return redirect("/");
  }

  return null;
};

export const organizerDashboardLoader = () => {
  const { user } = useAuth.getState();

  if (!user) return redirect("/login");

  if (user.role !== "EVENTORGANIZER") {
    return redirect("/");
  }

  return null;
};
