import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: "You are a friendly and knowledgeable barista assistant. Your expertise is in coffee, brewing methods, and coffee shop operations. Provide helpful and engaging responses about coffee-related topics.",
  });
  return result.toDataStreamResponse();
}

