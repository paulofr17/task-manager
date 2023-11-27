import { toast } from 'react-hot-toast'

export const toaster = (variant: string | undefined, message: string) => {
  switch (variant) {
    case 'success':
      toast.success(message)
      break
    case 'error':
      toast.error(message)
      break
    case 'loading':
      toast.loading(message)
      break
    default:
      toast(message)
  }
}
