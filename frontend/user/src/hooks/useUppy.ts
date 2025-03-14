// hooks/useUppy.ts
import { useEffect, useState } from 'react';
import UppyCore from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import XHRUpload from '@uppy/xhr-upload';

export interface UseUppyOptions {
  mode: 's3' | 'laravel' | 'external';
  // For direct S3 uploads, supply the companion URL.
  s3CompanionUrl?: string;
  // For Laravel backend uploads, supply the endpoint.
  laravelEndpoint?: string;
  // For an external API upload endpoint.
  externalEndpoint?: string;
  // Optional folder prefix for organizing uploads on the server.
  folderPrefix?: string;
}

export function useUppy({
  mode,
  s3CompanionUrl = '',
  laravelEndpoint = '/api/upload',
  externalEndpoint = '/api/external-upload',
  folderPrefix,
}: UseUppyOptions) {
  const [uppy, setUppy] = useState<UppyCore | null>(null);

  useEffect(() => {
    // Instantiate Uppy using new UppyCore
    const uppyInstance = new UppyCore({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: true,
    });

    // If a folderPrefix is provided, set it as meta data.
    if (folderPrefix) {
      uppyInstance.setMeta({ folderPrefix });
    }

    // Configure plugins based on the chosen mode.
    if (mode === 's3') {
      // Casting options to any if necessary for companionUrl
      uppyInstance.use(AwsS3, {
        companionUrl: s3CompanionUrl,
      } as any);
    } else if (mode === 'laravel') {
      uppyInstance.use(XHRUpload, {
        endpoint: laravelEndpoint,
        formData: true,
        fieldName: 'file',
      });
    } else if (mode === 'external') {
      uppyInstance.use(XHRUpload, {
        endpoint: externalEndpoint,
        formData: true,
        fieldName: 'file',
      });
    }

    setUppy(uppyInstance);

    return () => {
      // Use any-cast for close method if types are missing it.
    //   (uppyInstance as any).close();
      (uppyInstance as unknown as { close: () => void }).close?.();
        uppyInstance.cancelAll();
    };
  }, [mode, s3CompanionUrl, laravelEndpoint, externalEndpoint, folderPrefix]);

  return uppy;
}
