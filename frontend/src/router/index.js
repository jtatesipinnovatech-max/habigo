import { createRouter, createWebHistory } from "vue-router";
import AuthView from "../views/AuthView.vue";
import HomeView from "../views/HomeView.vue";
import PropertyDetailView from "../views/PropertyDetailView.vue";
import MainLayout from "../Layouts/MainLayout.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    component: AuthView,
  },

  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
children: [
  {
    path: "home",
    component: HomeView,
  },
  {
    path: "property/:id",
    component: PropertyDetailView,
  },

  {
    path: "bookings",
    component: () => import("../views/BookingsView.vue"),
  },
  {
    path: "dashboard",
    component: () => import("../views/DashboardView.vue"),
  },
]
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