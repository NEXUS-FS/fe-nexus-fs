import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

// src/App.test.tsx

describe('App', () => {
  it('renders header and logos', () => {
    render(<App />)

    // Heading exists
    const heading = screen.getByText('Vite + React')
    expect(heading).toBeTruthy()

    // Logos by alt text exist
    const viteImg = screen.getByAltText('Vite logo')
    const reactImg = screen.getByAltText('React logo')
    expect(viteImg).toBeTruthy()
    expect(reactImg).toBeTruthy()

    // Links have expected href attributes (use getAttribute to avoid absolute URL normalization)
    const links = screen.getAllByRole('link')
    expect((links[0] as HTMLAnchorElement).getAttribute('href')).toBe('https://vite.dev')
    expect((links[1] as HTMLAnchorElement).getAttribute('href')).toBe('https://react.dev')
  })

  it('increments count when button clicked', () => {
    render(<App />)

    const button = screen.getByRole('button')
    expect(button).toBeTruthy()
    // initial count
    expect(button.textContent).toBe('count is 0')

    // click and assert increment
    fireEvent.click(button)
    expect(button.textContent).toContain('count is 1')
  })
})