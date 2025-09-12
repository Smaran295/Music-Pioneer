// Auto-detect API base (local or Vercel)
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000" // for local dev if you run Vercel dev
  : "https://your-vercel-app.vercel.app"; // 🔥 replace with your Vercel domain

async function searchSongs() {
  const query = document.getElementById("query").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    // 1. Fetch Spotify token from backend
    const tokenRes = await fetch(`${API_BASE}/api/spotify`);
    if (!tokenRes.ok) throw new Error("Failed to fetch Spotify token");
    const { access_token } = await tokenRes.json();

    // 2. Search on Spotify
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!spotifyRes.ok) {
      const errData = await spotifyRes.json();
      throw new Error("Spotify API error: " + JSON.stringify(errData));
    }

    const spotifyData = await spotifyRes.json();
    console.log("Spotify response:", spotifyData);

    resultsDiv.innerHTML = "";

    if (!spotifyData.tracks || spotifyData.tracks.items.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    spotifyData.tracks.items.forEach(track => {
      const div = document.createElement("div");
      div.className = "song";

      div.innerHTML = `
        <img src="${track.album.images[0]?.url || ""}" alt="cover">
        <div>
          <strong>${track.name}</strong><br>
          <span>${track.artists.map(a => a.name).join(", ")}</span><br>
          <audio controls src="${track.preview_url || ""}"></audio>
        </div>
      `;

      resultsDiv.appendChild(div);
    });

    // 3. Fetch artist bio from TheAudioDB (optional)
    const artist = spotifyData.tracks.items[0].artists[0].name;
    const tdbRes = await fetch(
      `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artist)}`
    );
    const tdbData = await tdbRes.json();

    if (tdbData.artists) {
      const bio = document.createElement("p");
      bio.innerHTML = `<strong>About ${artist}:</strong> ${
        tdbData.artists[0].strBiographyEN || "No bio available."
      }`;
      resultsDiv.appendChild(bio);
    }
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    console.error(err);
  }
}
