import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }

    // Determine if this is an OpenRouter key or direct OpenAI key
    const isOpenRouter = apiKey.startsWith('sk-or-');
    const providerName = isOpenRouter ? 'OpenRouter' : 'OpenAI';
    const endpoint = isOpenRouter 
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    // Test the API key with a simple request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(isOpenRouter && {
          'HTTP-Referer': 'https://versa.ai',
          'X-Title': 'Versa AI Platform'
        })
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Say "API key is working!" if you can read this.' }
        ],
        max_tokens: 10
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      
      return NextResponse.json({ 
        valid: false, 
        error: error.error?.message || 'Unknown error',
        status: response.status,
        provider: providerName
      });
    }

    const data = await response.json();

    return NextResponse.json({ 
      valid: true, 
      message: `${providerName} API key is valid`,
      response: data.choices[0]?.message?.content,
      provider: providerName
    });
  } catch (error) {
    return NextResponse.json({ 
      valid: false, 
      error: 'Failed to test API key' 
    }, { status: 500 });
  }
}
