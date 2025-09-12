const API_BASE = "https://your-vercel-app.vercel.app"; // change to your Vercel domain

async function getSpotifyToken() {
  const res = await fetch(`${API_BASE}/api/spotify`);
  if (!res.ok) throw new Error("Failed to fetch Spotify token");
  return res.json();
}
