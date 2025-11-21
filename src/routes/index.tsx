import { Card, CardContent } from '@/components/ui/card'
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChatInterface } from './-chat-interface'
import { toast } from 'sonner'
import { MAX_UPLOAD_SIZE } from '@/lib/utils'
import { GoogleGenAI } from '@google/genai'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { LoaderIcon, TrashIcon } from 'lucide-react'

const deleteAllFilesServerFn = createServerFn({ method: 'POST' }).handler(
	async () => {
		if (!process.env.GEMINI_API_KEY) {
			throw new Error(
				'Please add your GEMINI_API_KEY to your environment variable',
			)
		}

		const ai = new GoogleGenAI({
			vertexai: false,
			apiKey: process.env.GEMINI_API_KEY,
		})

		const files = await ai.files.list()

		for (const file of files.page) {
			await ai.files.delete({ name: file.name ?? '' })
		}
	},
)

export const Route = createFileRoute('/')({
	async loader() {
		return {
			aiName: process.env.AI_NAME ?? 'Not Known',
		}
	},
	component: App,
})

function App() {
	const [files, setFiles] = useState<File[] | undefined>()
	const [fileName, setFileName] = useState<string | undefined>(undefined)
	const [isDeleting, setDeleting] = useState(false)
	const deleteFiles = useServerFn(deleteAllFilesServerFn)
	const navigate = Route.useNavigate()

	const handleDrop = async (files: File[]) => {
		setFiles(files)

		// upload the file
		if (files[0]) {
			toast.promise(
				async () => {
					const formData = new FormData()
					formData.append('file', files[0])
					const response = await fetch('/api/file-upload', {
						method: 'POST',
						body: formData,
					})

					if (response.ok) {
						const result = await response.json()
						setFileName(result.file_name)
						return
					}

					if (response.status === 400) {
						const errorData = await response.json()
						toast.error(errorData.message)
						return
					}

					throw new Error('Request to save file failed')
				},
				{
					loading: 'Saving file, please wait...',
					position: 'top-right',
					success: 'File has been saved, you can proceed to ask questions',
					error: (error) => {
						console.error('AI File Upload Failed', error)
						return <span>Failed to Upload File</span>
					},
				},
			)
		}
	}
	return (
		<main className="min-h-screen w-full">
			<div className="container mx-auto w-full px-4">
				<h1 className="mb-2 text-center text-4xl font-bold">
					My Simple AI Docs
				</h1>
				<p className="mb-4 text-center text-muted-foreground">
					Upload a PDF document and ask AI questions about it.
				</p>
				<div className="grid gap-8 md:grid-cols-3">
					<Card className="h-74">
						<CardContent>
							<Dropzone
								accept={{ 'application/pdf': ['.pdf'] }}
								maxFiles={1}
								maxSize={MAX_UPLOAD_SIZE}
								minSize={1024}
								onDrop={handleDrop}
								onError={console.error}
								src={files}
							>
								<DropzoneEmptyState />
								<DropzoneContent />
							</Dropzone>

							<Button
								className="mt-8"
								variant="destructive"
								onClick={async () => {
									setDeleting(true)
									try {
										await deleteFiles()
									} catch (error) {
										toast.error((error as Error).message)
										setDeleting(false)
										return
									}
									toast.success('Deleted all Files')
									setDeleting(false)
									setTimeout(() => {
										navigate({
											to: '/',
											reloadDocument: true,
											resetScroll: true,
										})
									}, 800)
								}}
								disabled={isDeleting}
							>
								<TrashIcon />
								Purge Already Stored Files{' '}
								{isDeleting && <LoaderIcon className="animate-spin" />}
							</Button>
						</CardContent>
					</Card>

					<ChatInterface fileName={fileName} />
				</div>
			</div>
		</main>
	)
}
