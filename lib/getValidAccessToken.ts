// lib/getValidAccessToken.ts
'use server'

import { cookies } from 'next/headers'
import axios from 'axios'

export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  // ✅ Si el token actual es válido, lo devolvemos directamente
  if (accessToken) {
    return accessToken
  }

  // ⛔ Token vencido, intentamos refrescarlo
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/refresh`,
      null,
      {
        withCredentials: true, // Para que se envíen cookies
      }
    )

    const newAccessToken = res.data.access_token
    return newAccessToken
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    return null
  }
}
