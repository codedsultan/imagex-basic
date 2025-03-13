import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DesignUpload({ auth }: { auth: any }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }
    router.post('/designs', formData, {
      onError: (err: any) => setErrors(err),
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Upload Design
        </h2>
      }
    >
      <Head title="Upload Design" />
      <form onSubmit={handleSubmit} className="max-w-lg p-4 border rounded">
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {errors.title && <span className="text-red-500">{errors.title}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {errors.description && <span className="text-red-500">{errors.description}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Design File</label>
          <input
            type="file"
            onChange={e => e.target.files && setFile(e.target.files[0])}
          />
          {errors.file && <span className="text-red-500">{errors.file}</span>}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Upload
        </button>
      </form>
    </AuthenticatedLayout>
  );
}
