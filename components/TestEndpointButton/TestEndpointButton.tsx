import { Button, ButtonProps } from '@/components/ui/Button'

interface TestEndpointButtonProps extends Omit<ButtonProps, 'variant'> {
  isLoading?: boolean
}

export const TestEndpointButton = ({
  isLoading = false,
  children,
  className = '',
  ...props
}: TestEndpointButtonProps) => {
  return (
    <Button
      {...props}
      size="sm"
      variant="default"
      className={`min-w-[100px] sm:min-w-[120px] ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </div>
      ) : (
        children || 'Test Endpoint'
      )}
    </Button>
  )
}
