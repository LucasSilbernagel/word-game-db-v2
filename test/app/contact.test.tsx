import Contact from '@/app/contact/page'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Contact Page', () => {
  it('should render the ContactPage component', () => {
    render(<Contact />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Contact' })
    ).toBeVisible()
    expect(screen.getByText('Get in touch with me')).toBeVisible()
  })

  it('should render contact form', () => {
    render(<Contact />)

    const form = screen.getByRole('form', { name: 'Contact form' })
    expect(form).toHaveAttribute('action', 'https://formspree.io/f/xoqpywlq')
    expect(form).toHaveAttribute('method', 'POST')

    expect(screen.getByLabelText('Your name')).toBeVisible()
    expect(screen.getByLabelText('Your email')).toBeVisible()
    expect(screen.getByLabelText('Your message')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeVisible()
  })

  it('should render email link', () => {
    render(<Contact />)

    const emailLink = screen.getByRole('link', {
      name: 'hello@lucassilbernagel.com',
    })
    expect(emailLink).toHaveAttribute(
      'href',
      'mailto:hello@lucassilbernagel.com'
    )
  })

  it('should render contact introduction', () => {
    render(<Contact />)

    expect(
      screen.getByText(/Are you having technical issues with Word Game DB/)
    ).toBeVisible()
    expect(
      screen.getByText(/Do you have questions about implementation/)
    ).toBeVisible()
    expect(
      screen.getByText(/Suggestions for new categories or words/)
    ).toBeVisible()
  })
})
