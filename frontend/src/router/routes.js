
const routes = [
  {
    path: '/auth',
    component: () => import('layouts/noLayout.vue'),
    children: [
      { path: '/auth/login', component: () => import('pages/Auth.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/params', component: () => import('pages/parametersPage.vue') },
      { path: '/settings', component: () => import('pages/Settings.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
