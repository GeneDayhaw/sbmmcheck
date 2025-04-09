export default async function handler(req, res) {
  const { gamertag, platform } = req.query;

  const response = await fetch(`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${gamertag}`, {
    headers: {
      'TRN-Api-Key': process.env.TRACKER_API_KEY,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: 'Failed to fetch data' });
  }

  const data = await response.json();
  res.status(200).json(data);
}
