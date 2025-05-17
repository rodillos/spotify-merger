// app/api/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const client_id = process.env.SPOTIFY_CLIENT_ID!
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!

export async function POST(req: NextRequest) {
  const cookies = req.cookies
  const refresh_token = cookies.get('spotify_refresh_token')?.value

  if (!refresh_token) {
    return NextResponse.json({ error: 'Missing refresh_token' }, { status: 400 })
  }

  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refresh_token)

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        },
      }
    )

    const { access_token, expires_in, refresh_token: new_refresh_token } = response.data

    const res = NextResponse.json({ access_token })

    // Set updated access token
    res.cookies.set('spotify_access_token', access_token, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: expires_in,
    })

    // Set new refresh token if provided
    if (new_refresh_token) {
      res.cookies.set('spotify_refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 días
      })
    }

    return res
  } catch (error) {
    console.error('Error refreshing token:', error)
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 })
  }
}
