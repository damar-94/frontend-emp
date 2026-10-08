import { useAuth } from "@/stores/useAuth"
import { redirect } from "react-router"

export const guestLoader = () => {
    const { user } = useAuth.getState()

    if (user) return redirect ("/")

    return {}
}