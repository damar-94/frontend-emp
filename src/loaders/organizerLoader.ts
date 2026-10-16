import { useAuth } from "@/stores/useAuth";
import { redirect } from "react-router";

export const organizerLoader = () => {
  const { user } = useAuth.getState();

  if (!user) return redirect("/login");

  if (user.role !== "EVENTORGANIZER") return redirect("/");

  return null;
};
