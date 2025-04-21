import { useRef, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';

export default function UpdatePasswordForm() {
  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const {
    data,
    setData,
    put,
    processing,
    errors,
    recentlySuccessful,
    reset,
  } = useForm({ current_password: '', password: '', password_confirmation: '' });

  function submit(e: FormEvent) {
    e.preventDefault();
    put(route('password.update'), {
      onSuccess: () => reset(),
      onError: errs => {
        if (errs.password) newRef.current?.focus();
        if (errs.current_password) currentRef.current?.focus();
      },
    });
  }

  return (
    <>
    <form onSubmit={submit} className="space-y-6">
      <div>
        <Label htmlFor="current_password">Current Password</Label>
        <Input
          id="current_password"
          type="password"
          value={data.current_password}
          onChange={e => setData('current_password', e.target.value)}
          ref={currentRef}
        />
        {errors.current_password && <p className="text-sm text-red-600">{errors.current_password}</p>}
      </div>

      <div>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={data.password}
          onChange={e => setData('password', e.target.value)}
          ref={newRef}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <Label htmlFor="password_confirmation">Confirm Password</Label>
        <Input
          id="password_confirmation"
          type="password"
          value={data.password_confirmation}
          onChange={e => setData('password_confirmation', e.target.value)}
          ref={confirmRef}
        />
        {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
      </div>

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
    </>
  );
}
