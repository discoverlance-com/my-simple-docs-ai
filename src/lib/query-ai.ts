import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod/v4'
import { ContentListUnion, GoogleGenAI, createPartFromUri } from '@google/genai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const AI_NAME = process.env.AI_NAME

const systemPrompt = `You are an AI assistant (${AI_NAME}) that answers questions using the uploaded document as your reference.

Rules:

Use the document as your basis, but treat every example, syntax snippet, rule, or pattern in the document as a reusable template.

You must adapt these templates to the user’s scenario, substituting their names, values, entities, or objects — even if the document uses different terminology.

You may generalize from examples whenever a pattern exists.

Use the fallback phrase
"The document does not contain this information."
only when the document contains no reusable patterns of any kind that could be applied.

Do not apologize or rely on outside knowledge.

Keep answers concise and closely aligned with the document’s structure.
`

export const askMyAIDocsServerFn = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			message: z.string().min(1, 'Message is required'),
			chat: z
				.array(
					z.object({
						id: z.string().min(1, 'Chat message ID is required'),
						content: z.string().min(1, 'Chat content is required'),
						role: z.enum(
							['user', 'assistant'],
							'Chat role must be user or assistant',
						),
					}),
				)
				.optional(),
			file_name: z.string().min(1, 'File name is required'),
		}),
	)
	.handler(async ({ data }) => {
		if (!GEMINI_API_KEY || !AI_NAME) {
			throw new Error(
				'Please add your GEMINI_API_KEY and AI_NAME to your environment variable',
			)
		}

		const ai = new GoogleGenAI({ vertexai: false, apiKey: GEMINI_API_KEY })

		const file = await ai.files.get({ name: data.file_name })

		if (!file.uri || !file.mimeType) {
			throw new Error('File cannot be found')
		}

		const previousChats: ContentListUnion = data.chat
			? data.chat.map((chat) => ({ role: chat.role, text: chat.content }))
			: []

		// add file
		const fileContent = createPartFromUri(file.uri, file.mimeType)
		previousChats.push(fileContent)

		// add current message
		previousChats.push({ role: 'user', text: data.message })
		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash-lite',
			contents: previousChats,
			config: {
				systemInstruction: systemPrompt,
				maxOutputTokens: 2048,
				temperature: 0.5,
			},
		})

		return response.text
	})
