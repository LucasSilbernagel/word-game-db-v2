export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Contact</h1>
          <p className="text-muted-foreground text-xl">Get in touch with me</p>
        </div>

        <div className="mb-8">
          <p className="text-center text-lg">
            Are you having technical issues with Word Game DB? Do you have
            questions about implementation? Suggestions for new categories or
            words? Other ideas for improvement? Feel free to email me directly
            at{' '}
            <span className="text-primary font-semibold">
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
                className="border-input focus:ring-ring w-full rounded-md border px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:outline-none"
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
                className="border-input focus:ring-ring w-full rounded-md border px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:outline-none"
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
                className="border-input focus:ring-ring resize-vertical w-full rounded-md border px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-md px-6 py-3 text-base font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
