export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { system, userMsg } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://sunpalizer.vercel.app',
        'X-Title': 'Sunpalizer'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMsg }
        ]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    return res.status(200).json({ result: data.choices?.[0]?.message?.content || '' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
