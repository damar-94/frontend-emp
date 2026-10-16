import { useAuth } from "@/stores/useAuth";
import { redirect } from "react-router";

// Loader untuk memastikan user sudah login baru bisa akses
export const loginLoader = () => {
  const { user } = useAuth.getState();

  if (!user) redirect("/login");

  return null;
};
