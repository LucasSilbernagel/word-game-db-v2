import ContactPage from '@/components/ContactPage/ContactPage'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../utils/test-utils'

describe('ContactPage', () => {
  it('should render the main heading and description', () => {
    render(<ContactPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Contact' })
    ).toBeVisible()
    expect(screen.getByText('Get in touch with me')).toBeVisible()
  })

  it('should render the contact introduction section', () => {
    render(<ContactPage />)

    expect(
      screen.getByText(/Are you having technical issues with Word Game DB/)
    ).toBeVisible()
    expect(
      screen.getByText(/Do you have questions about implementation/)
    ).toBeVisible()
    expect(
      screen.getByText(/Suggestions for new categories or words/)
    ).toBeVisible()
    expect(screen.getByText(/Other ideas for improvement/)).toBeVisible()
  })

  it('should render the email link with correct attributes', () => {
    render(<ContactPage />)

    const emailLink = screen.getByRole('link', {
      name: 'hello@lucassilbernagel.com',
    })
    expect(emailLink).toHaveAttribute(
      'href',
      'mailto:hello@lucassilbernagel.com'
    )
    expect(emailLink).toHaveClass(
      'text-primary',
      'font-semibold',
      'hover:underline',
      'focus-visible:underline'
    )
  })

  it('should render the contact form with all required fields', () => {
    render(<ContactPage />)

    const form = screen.getByRole('form', { name: 'Contact form' })
    expect(form).toHaveAttribute('action', 'https://formspree.io/f/xoqpywlq')
    expect(form).toHaveAttribute('method', 'POST')

    const nameInput = screen.getByRole('textbox', { name: 'Your name' })
    expect(nameInput).toHaveAttribute('id', 'name')
    expect(nameInput).toHaveAttribute('name', 'name')
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('required')
    expect(nameInput).toHaveAttribute('placeholder', 'Your name')
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-help')

    const emailInput = screen.getByRole('textbox', { name: 'Your email' })
    expect(emailInput).toHaveAttribute('id', 'email')
    expect(emailInput).toHaveAttribute('name', 'email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('placeholder', 'Your email')
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-help')

    const messageTextarea = screen.getByRole('textbox', {
      name: 'Your message',
    })
    expect(messageTextarea).toHaveAttribute('id', 'message')
    expect(messageTextarea).toHaveAttribute('name', 'message')
    expect(messageTextarea).toHaveAttribute('required')
    expect(messageTextarea).toHaveAttribute('placeholder', 'Your message')
    expect(messageTextarea).toHaveAttribute('rows', '6')
    expect(messageTextarea).toHaveAttribute('aria-describedby', 'message-help')
  })

  it('should render the submit button', () => {
    render(<ContactPage />)

    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    expect(submitButton).toHaveAttribute('type', 'submit')
    expect(submitButton).toHaveClass(
      'w-full',
      'px-6',
      'py-3',
      'text-base',
      'font-medium'
    )
    expect(submitButton).toHaveAttribute('aria-describedby', 'submit-help')
  })

  it('should have proper accessibility attributes', () => {
    render(<ContactPage />)

    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings).toHaveLength(2) // Two h2 headings (both sr-only)

    // Check for screen reader only content
    expect(screen.getByText('Contact Information')).toBeInTheDocument()
    expect(screen.getByText('Contact Form')).toBeInTheDocument()
    expect(screen.getByText('Contact details')).toBeInTheDocument()

    // Check for form fieldset and legend
    const fieldset = screen.getByRole('group', { name: 'Contact details' })
    expect(fieldset).toBeVisible()

    // Check for help text
    expect(screen.getByText('Enter your full name')).toBeInTheDocument()
    expect(
      screen.getByText('Enter your email address for response')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Enter your message or question')
    ).toBeInTheDocument()
    expect(screen.getByText('Submit your contact form')).toBeInTheDocument()
  })

  it('should have proper form structure', () => {
    render(<ContactPage />)

    // Check that all form elements are properly associated
    const nameInput = screen.getByRole('textbox', { name: 'Your name' })
    const nameLabel = screen.getByText('Your name')
    expect(nameLabel).toHaveAttribute('for', 'name')
    expect(nameInput).toHaveAttribute('id', 'name')

    const emailInput = screen.getByRole('textbox', { name: 'Your email' })
    const emailLabel = screen.getByText('Your email')
    expect(emailLabel).toHaveAttribute('for', 'email')
    expect(emailInput).toHaveAttribute('id', 'email')

    const messageTextarea = screen.getByRole('textbox', {
      name: 'Your message',
    })
    const messageLabel = screen.getByText('Your message')
    expect(messageLabel).toHaveAttribute('for', 'message')
    expect(messageTextarea).toHaveAttribute('id', 'message')
  })

  it('should have proper styling classes', () => {
    render(<ContactPage />)

    // Check container styling - the component doesn't have a main role
    const container = screen.getByText('Contact').closest('.container')
    expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')

    // Check form styling
    const form = screen.getByRole('form')
    expect(form).toHaveClass('space-y-6')

    // Check fieldset styling
    const fieldset = screen.getByRole('group')
    expect(fieldset).toHaveClass('space-y-6')
  })
})
