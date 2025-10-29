<script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router"; // Import the router
import { useUserStore } from "../../stores/users"; // ✨ Import our new user store

const apiUrl = "http://localhost:3001/user/login";

const user = ref({
  email: "",
  password: "",
});

const toast = useToast();
const router = useRouter(); // Initialize the router
const userStore = useUserStore(); // Initialize the store

const checkUser = async () => {
  if (!user.value.email || !user.value.password) {
    toast.error("All fields are required");
    return;
  }

  try {
    const response = await axios.post(apiUrl, user.value);

    if (response.data.status === "SUCCESS") {
      toast.success("You have been signed in!");

      // ✨ Use the store's login function
      // IMPORTANT: I'm assuming your backend sends user data in `response.data.data`
      // Adjust this based on your actual API response structure!
      userStore.login(response.data.data);

      user.value.email = "";
      user.value.password = "";

      // ✨ Redirect to the homepage
      router.push("/");
    } else if (response.data.status === "FAILED") {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
</script>

<template>
  <section class="Front">
    <div class="Login-Container">
      <div class="Login-Header">
        <h1>LOGIN</h1>
      </div>

      <form @submit.prevent="checkUser">
        <div class="Input-Section">
          <div class="Email">
            <h6>Email address</h6>
            <div class="input-wrapper">
              <span class="input-icon">✉</span>
              <input
                type="email"
                v-model="user.email"
                class="Email-Input"
                placeholder="Email address"
              />
            </div>
          </div>

          <div class="Password">
            <h6>Password</h6>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                type="password"
                v-model="user.password"
                class="Pass-Input"
                placeholder="Password"
              />
            </div>
          </div>
        </div>
        <button type="submit" class="login-btn">Login</button>
      </form>
      <div class="forgot-password">
        <a href="#">Forgot password?</a>
      </div>

      <p class="signup-text">
        Don't have an account?
        <router-link to="/register" class="signup-link">Sign up</router-link>
      </p>
    </div>
  </section>
</template>

<style scoped>
.Front {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url("../../assets/images/Jenny-Login_landscape.png");
  background-size: cover;
  height: 88vh;
  padding: 0 5%;
}

.Login-Container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f7e5c9;
  backdrop-filter: blur(10px);
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.Login-Header h1 {
  text-align: center;
  margin: auto 0 2rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #4a4a4a;
  letter-spacing: 2px;
}

.Input-Section {
  margin-bottom: 1rem;
}

.Email,
.Password {
  margin-bottom: 1.5rem;
}

.Email h6,
.Password h6 {
  margin: 0 0 0.5rem 0;
  color: #4a4a4a;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #8d6e63;
  font-size: 1rem;
  z-index: 2;
}

.Email-Input,
.Pass-Input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(248, 245, 240, 0.6);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.Email-Input:focus,
.Pass-Input:focus {
  outline: none;
  border-color: #d4a574;
  background: rgba(255, 255, 255, 0.9);
}

.Email-Input::placeholder,
.Pass-Input::placeholder {
  color: #a1887f;
}

.forgot-password {
  position: relative;
  top: 50%;
  left: 0%;
  margin-bottom: 1.5rem;
}

.forgot-password a {
  color: #8d6e63;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  color: #5d4037;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #d2691e 0%, #cd853f 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.login-btn:hover {
  background: linear-gradient(135deg, #cd853f 0%, #a0522d 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(210, 105, 30, 0.3);
}

.signup-text {
  text-align: center;
  margin: 0;
  color: #6d4c41;
  font-size: 0.9rem;
}

.signup-link {
  color: #d2691e;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
