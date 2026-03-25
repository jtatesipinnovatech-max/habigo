import { createRouter, createWebHistory } from "vue-router";
import AuthView from "../views/AuthView.vue";
import HomeView from "../views/HomeView.vue";
import PropertyDetailView from "../views/PropertyDetailView.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", component: AuthView },

  {
    path: "/home",
    component: HomeView,
    meta: { requiresAuth: true },
  },

  {
    path: "/property/:id",
    component: PropertyDetailView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;