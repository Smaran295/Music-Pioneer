export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const apiUrl = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`;
    console.log(`Fetching from: ${apiUrl}`);
    const response = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } });
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    console.log(`Response text: ${text.substring(0, 100)}...`); // Log first 100 chars
    const data = text ? JSON.parse(text) : {};
    console.log(`Parsed data: ${JSON.stringify(data)}`);
    res.status(200).json(data);
  } catch (err) {
    console.error("API fetch error:", err.message);
    res.status(500).json({ error: `Failed to fetch data: ${err.message}` });
  }
}
