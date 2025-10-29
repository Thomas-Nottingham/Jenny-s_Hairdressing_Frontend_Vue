import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// This is our central "store"
const user = ref(null); // Will hold user data like { name: 'John', email: '...' }

export function useUserStore() {
  const router = useRouter();

  // A computed property to easily check if the user is logged in
  const isLoggedIn = computed(() => !!user.value);

  // Function to handle login
  const login = (userData) => {
    user.value = userData;
    // Store user data in localStorage to keep them logged in on page refresh
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle logout
  const logout = () => {
    user.value = null;
    // Remove user data from localStorage
    localStorage.removeItem('user');
    // Optional: Redirect to login page after logout
    
  };

  // Function to check if a user was already logged in from a previous session
  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    checkAuth,
  };
}