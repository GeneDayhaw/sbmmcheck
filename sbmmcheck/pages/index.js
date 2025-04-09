import { useState } from 'react';

export default function Home() {
  const [gamertag, setGamertag] = useState('');
  const [platform, setPlatform] = useState('origin');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/apexStats?gamertag=${gamertag}&platform=${platform}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Request failed');
    }
  };

  const calculateSweatScore = (kd, damage) => {
    let score = 0;
    if (kd > 2.5) score += 5;
    else if (kd > 1.5) score += 3;
    else score += 1;

    if (damage > 800) score += 5;
    else if (damage > 500) score += 3;
    else score += 1;

    return Math.min(score, 10);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#111', color: '#eee', minHeight: '100vh' }}>
      <h1>SBMMCheck.gg</h1>
      <p>Enter your Apex Legends gamertag and platform to check your lobby sweat level.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input
          style={{ padding: '0.8rem', borderRadius: '8px' }}
          type="text"
          placeholder="Gamertag"
          value={gamertag}
          onChange={(e) => setGamertag(e.target.value)}
        />
        <select
          style={{ padding: '0.8rem', borderRadius: '8px' }}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="origin">Origin</option>
          <option value="steam">Steam</option>
          <option value="psn">PlayStation</option>
          <option value="xbox">Xbox</option>
        </select>
        <button onClick={fetchStats} style={{ padding: '1rem', borderRadius: '8px', background: '#33cc99', color: '#111', fontWeight: 'bold' }}>Check My Lobby</button>
      </div>

      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '2rem', background: '#1a1a1a', padding: '2rem', borderRadius: '12px' }}>
          <h2>Results for: {gamertag}</h2>
          <p><strong>Platform:</strong> {platform}</p>
          <p><strong>Level:</strong> {result.data.segments[0].stats.level.displayValue}</p>
          <p><strong>KD Ratio:</strong> {result.data.segments[0].stats.kd.displayValue}</p>
          <p><strong>Damage/Game:</strong> {result.data.segments[0].stats.damagePerMatch?.displayValue || 'N/A'}</p>
          <p><strong>Sweat Score:</strong> {calculateSweatScore(result.data.segments[0].stats.kd.displayValue, result.data.segments[0].stats.damagePerMatch?.value || 0)} / 10 🔥</p>
        </div>
      )}
    </main>
  );
}
