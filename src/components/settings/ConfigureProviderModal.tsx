import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  ConnectedProvider,
  AvailableProvider,
  ProviderConfig,
} from '@/types';

interface ConfigureProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: ConnectedProvider | null;
  availableProvider?: AvailableProvider | null;
  config: ProviderConfig | null;
  onSubmit: (
    providerId: string,
    config: Record<string, string>,
  ) => Promise<void>;
}

export function ConfigureProviderModal({
  open,
  onOpenChange,
  provider,
  availableProvider,
  config,
  onSubmit,
}: ConfigureProviderModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [providerId, setProviderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNewConnection = !!availableProvider;
  const displayName = availableProvider?.name || provider?.name || '';

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({});
      if (isNewConnection) {
        setProviderId('');
      } else if (provider) {
        setProviderId(provider.id);
      }
    }
  }, [open, isNewConnection, provider]);

  const handleSubmit = async () => {
    if (!config) return;

    // Validate provider ID for new connections
    if (isNewConnection && !providerId.trim()) {
      alert('Please enter a Provider ID');
      return;
    }

    // Validate required fields
    const missingFields = config.fields
      .filter((field) => field.required && !formData[field.id])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(providerId, formData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setProviderId('');
    onOpenChange(false);
  };

  const updateField = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  if ((!provider && !availableProvider) || !config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-mac-semibold">
            {isNewConnection
              ? `Connect to ${displayName}`
              : `Configure ${displayName}`}
          </DialogTitle>
          <DialogDescription>
            Enter the connection details for {displayName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Provider ID field for new connections */}
          {isNewConnection && (
            <div className="space-y-2">
              <Label htmlFor="providerId" className="font-mac-medium">
                Provider ID
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="providerId"
                type="text"
                placeholder="Enter a unique identifier for this provider"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A unique name for this connection (e.g.,
                &quot;my-google-drive&quot;, &quot;production-s3&quot;)
              </p>
            </div>
          )}

          {/* Configuration fields */}
          {config.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="font-mac-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {field.type === 'select' ? (
                <Select
                  value={formData[field.id] || ''}
                  onValueChange={(value) => updateField(field.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? isNewConnection
                ? 'Connecting...'
                : 'Saving...'
              : isNewConnection
                ? 'Connect'
                : 'Save Configuration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
