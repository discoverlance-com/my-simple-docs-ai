import { GoogleGenAI } from '@google/genai'
import { createFileRoute } from '@tanstack/react-router'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export const Route = createFileRoute('/api/file-upload')({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const formData = await request.formData()

				const uploadedFile = formData.get('file') as File

				if (!GEMINI_API_KEY) {
					return new Response(
						JSON.stringify({
							message:
								'Please add your GEMINI_API_KEY to your environment variable',
						}),
						{ status: 400 },
					)
				}

				const ai = new GoogleGenAI({ vertexai: false, apiKey: GEMINI_API_KEY })

				const file = await ai.files.upload({
					file: uploadedFile,
					config: {
						displayName: uploadedFile.name,
					},
				})

				// Wait for the file to be processed.
				let getFile = await ai.files.get({ name: file.name as string })
				while (getFile.state === 'PROCESSING') {
					getFile = await ai.files.get({ name: file.name as string })
					console.log(`current file status: ${getFile.state}`)
					console.log('File is still processing, retrying in 5 seconds')

					await new Promise((resolve) => {
						setTimeout(resolve, 5000)
					})
				}
				if (file.state === 'FAILED') {
					throw new Error('File processing failed.')
				}

				return new Response(JSON.stringify({ file_name: file.name }))
			},
		},
	},
})
