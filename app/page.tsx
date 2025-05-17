import { redirect } from 'next/navigation'
import { getValidAccessToken } from '@/lib/getValidAccessToken';

export default async function Home() {

  const accessToken = await getValidAccessToken();
  accessToken && redirect('/dashboard');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Spotify Login Demo</h1>
      <a
        href="/api/login"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Iniciar sesión con Spotify
      </a>
    </main>
  )
}
