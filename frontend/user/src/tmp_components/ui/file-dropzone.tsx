// components/ui/file-dropzone.tsx
'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FileDropzoneProps {
  onDrop: (files: File[]) => void
  className?: string
  accept?: Record<string, string[]>
}

export function FileDropzone({
  onDrop,
  className,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/50',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="sm" type="button" className="text-muted-foreground">
            Click to upload or drag and drop
          </Button>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, GIF up to 4MB
          </p>
        </div>
      </div>
    </div>
  )
}