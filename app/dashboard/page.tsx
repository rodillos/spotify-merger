'use client'

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')

    if (token) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setProfile(data))
    }
  }, [])

  if (!profile) return <p>Cargando perfil...</p>

  return (
    <div className="p-8">
      <h2 className="text-xl mb-4">Bienvenido, {profile.display_name}</h2>
      <p>Tu correo: {profile.email}</p>
      <p>País: {profile.country}</p>
    </div>
  )
}
