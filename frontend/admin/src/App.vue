<template>
    <Inertia :initial-page="initialPage" :resolve-component="resolveComponent" />
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Inertia } from '@inertiajs/inertia-vue3';

  const initialPage = ref<any>(null);
  const resolveComponent = (name: string) => import(`./pages/${name}.vue`).then((module) => module.default);

  onMounted(() => {
    const el = document.getElementById('app');
    if (el && el.dataset.page) {
      initialPage.value = JSON.parse(el.dataset.page);
    }
  });
  </script>
