<script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const apiUrl = "http://localhost:3001/user/signup";

const user = ref({
  name: "",
  email: "",
  password: "",
  phone: "",
  admin: false,
});

const toast = useToast();

const CreateUser = async () => {
  if (
    !user.value.name ||
    !user.value.email ||
    !user.value.phone ||
    !user.value.password
  ) {
    toast.error("All fields are required");
    return; // Add return to prevent API call
  }

  try {
    const response = await axios.post(apiUrl, user.value);
    console.log(response.data); // Log the actual response data

    // Check the response data status, not HTTP status
    if (response.data.status === "SUCCESS") {
      toast.success("Signup Successful!");
      user.value.name = "";
      user.value.email = "";
      user.value.phone = "";
      user.value.password = "";
    } else if (response.data.status === "FAILED") {
      // Show the specific error message from backend
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error);
    // Handle network errors or other exceptions
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
    <form @submit.prevent="CreateUser">
      <div class="Register-Container">
        <div class="Login-Header">
          <h1>SignUp</h1>
        </div>

        <div class="Input-Section">
          <div class="FullName">
            <h6>Full name</h6>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                type="text"
                v-model="user.name"
                class="Pass-Input"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div class="Password">
            <h6>Password</h6>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                type="password"
                class="Pass-Input"
                v-model="user.password"
                placeholder="Password"
              />
            </div>
          </div>

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

          <div class="Contact">
            <h6>Phone Number</h6>
            <div class="input-wrapper">
              <span class="input-icon">📞</span>
              <input
                type="text"
                v-model="user.phone"
                class="Contact-Input"
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        <button type="submit" class="login-btn">Register</button>

        <p class="signup-text">
          Already have an account?
          <router-link to="/login" class="signup-link">Sign in</router-link>
        </p>
      </div>
    </form>
  </section>
</template>

<style scoped>
.Front {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url("../../assets/images/SignUp-Background-Pic.png");
  background-size: cover;
  height: 97vh;
  padding: 0 5%;
}

.Register-Container {
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #87cac9;
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

.Contact,
.FullName,
.Email,
.Password {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

.Contact h6,
.FullName h6,
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

.Contact-Input,
.FullName-Input,
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

.FullName:focus,
.Contact:focus,
.Email-Input:focus,
.Pass-Input:focus {
  outline: none;
  border-color: #3c8180;
  background: rgba(255, 255, 255, 0.9);
}

.Contact-Input::placeholder,
.FullName-Input::placeholder,
.Email-Input::placeholder,
.Pass-Input::placeholder {
  color: #a1887f;
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

@media (max-width: 1050px) {
  .Register-Container {
    top: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #87cac9;
    backdrop-filter: blur(10px);
    padding: 1.6rem 2rem 1.6rem 2rem;
    border-radius: 16px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}
</style>
