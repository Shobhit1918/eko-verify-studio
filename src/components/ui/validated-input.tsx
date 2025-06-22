
import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ValidatedInputProps extends React.ComponentProps<typeof Input> {
  validationType?: 'aadhaar' | 'mobile' | 'ifsc' | 'default'
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ className, validationType = 'default', onChange, ...props }, ref) => {
    const getMaxLength = () => {
      switch (validationType) {
        case 'aadhaar':
          return 12
        case 'mobile':
          return 10
        case 'ifsc':
          return 11
        default:
          return undefined
      }
    }

    const getPattern = () => {
      switch (validationType) {
        case 'aadhaar':
          return "[0-9]{12}"
        case 'mobile':
          return "[0-9]{10}"
        case 'ifsc':
          return "[A-Z]{4}0[A-Z0-9]{6}"
        default:
          return undefined
      }
    }

    const getPlaceholder = () => {
      switch (validationType) {
        case 'aadhaar':
          return "Enter 12-digit Aadhaar number"
        case 'mobile':
          return "Enter 10-digit mobile number"
        case 'ifsc':
          return "Enter 11-character IFSC code"
        default:
          return props.placeholder
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const maxLength = getMaxLength()
      
      // Restrict input based on validation type
      if (validationType === 'aadhaar' || validationType === 'mobile') {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '')
        if (maxLength && numericValue.length <= maxLength) {
          e.target.value = numericValue
          onChange?.(e)
        }
      } else if (validationType === 'ifsc') {
        // Allow uppercase letters and numbers only
        const ifscValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        if (maxLength && ifscValue.length <= maxLength) {
          e.target.value = ifscValue
          onChange?.(e)
        }
      } else {
        onChange?.(e)
      }
    }

    return (
      <Input
        className={cn(className)}
        maxLength={getMaxLength()}
        pattern={getPattern()}
        placeholder={getPlaceholder()}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    )
  }
)
ValidatedInput.displayName = "ValidatedInput"

export { ValidatedInput }
