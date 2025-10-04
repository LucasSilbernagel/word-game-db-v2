import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Contact</h1>
          <p className="text-muted-foreground text-xl">Get in touch with me</p>
        </header>

        <section className="mb-8" aria-labelledby="contact-intro">
          <h2 id="contact-intro" className="sr-only">
            Contact Information
          </h2>
          <p className="text-center text-lg">
            Are you having technical issues with Word Game DB? Do you have
            questions about implementation? Suggestions for new categories or
            words? Other ideas for improvement? Feel free to email me directly
            at{' '}
            <a
              href="mailto:hello@lucassilbernagel.com"
              className="text-primary font-semibold hover:underline focus-visible:underline"
            >
              hello@lucassilbernagel.com
            </a>{' '}
            or use the form below!
          </p>
        </section>

        <section className="mx-auto max-w-2xl" aria-labelledby="contact-form">
          <h2 id="contact-form" className="sr-only">
            Contact Form
          </h2>
          <form
            action="https://formspree.io/f/xoqpywlq"
            method="POST"
            className="space-y-6"
            aria-label="Contact form"
          >
            <fieldset className="space-y-6">
              <legend className="sr-only">Contact details</legend>
              <div>
                <Label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  type="text"
                  placeholder="Your name"
                  className="px-4 py-3 text-base"
                  aria-describedby="name-help"
                />
                <p id="name-help" className="sr-only">
                  Enter your full name
                </p>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your email
                </Label>
                <Input
                  id="email"
                  name="email"
                  required
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-3 text-base"
                  aria-describedby="email-help"
                />
                <p id="email-help" className="sr-only">
                  Enter your email address for response
                </p>
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your message
                </Label>
                <Textarea
                  name="message"
                  id="message"
                  required
                  placeholder="Your message"
                  rows={6}
                  className="resize-vertical px-4 py-3 text-base"
                  aria-describedby="message-help"
                />
                <p id="message-help" className="sr-only">
                  Enter your message or question
                </p>
              </div>
            </fieldset>

            <Button
              type="submit"
              className="w-full px-6 py-3 text-base font-medium"
              aria-describedby="submit-help"
            >
              Send Message
            </Button>
            <p id="submit-help" className="sr-only">
              Submit your contact form
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default ContactPage
