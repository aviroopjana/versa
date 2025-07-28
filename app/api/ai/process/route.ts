import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { decrypt } from '@/app/lib/encryption';
import { getPromptTemplate, validateTransformationType } from '@/app/lib/promptTemplates';
import { 
  withErrorHandling, 
  AuthenticationError, 
  ValidationError, 
  ExternalServiceError,
  checkRateLimit,
  validateRequired 
} from '@/app/lib/errorHandling';

// AI Provider interfaces
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AnthropicResponse {
  content: Array<{
    text: string;
  }>;
}


async function callOpenAI(apiKey: string, prompt: any, settings: any): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: settings.selectedModel || 'gpt-4o',
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ],
        temperature: settings.temperature || 0.7,
        max_tokens: settings.maxTokens || 2000,
        top_p: settings.topP || 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 429) {
        throw new ExternalServiceError('OpenAI rate limit exceeded', 'openai');
      }
      
      if (response.status === 401) {
        throw new ExternalServiceError('Invalid OpenAI API key', 'openai');
      }
      
      throw new ExternalServiceError(`OpenAI API error: ${error.error?.message || 'Unknown error'}`, 'openai');
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    if (error instanceof ExternalServiceError) {
      throw error;
    }
    throw new ExternalServiceError(`Failed to connect to OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`, 'openai');
  }
}

async function callAnthropic(apiKey: string, prompt: any, settings: any): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: settings.selectedModel || 'claude-3.5-sonnet',
      max_tokens: settings.maxTokens || 2000,
      temperature: settings.temperature || 0.7,
      top_p: settings.topP || 1.0,
      messages: [
        {
          role: 'user',
          content: `${prompt.system}\n\n${prompt.user}`
        }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data: AnthropicResponse = await response.json();
  return data.content[0]?.text || 'No response generated';
}

async function callGoogleAI(apiKey: string, prompt: any, settings: any): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.selectedModel || 'gemini-1.5-pro'}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${prompt.system}\n\n${prompt.user}`
        }]
      }],
      generationConfig: {
        temperature: settings.temperature || 0.7,
        maxOutputTokens: settings.maxTokens || 2000,
        topP: settings.topP || 1.0,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Google AI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
}

async function processWithAI(provider: string, apiKey: string, prompt: any, settings: any): Promise<string> {
  switch (provider) {
    case 'openai':
      return await callOpenAI(apiKey, prompt, settings);
    case 'anthropic':
      return await callAnthropic(apiKey, prompt, settings);
    case 'google':
      return await callGoogleAI(apiKey, prompt, settings);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  // Rate limiting: 10 requests per minute per user
  checkRateLimit(`ai-process-${session.user.id}`, 10, 60 * 1000);

  const body = await request.json();
  const { text, transformationType } = body;

  // Validate inputs
  validateRequired(text, 'text');
  validateRequired(transformationType, 'transformationType');

  if (text.length > 50000) {
    throw new ValidationError('Text is too long. Maximum 50,000 characters allowed.');
  }

  if (!validateTransformationType(transformationType)) {
    throw new ValidationError('Invalid transformation type');
  }

  // Get user settings
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!userSettings?.selectedModel) {
    throw new ValidationError('No AI model selected. Please configure your settings first.');
  }

  // Find the provider for the selected model
  const modelProviderMap: Record<string, string> = {
    'gpt-4o': 'openai',
    'gpt-4-turbo': 'openai',
    'claude-3.5-sonnet': 'anthropic',
    'claude-3-haiku': 'anthropic',
    'gemini-1.5-pro': 'google',
    'mistral-large': 'mistral',
    'command-r-plus': 'cohere',
  };

  const provider = modelProviderMap[userSettings.selectedModel];
  if (!provider) {
    throw new ValidationError('Unable to determine provider for selected model');
  }

  // Get the API key for the provider
  const apiKeyRecord = await prisma.apiKey.findFirst({
    where: {
      userId: session.user.id,
      provider: provider,
      isActive: true,
    },
  });

  if (!apiKeyRecord) {
    throw new ValidationError(`No active API key found for ${provider}. Please add one in settings.`);
  }

  // Decrypt the API key
  const decryptedApiKey = decrypt(apiKeyRecord.key);

  // Get the prompt template
  const template = getPromptTemplate(transformationType);
  if (!template) {
    throw new ValidationError('Prompt template not found');
  }

  const prompt = {
    system: template.system,
    user: template.user(text)
  };

  // Process with AI
  const result = await processWithAI(provider, decryptedApiKey, prompt, userSettings);

  return NextResponse.json({
    success: true,
    data: {
      transformationType,
      result,
      model: userSettings.selectedModel,
      provider,
      timestamp: new Date().toISOString(),
    }
  });
});

export const runtime = 'nodejs';
