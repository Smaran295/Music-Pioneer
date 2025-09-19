export default async function handler(req, res) {
  const target = 'https://annonymous-sage.vercel.app';
  const url = target + req.url.replace('/api', '');
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}
