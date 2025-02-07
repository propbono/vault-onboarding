import { Logo } from '@/components/icons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-light dark:bg-gradient-dark px-6 md:px-8 mx-auto">
      <div className="flex flex-col items-center max-w-2xl  text-center">
        <div className="mb-8">
          <Logo width={128} height={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Welcome to our App
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Start your journey with us and discover amazing features.
        </p>
        <Button asChild variant="default">
          <Link href="/onboarding">Get Started</Link>
        </Button>
      </div>
    </main>
  )
}
