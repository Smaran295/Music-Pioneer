const API_BASE = "https://your-vercel-app.vercel.app"; // change this!

async function searchSongs() {
  const query = document.getElementById("query").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    // 1. Fetch Spotify token
    console.log("Fetching token from:", `${API_BASE}/api/spotify`);
    const tokenRes = await fetch(`${API_BASE}/api/spotify`);

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      throw new Error("Token fetch failed: " + text);
    }

    const { access_token } = await tokenRes.json();
    console.log("Got Spotify token:", access_token ? "yes ✅" : "no ❌");

    // 2. Search Spotify tracks
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!spotifyRes.ok) {
      const err = await spotifyRes.json();
      throw new Error("Spotify search failed: " + JSON.stringify(err));
    }

    const spotifyData = await spotifyRes.json();
    console.log("Spotify search result:", spotifyData);

    resultsDiv.innerHTML = "";

    if (!spotifyData.tracks || spotifyData.tracks.items.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    spotifyData.tracks.items.forEach(track => {
      const div = document.createElement("div");
      div.className = "song";

      div.innerHTML = `
        <img src="${track.album.images[0]?.url || ""}" alt="cover" width="80">
        <div>
          <strong>${track.name}</strong><br>
          <span>${track.artists.map(a => a.name).join(", ")}</span><br>
          ${
            track.preview_url
              ? `<audio controls src="${track.preview_url}"></audio>`
              : "<em>No preview available</em>"
          }
        </div>
      `;

      resultsDiv.appendChild(div);
    });

    // 3. Fetch artist bio from TheAudioDB
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
