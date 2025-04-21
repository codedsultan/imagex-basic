// src/Pages/Profile/Edit.tsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User2, Lock, Trash2 } from 'lucide-react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ mustVerifyEmail, status }: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  return (
    <AuthenticatedLayout
      header={<h2 className="text-2xl font-bold">Profile</h2>}
    >
      <Head title="Profile" />

      <div className="py-12 mx-auto max-w-4xl px-4">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center justify-center space-x-2">
              <User2 className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center justify-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </TabsTrigger>
            <TabsTrigger value="delete" className="flex items-center justify-center space-x-2 text-red-600">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex items-center space-x-2">
                <User2 className="h-5 w-5 text-gray-600" />
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateProfileInformationForm
                  mustVerifyEmail={mustVerifyEmail}
                  status={status}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-gray-600" />
                <CardTitle>Update Password</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdatePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delete">
            <Card>
              <CardHeader className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-600">Delete Account</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <div className='max-w-md mx-auto'>
                    <p className="mt-1 text-sm max-w-prose  text-center mb-4 text-gray-600 dark:text-gray-400">
                        Once your account is deleted, all of its resources and data
                        will be permanently deleted. Before deleting your account,
                        please download any data or information that you wish to
                        retain.
                    </p>
                    <DeleteUserForm />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
