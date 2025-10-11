import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  // Ensure we have a proper DOM environment
  if (typeof document === 'undefined') {
    return render(ui, { wrapper: AllTheProviders, ...options })
  }

  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
