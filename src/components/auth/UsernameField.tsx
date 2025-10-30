import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface UsernameFieldProps {
    value: string 
    onChange: (value: string) => void 
    disabled: boolean
}

export function UsernameField({ value, onChange, disabled }: UsernameFieldProps) {
    return (
        <Field>
            <FieldLabel htmlFor='username'>Username</FieldLabel>
            <Input 
                id="username"
                type="text"
                placeholder='john.doe'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                disabled={disabled}
            />
        </Field>
    )
}