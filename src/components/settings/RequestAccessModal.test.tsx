import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestAccessModal } from './RequestAccessModal';
import type { AvailableProvider } from '@/types';

describe('RequestAccessModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSubmit = vi.fn();

  const provider: AvailableProvider = {
    id: 'aws-s3',
    name: 'AWS S3',
    type: 'aws-s3',
    description: 'Connect to Amazon S3 buckets',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Request Provider Access')).toBeInTheDocument();
    expect(screen.getByText(/Please provide a reason for requesting access to AWS S3/)).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    render(
      <RequestAccessModal
        open={false}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Request Provider Access')).not.toBeInTheDocument();
  });

  it('renders reason textarea', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Reason for Access')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('I need access to this provider for...')).toBeInTheDocument();
  });

  it('renders Cancel and Submit buttons', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit Request')).toBeInTheDocument();
  });

  it('disables Submit button when reason is empty', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByText('Submit Request');
    expect(submitButton).toBeDisabled();
  });

  it('enables Submit button when reason is provided', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('I need access to this provider for...');
    fireEvent.change(textarea, { target: { value: 'I need this for my project' } });

    const submitButton = screen.getByText('Submit Request');
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onSubmit with reason when Submit is clicked', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('I need access to this provider for...');
    fireEvent.change(textarea, { target: { value: 'I need this for my project' } });

    fireEvent.click(screen.getByText('Submit Request'));

    expect(mockOnSubmit).toHaveBeenCalledWith('I need this for my project');
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange with false when Cancel is clicked', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles null provider gracefully', () => {
    render(
      <RequestAccessModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/this provider/)).toBeInTheDocument();
  });
});

