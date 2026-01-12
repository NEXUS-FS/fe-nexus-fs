import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('./pages/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

describe('App', () => {
  it('renders Suspense fallback initially', () => {
    render(<App />);
    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeTruthy();
  });

  it('renders the Login page when loaded', async () => {
    render(<App />);
    const loadingPage = await screen.findByTestId('login-page');
    expect(loadingPage).toBeTruthy();
    expect(loadingPage.textContent).toContain('Login Page');
  });
});
