import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";
import CreatePropertyView from "../views/CreatePropertyView.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: HomeView, // 👈 ESTA ES LA CLAVE
      },
      {
        path: "property/:id",
        component: () => import("../views/PropertyDetailView.vue"),
      },
      {
        path: "bookings",
        component: () => import("../views/BookingsView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "create-property",
        component: CreatePropertyView,
        meta: { requiresAuth: true, requiresHost: true },
      },
    ],
  },

  // 🔥 LOGIN separado
  {
    path: "/auth",
    component: AuthView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import { useAuthStore } from "../stores/auth";

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/auth");
  } else if (to.meta.requiresHost && auth.user?.role !== "host") {
    alert("Debes ser anfitrión");
    next("/");
  } else {
    next();
  }
});

export default router;