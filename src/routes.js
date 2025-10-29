import { createRouter, createWebHistory} from 'vue-router'
import homepage from './components/pages/homepage.vue'
import login from './components/pages/login.vue'
import register from './components/pages/register.vue'
import gallery from './components/pages/gallery.vue'
import booking from './components/pages/booking.vue'
import inventory from './components/pages/inventory.vue'
import calendar from './components/pages/calendar.vue'


const routes = [
    {
        name: "Home",
        path: "/",
        component: homepage
    },
    {
        name: "About",
        path: "/#About",
        component: homepage
    },
        {
        name: "Services",
        path: "/#Services",
        component: homepage
    },
    {
        name: "Login",
        path: "/login",
        component: login
    },
    {
        name: "Register",
        path: "/register",
        component: register
    },
    {
        name: "Gallery",
        path: "/gallery",
        component: gallery
    },
    {
        name: "Booking",
        path: "/booking",
        component: booking
    },
    {
        name: "Inventory",
        path: "/inventory",
        component: inventory
    },
    {
        name: "Calendar",
        path: "/calendar",
        component: calendar
    }
]

    const router = createRouter({
        history: createWebHistory(),
        routes,
        scrollBehavior(to, from, savedPosition) {
    // If the user is navigating with the back/forward buttons, use the saved position
    if (savedPosition) {
      return savedPosition;
    }

    // If the route has a hash (e.g., /#About), scroll to that element
    if (to.hash) {
      return {
        el: to.hash, // The selector for the element to scroll to (e.g., '#About')
        behavior: 'smooth', // This makes the scroll animation smooth! 🚀
      };
    }

    // Otherwise, scroll to the top of the page
    return { top: 0 };
  },
});

    export default router;