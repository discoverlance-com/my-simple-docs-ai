import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 15

export const ACCEPTED_FILE_TYPES = ['application/pdf']
