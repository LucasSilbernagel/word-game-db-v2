import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Word Game DB',
}

export default function Contact() {
  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl tracking-tight">Contact</h1>
          <p className="text-muted-foreground text-xl">Get in touch with me</p>
        </div>

        <div className="mb-8">
          <p className="text-lg text-center">
            Are you having technical issues with Word Game DB? Do you have
            questions about implementation? Suggestions for new categories or
            words? Other ideas for improvement? Feel free to email me directly
            at{' '}
            <span className="font-semibold text-primary">
              hello@lucassilbernagel.com
            </span>{' '}
            or use the form below!
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <form
            action="https://formspree.io/f/xoqpywlq"
            method="POST"
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="sr-only">
                Your name
              </label>
              <input
                id="name"
                name="name"
                required
                type="text"
                placeholder="Your name"
                className="px-4 py-3 border border-input focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full text-base"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Your email
              </label>
              <input
                id="email"
                name="email"
                required
                type="email"
                placeholder="Your email"
                className="px-4 py-3 border border-input focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full text-base"
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Your message
              </label>
              <textarea
                name="message"
                id="message"
                required
                placeholder="Your message"
                rows={6}
                className="px-4 py-3 border border-input focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full text-base resize-vertical"
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-md w-full font-medium text-primary-foreground text-base transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
