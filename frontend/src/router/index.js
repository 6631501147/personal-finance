import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/transactions', name: 'Transactions', component: () => import('../views/Transactions.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
