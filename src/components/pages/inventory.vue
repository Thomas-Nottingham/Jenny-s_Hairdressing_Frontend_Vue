<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3001/inventory";

const products = ref([]);
const newProduct = ref({
  name: "",
  link: "",
  description: "",
  quantity: 0,
});

// Fetch all products
const fetchProducts = async () => {
  try {
    const res = await axios.get(API_URL);
    products.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Error loading inventory");
  }
};

// Add product
const addProduct = async () => {
  try {
    const res = await axios.post(`${API_URL}/add`, newProduct.value);
    products.value.push(res.data);
    newProduct.value = { name: "", link: "", description: "", quantity: 0 };
  } catch (err) {
    console.error(err);
    alert("Error adding product");
  }
};

// Increase / decrease / delete
const increaseQuantity = async (id) => {
  const res = await axios.put(`${API_URL}/increase/${id}`);
  updateLocalProduct(res.data);
};

const decreaseQuantity = async (id) => {
  const res = await axios.put(`${API_URL}/decrease/${id}`);
  updateLocalProduct(res.data);
};

const deleteProduct = async (id) => {
  if (!confirm("Delete this product?")) return;
  await axios.delete(`${API_URL}/delete/${id}`);
  products.value = products.value.filter((p) => p._id !== id);
};

// Update local copy
const updateLocalProduct = (updated) => {
  const idx = products.value.findIndex((p) => p._id === updated._id);
  if (idx !== -1) products.value[idx] = updated;
};

onMounted(fetchProducts);
</script>

<template>
  <section class="inventory-container">
    <h1>Inventory</h1>

    <form @submit.prevent="addProduct" class="add-form">
      <input v-model="newProduct.name" placeholder="Product Name" required />
      <input v-model="newProduct.link" placeholder="Product Link" required />
      <input
        v-model="newProduct.description"
        placeholder="Description"
        required
      />
      <input v-model.number="newProduct.quantity" type="number" required />
      <button type="submit">Add</button>
    </form>

    <div class="product-list">
      <div class="product-card" v-for="product in products" :key="product._id">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <a
            :href="
              product.link.startsWith('http')
                ? product.link
                : '//' + product.link
            "
            target="_blank"
            >View Product</a
          >
          <p class="quantity">Quantity: {{ product.quantity }}</p>
        </div>

        <div class="button-group">
          <button class="increment" @click="increaseQuantity(product._id)">
            +
          </button>
          <button class="decrement" @click="decreaseQuantity(product._id)">
            -
          </button>
          <button class="delete-btn" @click="deleteProduct(product._id)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.inventory-container {
  width: 95%;
  max-width: 1000px;
  margin: 1.5rem auto;
  padding: 1.2rem 1.5rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: clamp(13px, 1vw, 15px);
  color: #3a3a3a;
  background-color: #fff8f0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(201, 168, 124, 0.25);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #5b4329;
  margin-bottom: 1.2rem;
  font-size: clamp(1.2rem, 3.5vw, 1.7rem);
}

/* --- Add Form --- */
.add-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.add-form input {
  flex: 1 1 200px;
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  border: 1px solid #c9a87c;
  border-radius: 6px;
  background: white;
  min-width: 120px;
  box-sizing: border-box;
}

.add-form button {
  padding: 0.45rem 1rem;
  font-weight: 600;
  background-color: #c9a87c;
  border: none;
  border-radius: 6px;
  color: #3a3a3a;
  cursor: pointer;
  transition: background-color 0.25s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.add-form button:hover {
  background-color: #b09158;
}

/* --- Product List --- */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.product-card {
  border: 1px solid #c9a87c;
  background-color: #f7f0db;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-wrap: break-word;
  word-break: break-word;
}

.product-card h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: #5b4329;
}

.product-card p {
  margin: 0.2rem 0;
  line-height: 1.4;
  font-size: 0.85rem;
}

.product-card a {
  font-size: 0.85rem;
  color: #6f4e37;
  text-decoration: underline;
  margin: 0.3rem 0;
  overflow-wrap: anywhere;
}

.product-card a:hover {
  color: #c9a87c;
}

.quantity {
  font-weight: 600;
  color: #5b4329;
  margin: 0.3rem 0;
}

/* --- Buttons --- */
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 0.3rem;
  margin-top: 0.4rem;
  flex-wrap: nowrap;
}

.product-card button {
  flex: 1;
  padding: 0.25rem 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  transition: background-color 0.25s ease, transform 0.1s ease;
  min-width: 30px;
  text-align: center;
}

.product-card button:hover {
  transform: scale(1.03);
}

.increment {
  background-color: #7bb661;
}
.increment:hover {
  background-color: #5e964a;
}

.decrement {
  background-color: #f0ad4e;
}
.decrement:hover {
  background-color: #d69736;
}

.delete-btn {
  background-color: #dc3545;
}
.delete-btn:hover {
  background-color: #c82333;
}

/* --- Tablet view (601px - 1024px) --- */
@media (max-width: 1024px) {
  .inventory-container {
    padding: 1rem;
  }

  .add-form input {
    flex: 1 1 45%;
  }

  .product-list {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.8rem;
  }

  .product-card {
    padding: 0.9rem;
  }
}

/* --- Mobile (≤600px) --- */
@media (max-width: 600px) {
  .inventory-container {
    padding: 0.8rem;
  }

  .add-form {
    flex-direction: column;
    align-items: stretch;
  }

  .add-form input,
  .add-form button {
    width: 100%;
  }

  .product-list {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .product-card {
    padding: 0.8rem;
  }

  .button-group {
    flex-direction: row;
    justify-content: space-evenly;
  }

  .product-card button {
    font-size: 0.75rem;
    padding: 0.35rem 0.4rem;
  }
}
</style>
