import { useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { PageProps } from '@/types';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
//   const user = usePage().props.user;
  const { auth: { user } } = usePage<PageProps>().props;

  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({ name: user.name, email: user.email });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    patch(route('profile.update'));
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      {mustVerifyEmail && user.email_verified_at === null && (
        <div className="text-sm text-yellow-600">
          Your email is unverified.
          <Link href={route('verification.send')} method="post" as="button" className="underline ml-1">
            Resend verification
          </Link>
          {status === 'verification-link-sent' && <p className="mt-1 text-green-600">A new link has been sent.</p>}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <Button type="submit" disabled={processing}>Save</Button>
        <Transition
          show={recentlySuccessful}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <p className="text-sm text-green-600">Saved.</p>
        </Transition>
      </div>
    </form>
  );
}
