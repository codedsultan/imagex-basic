import React, { useEffect } from 'react';
import { Dashboard } from '@uppy/react';
import UppyCore from '@uppy/core';
import { useUppy, UseUppyOptions } from '@/hooks/useUppy';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

// Define a custom type for Uppy’s complete event result.
export interface UppyCompleteResult {
  // Mark successful as optional to allow for undefined.
  successful?: Array<{
    id: string;
    name: string;
    type: string;
    // The response body from the upload endpoint (if provided).
    response?: {
      body?: {
        [key: string]: any;
        fileUrl?: string;
      };
    };
    // For direct uploads, the URL might be available as uploadURL.
    uploadURL?: string;
  }>;
  failed?: any[];
}

interface UppyUploaderProps extends UseUppyOptions {
  onComplete: (uppyResult: UppyCompleteResult) => void;
}

export function UppyUploader({
  mode,
  s3CompanionUrl,
  laravelEndpoint,
  folderPrefix,
  onComplete,
}: UppyUploaderProps) {
  const uppy = useUppy({ mode, s3CompanionUrl, laravelEndpoint, folderPrefix });

  useEffect(() => {
    if (!uppy) return;

    const onCompleteHandler = (result: unknown) => {
      // Cast the result to your custom type.
      onComplete(result as UppyCompleteResult);
    };

    uppy.on('complete', onCompleteHandler);

    return () => {
      uppy.off('complete', onCompleteHandler);
    };
  }, [uppy, onComplete]);

  if (!uppy) return null;

  return <Dashboard uppy={uppy} />;
}
