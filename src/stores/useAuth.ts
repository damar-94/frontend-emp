import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserAuth {
  id: number;
  name: string;
  email: string;
  role: string;
  points: string;
  profilePicture: string | null;
  accessToken: string;
}

type Store = {
  user: UserAuth | null;
  login: (user: UserAuth) => void;
  logout: () => void;
  updateProfilePicture: (profilePicture: string | null) => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateProfilePicture: (profilePicture) =>
        set((state) => ({
          user: state.user ? { ...state.user, profilePicture } : null,
        })),
    }),
    { name: "auth" },
  ),
);
