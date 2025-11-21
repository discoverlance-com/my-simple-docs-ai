import { Link, useLocation } from '@tanstack/react-router'
import { FileXIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'

export const NotFound = () => {
	const location = useLocation()

	return (
		<div className="grid h-svh place-items-center">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileXIcon />
					</EmptyMedia>
					<EmptyTitle className="text-8xl font-bold">404</EmptyTitle>
					<EmptyDescription className="text-nowrap">
						The page you're looking for might have been <br />
						moved or doesn't exist.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<pre className="text-center text-sm break-all whitespace-pre-wrap">
						{location.pathname}
					</pre>
					<div className="flex gap-8">
						<Button
							onClick={() => {
								window.history.back()
							}}
						>
							Go Back
						</Button>
						<Button asChild variant="outline">
							<Link to="/" viewTransition>
								Go Home
							</Link>
						</Button>
					</div>
				</EmptyContent>
			</Empty>
		</div>
	)
}
