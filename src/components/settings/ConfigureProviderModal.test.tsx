import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfigureProviderModal } from './ConfigureProviderModal';
import type { ConnectedProvider, ProviderConfig } from '@/types';

describe('ConfigureProviderModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  const provider: ConnectedProvider = {
    id: 'aws-1',
    name: 'AWS S3 Production',
    type: 'aws-s3',
    status: 'inactive',
    healthStatus: 'Inactive',
    storageUsed: 0,
    storageTotal: 100,
    filesCount: 0,
    connectedAt: '2024-03-01T10:00:00Z',
    isConfigured: false,
  };

  const config: ProviderConfig = {
    providerType: 'aws-s3',
    fields: [
      {
        id: 'accessKeyId',
        label: 'Access Key ID',
        type: 'text',
        placeholder: 'Enter your AWS Access Key ID',
        required: true,
      },
      {
        id: 'secretAccessKey',
        label: 'Secret Access Key',
        type: 'password',
        placeholder: 'Enter your AWS Secret Access Key',
        required: true,
      },
      {
        id: 'bucketName',
        label: 'Bucket Name',
        type: 'text',
        placeholder: 'my-bucket-name',
        required: true,
      },
      {
        id: 'region',
        label: 'Region',
        type: 'select',
        required: true,
        options: [
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'eu-west-1', label: 'EU (Ireland)' },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText('Configure AWS S3 Production')).toBeInTheDocument();
    expect(
      screen.getByText('Enter the connection details for AWS S3 Production'),
    ).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    render(
      <ConfigureProviderModal
        open={false}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(
      screen.queryByText('Configure AWS S3 Production'),
    ).not.toBeInTheDocument();
  });

  it('renders all configuration fields', () => {
    render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText('Access Key ID')).toBeInTheDocument();
    expect(screen.getByText('Secret Access Key')).toBeInTheDocument();
    expect(screen.getByText('Bucket Name')).toBeInTheDocument();
    expect(screen.getByText('Region')).toBeInTheDocument();
  });

  it('shows required indicator for required fields', () => {
    render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    // All fields in this config are required, so we should see asterisks
    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBe(4);
  });

  it('renders Cancel and Save buttons', () => {
    render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Configuration')).toBeInTheDocument();
  });

  it('calls onOpenChange with false when Cancel is clicked', () => {
    render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('updates field values when user types', () => {
    render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    const accessKeyInput = screen.getByPlaceholderText(
      'Enter your AWS Access Key ID',
    );
    fireEvent.change(accessKeyInput, {
      target: { value: 'AKIAIOSFODNN7EXAMPLE' },
    });

    expect(accessKeyInput).toHaveValue('AKIAIOSFODNN7EXAMPLE');
  });

  it('calls onSubmit with form data when Save is clicked', async () => {
    render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    // Fill in all required fields
    fireEvent.change(
      screen.getByPlaceholderText('Enter your AWS Access Key ID'),
      {
        target: { value: 'AKIAIOSFODNN7EXAMPLE' },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText('Enter your AWS Secret Access Key'),
      {
        target: { value: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' },
      },
    );
    fireEvent.change(screen.getByPlaceholderText('my-bucket-name'), {
      target: { value: 'my-test-bucket' },
    });

    // Select region
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('US East (N. Virginia)'));

    // Submit
    fireEvent.click(screen.getByText('Save Configuration'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('aws-1', {
        accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        bucketName: 'my-test-bucket',
        region: 'us-east-1',
      });
    });
  });

  it('returns null when provider is null', () => {
    const { container } = render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={null}
        config={config}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when config is null', () => {
    const { container } = render(
      <ConfigureProviderModal
        open={true}
        onOpenChange={mockOnOpenChange}
        provider={provider}
        config={null}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
