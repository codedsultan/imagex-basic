import React, { ChangeEvent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

interface Design {
  id: number;
  name: string;
  description?: string;
  design_data: string;
  thumbnail?: string;
}

interface EditDesignProps {
  auth: any;
  design: Design;
}

export default function EditDesign({ auth, design }: EditDesignProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: design.name,
    description: design.description,
    design_data: design.design_data,
    thumbnail: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('designs.update', design.id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData('thumbnail', e.target.files ? e.target.files[0] : null);
  };

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Edit Design</h2>}>
      <Head title="Edit Design" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
                {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {errors.description && <span className="text-red-600 text-sm">{errors.description}</span>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Design Data (JSON)</label>
                <textarea
                  value={data.design_data}
                  onChange={(e) => setData('design_data', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
                {errors.design_data && <span className="text-red-600 text-sm">{errors.design_data}</span>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Thumbnail</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block"
                />
                {errors.thumbnail && <span className="text-red-600 text-sm">{errors.thumbnail}</span>}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
