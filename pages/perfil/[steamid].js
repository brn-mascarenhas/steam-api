import { notFound } from "next/navigation";
import React from "react";

export async function getServerSideProps(context) {
    const { steamid } = context.params
    const apiKey = 'YOUR-API_KEY'

    const summaryRes = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamid}`
    )
    const summaryData = await summaryRes.json()
    const player = summaryData.response?.players?.[0]

    if (!player) {
        return { notFound: true }
    }

    // Buscar jogos recentes
    let recentGames = []

    try {
        const gamesRes = await fetch(
            `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamid}&format=json`
        )
        const gamesData = await gamesRes.json()
        recentGames = gamesData.response?.games || []
    } catch (error) {
        console.error('Erro ao buscar jogos recentes:', error)
    }

    return {
        props: {
            player,
            recentGames,
        },
    }
}

export default function Perfil({ player, recentGames }) {
    return (
        <main className="min-h-screen bg-grey-900 text-white p-6">
            <div className="max-w-4x1 mx-auto">
                {/* Cabeçalho do perfil */}
                <div className="flex items-center gap-4 mb-6">
                    <img src={player?.avatarfull} alt="Avatar do jogador" className="w-24 h24 rounded-full border-4 border-blue-600" />
                    <div>
                        <h1 className="text-3x1 font-bold">{player.personaname}</h1>
                        <p className="text-sm text-grey-400">{player.profieurl}</p>
                    </div>
                </div>

                {/* Jogos recenter */}
                <div className="gb-grey-800 p-4 rounded-x1 shadow-lg">
                    <h2 className="text-x1 font-semibold mb-4">Jogos Recentes</h2>
                    {recentGames.length === 0 ? (
                        <p>Nenhum jogo recente encontrado.</p>
                    ) : (
                        <ul className="space-y-2">
                            {recentGames.map((game) => (
                                <li key={game.appid} className="flex items-center gap-4">
                                    <img
                                        src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                        alt={game.name}
                                        className="w-10 h-10"
                                    />
                                    <div>
                                        <p className="font-medium">{game.name}</p>
                                        <p className="text-sm text-gray-400">
                                            Tempo jogado: {(game.playtime_forever / 60).toFixed(1)} horas
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    )
}