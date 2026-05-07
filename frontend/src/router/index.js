import {
  createRouter,
  createWebHistory
} from "vue-router";

import MainLayout from "../Layouts/MainLayout.vue";

import HomeView from "../views/HomeView.vue";

import AuthView from "../views/AuthView.vue";

import CreatePropertyView from "../views/CreatePropertyView.vue";

import SearchResultsView from "../views/SearchResultsView.vue";

import { useAuthStore } from "../stores/auth";


// =====================================
// ROUTES
// =====================================

const routes = [

  {
    path: "/",

    component: MainLayout,

    children: [

      // HOME
      {
        path: "",
        component: HomeView,
      },

      // SEARCH
      {
        path: "search",
        name: "search",
        component: SearchResultsView
      },

      // PROPERTY DETAIL
      {
        path: "property/:id",
        component: () =>
          import("../views/PropertyDetailView.vue"),
      },

      // BOOKINGS
      {
        path: "bookings",
        component: () =>
          import("../views/MyBookingsView.vue"),

        meta: {
          requiresAuth: true
        }
      },

      // MY PROPERTIES
      {
        path: "my-properties",
        component: () =>
          import("../views/MyPropertiesView.vue"),

        meta: {
          requiresAuth: true,
          requiresHost: true
        }
      },

      // EDIT PROPERTY
      {
        path: "edit-property/:id",

        component: () =>
          import("../views/EditPropertyView.vue"),

        meta: {
          requiresAuth: true,
          requiresHost: true
        }
      },

      // CREATE PROPERTY
      {
        path: "create-property",

        component: CreatePropertyView,

        meta: {
          requiresAuth: true,
          requiresHost: true
        }
      },

    ],
  },


  // AUTH
  {
    path: "/auth",
    component: AuthView,
  },

];


// =====================================
// ROUTER
// =====================================

const router = createRouter({

  history: createWebHistory(),

  routes,

});


// =====================================
// GUARDS
// =====================================

router.beforeEach((to, from, next) => {

  const auth = useAuthStore();

  // LOGIN
  if (
    to.meta.requiresAuth &&
    !auth.isAuthenticated
  ) {

    next("/auth");

    return;
  }

  // HOST
  if (
    to.meta.requiresHost &&
    auth.user?.role !== "host"
  ) {

    alert("Debes ser anfitrión");

    next("/");

    return;
  }

  next();
});


// =====================================
// EXPORT
// =====================================

export default router;