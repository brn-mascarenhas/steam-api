import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Home() {
    const router = useRouter();
    const [steamId, setSteamId] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`/api/validateSteamId?steamid=${steamId}`)
        const data = await res.json()

        if (data.valid) {
            router.push(`/perfil/${steamId}`)
        } else {
            alert('Steam ID inválido ou perfil privado')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-grey-900 text-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-grey-800 p-8 rounded-x1 shadow-x1">
                <h1 className="text-2-x font-bold">Digite seu SteamID</h1>
                <input
                    type="text"
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                    className="p-2 rounded bg-grey text-white focus:outline-none"
                    placeholder="Ex: 76561197960435530"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded p-2 font-semibold">
                    Ver perfil
                </button>
            </form>
        </main>
    )




}