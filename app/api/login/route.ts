import { NextResponse } from 'next/server'
import querystring from 'querystring'
import crypto from 'crypto'

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

function generateRandomString(length: number) {
  return crypto.randomBytes(length).toString('hex').slice(0, length)
}

export async function GET() {
  const state = generateRandomString(16)
  const scope = 'playlist-read-private playlist-modify-public playlist-modify-private'

  console.log('Redirect URI:', redirect_uri);

  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  })

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${queryParams}`
  )
}

