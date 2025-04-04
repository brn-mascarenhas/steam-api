export default async function handler(req, res) {
    const { steamid } = req.query
  
    if (!steamid) {
      return res.status(400).json({ valid: false, error: 'SteamID não fornecido' })
    }
  
    const apiKey = 'YOUR-API_KEY'
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamid}`
  
    try {
      const response = await fetch(url)
      const data = await response.json()
  
      const player = data.response?.players?.[0]
  
      // Se não tiver player ou perfil não for público
      if (!player || player.communityvisibilitystate !== 3) {
        return res.status(404).json({ valid: false, error: 'Perfil privado ou não encontrado' })
      }
  
      // Tudo certo!
      return res.status(200).json({ valid: true, player })
    } catch (error) {
      console.error('Erro na API Steam:', error)
      return res.status(500).json({ valid: false, error: 'Erro ao buscar dados da Steam' })
    }
  }
  