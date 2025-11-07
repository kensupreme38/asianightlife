"use client"

import { useAuth } from "@/contexts/auth-context"

export default function DJClient() {
    const {currentUser} = useAuth()
    return <div>DJ {JSON.stringify(currentUser)}</div>
}