import { createRouter, createWebHistory } from 'vue-router'

import ImageSelection from '@/views/imageselection/ImageSelection.vue'

const routes = [
  { path: '/', redirect: { name: 'image_selection' } },
  { path: '/image_selection', name: 'image_selection', component: ImageSelection, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})


export default router
