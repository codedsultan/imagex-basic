// src/Pages/Profile/Partials/DeleteUserForm.tsx
import { useState, useRef, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export default function DeleteUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { data, setData, delete: destroy, processing, reset, errors } = useForm({ password: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    destroy(route('profile.destroy'), {
      onSuccess: () => setIsOpen(false),
      onError: () => passwordRef.current?.focus(),
      onFinish: () => reset(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <Button variant="destructive" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span>Delete Account</span>
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogDescription>
            This action <strong>cannot</strong> be undone. Please enter your password to permanently delete your account and all associated data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              ref={passwordRef}
              autoFocus
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <DialogFooter className="flex justify-center space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" type="submit" disabled={processing}>
              Delete Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
