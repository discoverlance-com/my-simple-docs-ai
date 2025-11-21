'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { askMyAIDocsServerFn } from '@/lib/query-ai'
import { useServerFn } from '@tanstack/react-start'
import { getRouteApi } from '@tanstack/react-router'

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
}

interface ChatInterfaceProps {
	fileName?: string
}

const routeApi = getRouteApi('/')

export function ChatInterface({ fileName }: ChatInterfaceProps) {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const {aiName} = routeApi.useLoaderData()

	const askAI = useServerFn(askMyAIDocsServerFn)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!input.trim() || !fileName) {
			toast.error('Please upload a file first and enter a question')
			return
		}

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input,
		}

		setMessages((prev) => [...prev, userMessage])
		setInput('')
		setIsLoading(true)

		try {
			const response = await askAI({
				data: { file_name: fileName, message: input, chat: messages },
			})

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: response ?? 'Sorry, failed to get an answer',
			}

			setMessages((prev) => [...prev, assistantMessage])
		} catch (error) {
			console.error('Error:', error)
			toast.error('Error getting response. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-border bg-card md:col-span-2">
			{/* Header */}
			<div className="border-b border-border bg-card p-4">
				<h2 className="text-lg font-semibold text-foreground">
					{fileName ? 'Ask Questions' : 'Upload a Document'}
				</h2>
				{fileName && (
					<p className="mt-1 text-sm text-muted-foreground">
						Analyzing: {fileName}
					</p>
				)}
			</div>

			{/* Messages */}
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.length === 0 && fileName && (
					<div className="flex h-full items-center justify-center">
						<p className="text-center text-muted-foreground">
							Ask me anything about the uploaded document!
						</p>
					</div>
				)}

				{messages.length === 0 && !fileName && (
					<div className="flex h-full items-center justify-center">
						<p className="text-center text-muted-foreground">
              Hello, I am {aiName}. Please upload a document to start asking questions
						</p>
					</div>
				)}

				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`max-w-xs rounded-lg px-4 py-2 ${
								message.role === 'user'
									? 'rounded-br-none bg-primary text-primary-foreground'
									: 'rounded-bl-none bg-muted text-muted-foreground'
							}`}
						>
							<p className="text-sm wrap-break-word">{message.content}</p>
						</div>
					</div>
				))}

				{isLoading && (
					<div className="flex justify-start">
						<div className="flex items-center gap-2 rounded-lg rounded-bl-none bg-muted px-4 py-2 text-muted-foreground">
							<Loader className="h-4 w-4 animate-spin" />
							<span className="text-sm">Thinking...</span>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="border-t border-border bg-card p-4">
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							fileName ? 'Ask a question...' : 'Upload a file first...'
						}
						disabled={!fileName || isLoading}
						className="flex-1"
					/>
					<Button type="submit" disabled={!fileName || isLoading} size="icon">
						{isLoading ? (
							<Loader className="h-4 w-4 animate-spin" />
						) : (
							<Send className="h-4 w-4" />
						)}
					</Button>
				</form>
			</div>
		</div>
	)
}
