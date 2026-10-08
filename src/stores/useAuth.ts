import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserAuth {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture: string | null;
}

type Store = {
  user: UserAuth | null;
  login: (user: UserAuth) => void;
  logout: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "auth" },
  ),
);
