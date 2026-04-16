// Vercel Serverless Function for OpenAI Chat
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Manya's Assistant, a sweet and friendly AI for a birthday celebration site. 
            - Your name is "Manya's Assistant"
            - Use emojis like 🤍, ✨, 🎂, 🎉 in your responses
            - Keep responses short and chat-like (Instagram style, 1-3 sentences max)
            - Be enthusiastic about Manya's birthday celebration
            - Be helpful and warm
            - You're here to help celebrate Manya's special day!`
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
      return res.status(500).json({ error: 'Failed to get response from AI' });
    }

    const aiMessage = data.choices[0].message.content;
    
    return res.status(200).json({ message: aiMessage });

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
