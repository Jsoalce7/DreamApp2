'use server';

/**
 * @fileOverview This file defines a Genkit flow for moderating community chat messages.
 *
 * The flow analyzes messages and flags them as inappropriate if they violate community guidelines.
 * It exports the `moderateCommunityChatMessage` function, which takes a message as input and returns a moderation result.
 * It also exports the `ModerateCommunityChatMessageInput` and `ModerateCommunityChatMessageOutput` types.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateCommunityChatMessageInputSchema = z.object({
  message: z.string().describe('The chat message to be moderated.'),
});
export type ModerateCommunityChatMessageInput = z.infer<typeof ModerateCommunityChatMessageInputSchema>;

const ModerateCommunityChatMessageOutputSchema = z.object({
  isFlagged: z.boolean().describe('Whether the message is flagged as inappropriate.'),
  reason: z.string().describe('The reason the message was flagged as inappropriate, if applicable.'),
});
export type ModerateCommunityChatMessageOutput = z.infer<typeof ModerateCommunityChatMessageOutputSchema>;

export async function moderateCommunityChatMessage(
  input: ModerateCommunityChatMessageInput
): Promise<ModerateCommunityChatMessageOutput> {
  return moderateCommunityChatMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communityChatMessageModerationPrompt',
  input: {schema: ModerateCommunityChatMessageInputSchema},
  output: {schema: ModerateCommunityChatMessageOutputSchema},
  prompt: `You are a community moderator bot responsible for identifying inappropriate messages in a community chat.

  Your primary goal is to ensure a safe and positive environment for all users.
  Analyze the following message and determine if it violates community guidelines related to hate speech, harassment, sexually explicit content, dangerous content, or civic integrity.

  Message: "{{message}}"

  Indicate whether the message is flagged as inappropriate (isFlagged: true) or not (isFlagged: false).
  If flagged, provide a brief reason for the flagging (reason: string).  If not flagged, the reason should be an empty string.
  Keep the reason concise.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const moderateCommunityChatMessageFlow = ai.defineFlow(
  {
    name: 'moderateCommunityChatMessageFlow',
    inputSchema: ModerateCommunityChatMessageInputSchema,
    outputSchema: ModerateCommunityChatMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
