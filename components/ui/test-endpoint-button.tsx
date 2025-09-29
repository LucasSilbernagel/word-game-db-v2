import { Button, ButtonProps } from '@/components/ui/button'

interface TestEndpointButtonProps extends Omit<ButtonProps, 'variant'> {
  isLoading?: boolean
}

export function TestEndpointButton({
  isLoading = false,
  children,
  className = '',
  ...props
}: TestEndpointButtonProps) {
  return (
    <Button
      {...props}
      size="sm"
      variant="default"
      className={`min-w-[100px] sm:min-w-[120px] ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children || 'Test Endpoint'
      )}
    </Button>
  )
}
