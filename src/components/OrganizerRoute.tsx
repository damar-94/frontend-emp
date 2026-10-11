import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/stores/useAuth";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface OrganizerRouteProps {
  children?: React.ReactNode;
}

export function OrganizerRoute({ children }: OrganizerRouteProps) {
  // Ambil state user dari store Zustand useAuth
  const { user } = useAuth() as { user: any };

  useEffect(() => {
    if (user && user.role !== "EVENTORGANIZER") {
      toast.error("Akses ditolak! Halaman ini hanya untuk Event Organizer.");
    }
  }, [user]);

  // 1. Jika belum login sama sekali -> Arahkan ke /login
  if (!user || !user.accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 2. Jika sudah login tetapi rolenya CUSTOMER -> Arahkan ke homepage /
  if (user.role !== "EVENTORGANIZER") {
    return <Navigate to="/" replace />;
  }

  // 3. Jika EVENTORGANIZER -> Izinkan akses
  return children ? <>{children}</> : <Outlet />;
}