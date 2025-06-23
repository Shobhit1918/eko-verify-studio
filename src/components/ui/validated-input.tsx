
import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
        // Only allow numbers and enforce max length strictly
        const numericValue = value.replace(/[^0-9]/g, '')
        if (maxLength && numericValue.length > maxLength) {
          toast.error(`Maximum ${maxLength} digits allowed for ${validationType}`)
          return // Don't update the input
        }
        e.target.value = numericValue
        onChange?.(e)
      } else if (validationType === 'ifsc') {
        // Allow uppercase letters and numbers only, enforce max length strictly
        const ifscValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        if (maxLength && ifscValue.length > maxLength) {
          toast.error(`Maximum ${maxLength} characters allowed for IFSC code`)
          return // Don't update the input
        }
        e.target.value = ifscValue
        onChange?.(e)
      } else {
        onChange?.(e)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentValue = (e.target as HTMLInputElement).value
      const maxLength = getMaxLength()
      
      // Allow backspace, delete, arrow keys, tab, etc.
      if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)) {
        return
      }
      
      // Prevent further input if max length reached
      if (maxLength && currentValue.length >= maxLength) {
        e.preventDefault()
        toast.error(`Maximum ${maxLength} characters limit reached`)
      }
      
      // Additional validation for specific types
      if (validationType === 'aadhaar' || validationType === 'mobile') {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault()
          toast.error(`Only numbers allowed for ${validationType}`)
        }
      } else if (validationType === 'ifsc') {
        if (!/[A-Za-z0-9]/.test(e.key)) {
          e.preventDefault()
          toast.error('Only letters and numbers allowed for IFSC code')
        }
      }
    }

    return (
      <Input
        className={cn(className)}
        maxLength={getMaxLength()}
        pattern={getPattern()}
        placeholder={getPlaceholder()}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={ref}
        {...props}
      />
    )
  }
)
ValidatedInput.displayName = "ValidatedInput"

export { ValidatedInput }
