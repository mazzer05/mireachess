import { createRouter, createWebHistory } from 'vue-router'
import ChessGame from '../components/ChessGame.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: ChessGame
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 