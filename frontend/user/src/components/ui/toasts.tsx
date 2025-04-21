import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

const toastVariants = cva(
  "flex items-center gap-3 p-4 rounded-lg shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-white",
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-black",
        info: "bg-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = ({
  title,
  description,
  variant,
}: {
  title: string
  description: string
  variant?: "success" | "error" | "warning" | "info"
}) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-white" />
      case "error":
        return <XCircle className="w-5 h-5 text-white" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-black" />
      case "info":
        return <Info className="w-5 h-5 text-white" />
      default:
        return null
    }
  }

  return (
    <ToastPrimitives.Root className={cn(toastVariants({ variant }))}>
      <div className="flex items-center space-x-2">
        {getIcon()}
        <div>
          <ToastPrimitives.Title className="font-bold">{title}</ToastPrimitives.Title>
          <ToastPrimitives.Description className="text-sm">{description}</ToastPrimitives.Description>
        </div>
      </div>
    </ToastPrimitives.Root>
  )
}

export { Toast }
