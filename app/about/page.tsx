import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">About</h1>
          <p className="text-muted-foreground text-xl">
            Learn more about the Word Game DB project
          </p>
        </div>

        <div className="mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="dark:prose-invert prose prose-gray max-w-none">
                <p className="text-lg">
                  <span className="text-primary font-semibold">
                    Word Game DB
                  </span>{' '}
                  is a read-only REST API built with the MERN stack (MongoDB,
                  Express, React, and Node.js). It is intended to be used for
                  educational purposes by anyone who would like to practice
                  their coding skills by building a word game that incorporates
                  an API.
                </p>
                <p>
                  I was inspired to create{' '}
                  <span className="text-primary font-semibold">
                    Word Game DB
                  </span>{' '}
                  while building a{' '}
                  <a
                    href="https://github.com/LucasSilbernagel/hangman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    hangman game
                  </a>{' '}
                  with Vanilla JavaScript in the summer of 2020. I wanted to
                  incorporate an API, but couldn&apos;t find one that satisfied
                  my requirements.{' '}
                  <span className="text-primary font-semibold">
                    Word Game DB
                  </span>{' '}
                  meets those needs by returning a list of nouns, each of them
                  associated with a category. For more information, please check
                  out the{' '}
                  <Link href="/" className="text-primary hover:underline">
                    endpoints
                  </Link>
                  .
                </p>
                <p>
                  If you notice any technical issues with the API, or if you
                  have any questions, comments, or suggestions, please{' '}
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    contact me
                  </Link>
                  .
                </p>
                <p>
                  If you would like to build your own REST API, you are welcome
                  to{' '}
                  <a
                    href="https://github.com/LucasSilbernagel/word-game-db-v2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    clone my repository
                  </a>{' '}
                  to use as a starting point.
                </p>
                <p>
                  <strong>Rebuilt for 2025:</strong> This version has been
                  completely rebuilt using modern web technologies including
                  Next.js 15, TypeScript, and Tailwind CSS. The entire
                  development process was accelerated using{' '}
                  <a
                    href="https://cursor.sh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Cursor
                  </a>{' '}
                  AI-powered code editor, demonstrating how modern development
                  tools can streamline the creation of full-stack applications.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tech Stack (2025 Rebuild)</CardTitle>
              <CardDescription>
                Modern full-stack technologies with AI-powered development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted rounded p-3">
                  <h4 className="text-sm font-semibold">Frontend</h4>
                  <p className="text-muted-foreground text-xs">
                    Next.js 15, React 19, TypeScript, Tailwind CSS
                  </p>
                </div>
                <div className="bg-muted rounded p-3">
                  <h4 className="text-sm font-semibold">Backend</h4>
                  <p className="text-muted-foreground text-xs">
                    Next.js API Routes, MongoDB, Mongoose
                  </p>
                </div>
                <div className="bg-muted rounded p-3">
                  <h4 className="text-sm font-semibold">UI Components</h4>
                  <p className="text-muted-foreground text-xs">
                    Radix UI, ShadCN, Lucide Icons
                  </p>
                </div>
                <div className="bg-muted rounded p-3">
                  <h4 className="text-sm font-semibold">Development</h4>
                  <p className="text-muted-foreground text-xs">
                    Cursor AI, ESLint, Prettier, Zustand
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>What makes our API special</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Comprehensive word database</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced search and filtering</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">RESTful API design</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">CORS support for web apps</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">TypeScript support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Production-ready security</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>
                Perfect for various educational projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div>
                  <h4 className="text-sm font-semibold">Word Games</h4>
                  <p className="text-muted-foreground text-xs">
                    Hangman, Wordle, crossword puzzles, and more
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Educational Apps</h4>
                  <p className="text-muted-foreground text-xs">
                    Vocabulary builders, spelling games, language learning
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Creative Projects</h4>
                  <p className="text-muted-foreground text-xs">
                    Poetry generators, word art, creative writing tools
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Learning APIs</h4>
                  <p className="text-muted-foreground text-xs">
                    Practice building applications that consume REST APIs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modern Development</CardTitle>
              <CardDescription>
                Built with cutting-edge tools and practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold">
                    Next.js 15 & TypeScript
                  </h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Full-stack React framework with App Router and type safety
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">
                    AI-Powered Development
                  </h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Built with Cursor AI editor for rapid, intelligent
                    development
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Modern UI Stack</h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Tailwind CSS, Radix UI, and ShadCN components
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Production Ready</h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    ESLint, Prettier, and environment-based endpoint protection
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Implementation</CardTitle>
              <CardDescription>See the API in action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold">Hangman Game</h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    The original inspiration for this API
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="https://lucassilbernagel.github.io/hangman/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs hover:underline"
                    >
                      Live Demo
                    </a>
                    <a
                      href="https://github.com/LucasSilbernagel/hangman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs hover:underline"
                    >
                      Source Code
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Build Your Own</h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Clone the repository and start building
                  </p>
                  <a
                    href="https://github.com/LucasSilbernagel/word-game-db-v2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs hover:underline"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-xl font-semibold">
                Ready to get started?
              </h3>
              <p className="text-muted-foreground mb-6">
                Explore our API endpoints and start building your next word game
                or educational application.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/">View API Endpoints</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
