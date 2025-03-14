import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoginForm } from "@/components/login-form"


export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )} */}

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your credentials to sign in to your account
                    </p>
                </div>
                <LoginForm 
                    status={status} 
                    canResetPassword={canResetPassword} 
                />
                <p className="px-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{" "}
                    <a 
                        href={route('register')} 
                        className="underline hover:text-brand"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </GuestLayout>
    );
}
