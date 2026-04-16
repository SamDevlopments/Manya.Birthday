// Vercel Serverless Function for OpenAI Chat - Zero Dependency
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check if API key is present
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'API key is missing from environment variables. Please add OPENAI_API_KEY to Vercel environment variables.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Manya\'s sweet and helpful birthday assistant. Use emojis like 🤍✨🎂🎉 and be celebratory! Keep responses short and chat-like (Instagram style, 1-3 sentences max).'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      const errorMessage = data.error?.message || 'Unknown error';
      return res.status(response.status).json({ 
        error: `OpenAI API error: ${errorMessage}`,
        details: data 
      });
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'Invalid response format from OpenAI' });
    }

    const aiMessage = data.choices[0].message.content;
    
    return res.status(200).json({ message: aiMessage });

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
