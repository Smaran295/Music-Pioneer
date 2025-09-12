const API_BASE = "https:musicpioneer.vercel.app"; 

async function getSpotifyToken() {
  const res = await fetch(`${API_BASE}/api/spotify`);
  if (!res.ok) throw new Error("Failed to get Spotify token");
  const data = await res.json();
  return data.access_token;
}

async function searchSongs() {
  const query = document.getElementById("query").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  try {
    const token = await getSpotifyToken();
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error("Spotify search failed");

    const data = await res.json();
    resultsDiv.innerHTML = "";

    data.tracks.items.forEach(track => {
      const div = document.createElement("div");
      div.className = "song";

      const img = track.album.images.length > 0 ? track.album.images[0].url : "";
      const preview = track.preview_url;

      div.innerHTML = `
        <img src="${img}" alt="cover">
        <div>
          <strong>${track.name}</strong><br>
          <span>${track.artists.map(a => a.name).join(", ")}</span><br>
          ${preview ? `<audio controls src="${preview}"></audio>` : `<span>No preview available</span>`}
        </div>
      `;

      resultsDiv.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}
