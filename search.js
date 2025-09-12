export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const apiUrl = `https://jiosaavn.rajputhemant.dev/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("API fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch data from the external API" });
  }
}