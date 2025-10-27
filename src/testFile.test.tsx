import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders heading and logos', () => {
    const { getByText, getAllByRole, getByAltText } = render(<App />)

    expect(getByText('Vite + React')).toBeTruthy()
    expect(getByAltText('Vite logo')).toBeTruthy()
    expect(getByAltText('React logo')).toBeTruthy()

    const links = getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
    expect(links[0].getAttribute('href')).toContain('vite.dev')
    expect(links[1].getAttribute('href')).toContain('react.dev')
  })

  it('increments count when button is clicked', () => {
    const { getByRole } = render(<App />)
    const button = getByRole('button')
    expect(button.textContent).toContain('count is 0')

    fireEvent.click(button)
    expect(button.textContent).toContain('count is 1')
  })
})