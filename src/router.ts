import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/explore', name: 'explore', component: () => import('@/views/ExploreView.vue') },
    { path: '/places/:id', name: 'place-detail', component: () => import('@/views/PlaceDetailView.vue') },
    { path: '/festivals', name: 'festivals', component: () => import('@/views/FestivalsView.vue') },
    { path: '/festivals/:id', name: 'festival-detail', component: () => import('@/views/FestivalDetailView.vue') },
    { path: '/community', name: 'community', component: () => import('@/views/CommunityListView.vue') },
    { path: '/community/new', name: 'community-new', component: () => import('@/views/CommunityFormView.vue') },
    { path: '/community/:id', name: 'community-detail', component: () => import('@/views/CommunityDetailView.vue') },
    { path: '/community/:id/edit', name: 'community-edit', component: () => import('@/views/CommunityFormView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
