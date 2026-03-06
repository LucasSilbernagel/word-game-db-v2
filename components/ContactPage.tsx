'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { useState } from 'react'
import { z } from 'zod'

// Validation constants
const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 255
const MIN_MESSAGE_LENGTH = 10
const MAX_MESSAGE_LENGTH = 2000

// Validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters`)
    .max(
      MAX_NAME_LENGTH,
      `Name must be less than ${MAX_NAME_LENGTH} characters`
    )
    .refine((val) => val.trim().length >= MIN_NAME_LENGTH, {
      message: 'Name cannot be only spaces',
    }),
  emailAddress: z
    .string()
    .min(1, 'Email is required')
    .max(
      MAX_EMAIL_LENGTH,
      `Email must be less than ${MAX_EMAIL_LENGTH} characters`
    )
    .pipe(z.email('Please enter a valid email address')),
  message: z
    .string()
    .min(
      MIN_MESSAGE_LENGTH,
      `Message must be at least ${MIN_MESSAGE_LENGTH} characters`
    )
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must be less than ${MAX_MESSAGE_LENGTH} characters`
    )
    .refine((val) => val.trim().length >= MIN_MESSAGE_LENGTH, {
      message: 'Message cannot be only spaces',
    }),
})

type FormSubmission = z.infer<typeof contactFormSchema>

const DEFAULT_FORM_SUBMISSION: FormSubmission = {
  name: '',
  emailAddress: '',
  message: '',
}

const validateField = (
  fieldName: keyof typeof contactFormSchema.shape,
  value: string
) => {
  const result = contactFormSchema.shape[fieldName].safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || ''
  }
  return ''
}

const ContactPage = () => {
  const [formSubmission, setFormSubmission] = useState<FormSubmission>(
    DEFAULT_FORM_SUBMISSION
  )
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    emailAddress: false,
    message: false,
  })
  const [errors, setErrors] = useState({
    name: '',
    emailAddress: '',
    message: '',
    form: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateAllFields = () => {
    let isValid = true
    const newErrors = { name: '', emailAddress: '', message: '', form: '' }

    const nameError = validateField('name', formSubmission.name)
    if (nameError) {
      newErrors.name = nameError
      isValid = false
    }

    const emailError = validateField(
      'emailAddress',
      formSubmission.emailAddress
    )
    if (emailError) {
      newErrors.emailAddress = emailError
      isValid = false
    }

    const messageError = validateField('message', formSubmission.message)
    if (messageError) {
      newErrors.message = messageError
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (
    fieldName: keyof FormSubmission,
    value: string
  ) => {
    setFormSubmission((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Validate field if it has been touched
    if (touchedFields[fieldName as keyof typeof touchedFields]) {
      const error = validateField(fieldName, value)
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }))
    }
  }

  const handleFieldBlur = (fieldName: keyof typeof touchedFields) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }))

    const error = validateField(
      fieldName as keyof typeof contactFormSchema.shape,
      formSubmission[fieldName as keyof FormSubmission]
    )
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouchedFields({
      name: true,
      emailAddress: true,
      message: true,
    })

    // Clear previous errors
    setErrors({ name: '', emailAddress: '', message: '', form: '' })

    // Validate all fields
    if (!validateAllFields()) {
      return
    }

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(formSubmission)
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      setErrors((prev) => ({
        ...prev,
        form: firstError?.message || 'Validation failed',
      }))
      return
    }

    setIsLoading(true)

    try {
      const formspark_id = process.env.NEXT_PUBLIC_FORMSPARK_ID
      if (!formspark_id) {
        throw new Error('Formspark ID is not configured')
      }

      const response = await fetch(`https://submit-form.com/${formspark_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formSubmission),
      })

      if (response.ok) {
        setFormSubmission(DEFAULT_FORM_SUBMISSION)
        setTouchedFields({
          name: false,
          emailAddress: false,
          message: false,
        })
        setErrors({ name: '', emailAddress: '', message: '', form: '' })
        setIsSubmitted(true)

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        setErrors((prev) => ({
          ...prev,
          form: 'Something went wrong, please try again.',
        }))
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error)
      setErrors((prev) => ({
        ...prev,
        form: errorText,
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl tracking-tight">Contact</h1>
          <p className="text-muted-foreground text-xl">Get in touch with me</p>
        </header>

        <section className="mb-8" aria-labelledby="contact-intro">
          <h2 id="contact-intro" className="sr-only">
            Contact Information
          </h2>
          <p className="text-lg text-center">
            Are you having technical issues with Word Game DB? Do you have
            questions about implementation? Suggestions for new categories or
            words? Other ideas for improvement? Feel free to email me directly
            at{' '}
            <a
              href="mailto:hello@lucassilbernagel.com"
              className="font-semibold text-primary hover:underline focus-visible:underline"
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

          {isSubmitted && (
            <div
              className="bg-green-50 dark:bg-green-900 mb-6 p-4 rounded-md text-green-800 dark:text-green-200"
              role="alert"
            >
              <p className="font-medium">Message sent successfully!</p>
              <p className="text-sm">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {!isSubmitted && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-label="Contact form"
            >
              {errors.form && (
                <div
                  className="bg-red-50 dark:bg-red-900 p-4 rounded-md text-red-800 dark:text-red-200"
                  role="alert"
                >
                  <p className="font-medium">{errors.form}</p>
                </div>
              )}

              <fieldset className="space-y-6" disabled={isLoading}>
                <legend className="sr-only">Contact details</legend>
                <div>
                  <Label
                    htmlFor="name"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm"
                  >
                    Your name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className={`px-4 py-3 text-base ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : 'name-help'}
                    value={formSubmission.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleFieldBlur('name')}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-red-600 dark:text-red-400 text-sm"
                    >
                      {errors.name}
                    </p>
                  )}
                  {!errors.name && (
                    <p id="name-help" className="sr-only">
                      Enter your full name
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm"
                  >
                    Your email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className={`px-4 py-3 text-base ${
                      errors.emailAddress ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.emailAddress}
                    aria-describedby={
                      errors.emailAddress ? 'email-error' : 'email-help'
                    }
                    value={formSubmission.emailAddress}
                    onChange={(e) =>
                      handleFieldChange('emailAddress', e.target.value)
                    }
                    onBlur={() => handleFieldBlur('emailAddress')}
                  />
                  {errors.emailAddress && (
                    <p
                      id="email-error"
                      className="mt-1 text-red-600 dark:text-red-400 text-sm"
                    >
                      {errors.emailAddress}
                    </p>
                  )}
                  {!errors.emailAddress && (
                    <p id="email-help" className="sr-only">
                      Enter your email address for response
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm"
                  >
                    Your message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    rows={6}
                    className={`resize-vertical px-4 py-3 text-base ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? 'message-error' : 'message-help'
                    }
                    value={formSubmission.message}
                    onChange={(e) =>
                      handleFieldChange('message', e.target.value)
                    }
                    onBlur={() => handleFieldBlur('message')}
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-1 text-red-600 dark:text-red-400 text-sm"
                    >
                      {errors.message}
                    </p>
                  )}
                  {!errors.message && (
                    <p id="message-help" className="sr-only">
                      Enter your message or question
                    </p>
                  )}
                </div>
              </fieldset>

              <Button
                type="submit"
                className="px-6 py-3 w-full font-medium text-base"
                disabled={isLoading}
                aria-describedby="submit-help"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
              <p id="submit-help" className="sr-only">
                Submit your contact form
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default ContactPage
