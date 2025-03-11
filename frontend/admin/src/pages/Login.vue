<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <form @submit.prevent="handleSubmit" class="p-8 bg-white rounded shadow-md">
        <h2 class="text-xl mb-4">Admin Login</h2>
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          class="border p-2 mb-4 w-full"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="border p-2 mb-4 w-full"
        />
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  import { useForm } from '@inertiajs/inertia-vue3';

  const email = ref('');
  const password = ref('');

  const handleSubmit = () => {
    // Using Inertia's useForm helper for form submissions
    const form = useForm({
      email: email.value,
      password: password.value,
    });

    form.post('/admin/login');
  };
  </script>
