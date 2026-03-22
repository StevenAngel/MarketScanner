import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsView.vue') // Lazy loading
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('@/views/PortfolioView.vue') // Lazy loading
    },
    {
      path: '/coin',
      redirect: { name: 'home' } // Oder redirect: '/' falls du keinen Namen nutzt
    },
    {
      path: '/coin/:coin',
      name: 'coin',
      component: () => import('@/views/CoinView.vue'),
      // Best Practice: Wandelt URL-Parameter (:coin) in Props um
      props: true
    }
  ],
})

export default router
