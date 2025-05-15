// app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    const state = req.nextUrl.searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(`${req.nextUrl.origin}/?error=missing_code_or_state`)
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        },
      }
    )

    const { access_token } = response.data;

    // TODO: averiguar para guardar el token en una cookie
    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard?access_token=${access_token}`);
  } catch (error) {
    return NextResponse.redirect(`${req.nextUrl.origin}/?error=token_failed`);
  }
}
