import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/todos.vue')
  }
]

export default createRouter ({
  history: createWebHashHistory(),
  routes: routes
})