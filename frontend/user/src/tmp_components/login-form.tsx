// src/components/auth/login-form.tsx
import { useState } from "react"
import { useForm } from "@inertiajs/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FormEventHandler } from "react"

interface LoginFormProps {
  className?: string
  canResetPassword: boolean
  status?: string
}

// Define the type alias for your form data
export type LoginFormData = {
    email: string;
    password: string;
    remember: boolean;
  };
export function LoginForm({ className, canResetPassword, status }: LoginFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className={cn("grid gap-6", className)}>
      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {status}
        </div>
      )}
      
      <form onSubmit={submit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              autoComplete="username"
              autoFocus
              onChange={(e) => setData('email', e.target.value)}
              placeholder="name@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {canResetPassword && (
                <a 
                  href={route('password.request')} 
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Forgot your password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              autoComplete="current-password"
              onChange={(e) => setData('password', e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={data.remember}
              onCheckedChange={(checked) => 
                setData('remember', checked === true)
              }
            />
            <Label 
              htmlFor="remember" 
              className="text-sm font-normal"
            >
              Remember me
            </Label>
          </div>
          
          <Button type="submit" disabled={processing} className="w-full">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}