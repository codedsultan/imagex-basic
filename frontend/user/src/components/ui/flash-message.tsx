import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"; // Icons

interface FlashProps {
  message: string;
  status: "success" | "error" | "info" | "warning";
  title?: string;
}

export function FlashMessage() {
  const { flash } = usePage<PageProps>().props as { flash?: FlashProps };
  const { toast } = useToast();

  useEffect(() => {
    if (flash && flash.message) {
      let icon, variantStyle;

      switch (flash.status) {
        case "success":
          icon = <CheckCircle className="h-5 w-5 text-green-500" />;
          variantStyle = "border-l-4 border-green-500 bg-green-50 text-green-700";
          break;
        case "error":
          icon = <XCircle className="h-5 w-5 text-red-500" />;
          variantStyle = "border-l-4 border-red-500 bg-red-50 text-red-700";
          break;
        case "info":
          icon = <Info className="h-5 w-5 text-blue-500" />;
          variantStyle = "border-l-4 border-blue-500 bg-blue-50 text-blue-700";
          break;
        case "warning":
          icon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
          variantStyle = "border-l-4 border-yellow-500 bg-yellow-50 text-yellow-700";
          break;
        default:
          icon = null;
          variantStyle = "border-l-4 border-gray-500 bg-gray-50 text-gray-700";
      }

      toast({
        title: flash.title || flash.status.toUpperCase(),
        description: (
          <div className="flex items-center gap-2">
            {icon} {/* Icon */}
            <span>{flash.message}</span>
          </div>
        ),
        className: variantStyle, // Apply custom styles
      });
    }
  }, [flash, toast]);

  return <Toaster />;
}
