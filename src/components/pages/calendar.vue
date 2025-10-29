<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// --- Calendar state ---
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref(null);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --- Generate days of the current month ---
const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};
const days = ref(getDaysInMonth(currentMonth.value, currentYear.value));

// --- Change month ---
const changeMonth = (offset) => {
  currentMonth.value += offset;
  if (currentMonth.value > 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else if (currentMonth.value < 0) {
    currentMonth.value = 11;
    currentYear.value--;
  }
  days.value = getDaysInMonth(currentMonth.value, currentYear.value);
};

// --- Booking state ---
const allBookings = ref([]);
const loading = ref(false);
const error = ref(null);

const API_BASE_URL = "http://localhost:3001";

// --- Fetch all bookings ---
const fetchBookings = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/bookings`);
    allBookings.value = response.data;
  } catch (err) {
    console.error("❌ Failed to fetch bookings:", err);
    error.value = err.response?.data?.error || "Failed to fetch bookings";
  } finally {
    loading.value = false;
  }
};

// --- Delete booking ---
const deleteBooking = async (bookingId) => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this booking?"
  );
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/booking/bookings/${bookingId}`);
    allBookings.value = allBookings.value.filter((b) => b._id !== bookingId);
    alert("Booking deleted successfully!");
  } catch (err) {
    console.error("❌ Failed to delete booking:", err);
    alert("Failed to delete booking");
  }
};

// --- Helpers ---
const selectDate = (day) => (selectedDate.value = day);

const isToday = (date) =>
  date.getDate() === today.getDate() &&
  date.getMonth() === today.getMonth() &&
  date.getFullYear() === today.getFullYear();

const isSelected = (date) =>
  selectedDate.value &&
  date.toDateString() === selectedDate.value.toDateString();

const isSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const bookingsOnDate = (date) => {
  const filtered = allBookings.value.filter((b) => isSameDate(b.date, date));
  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

onMounted(() => {
  fetchBookings();
  setInterval(fetchBookings, 30000);
});
</script>

<template>
  <section class="calendar-container">
    <div v-if="error" class="error-message">
      ⚠️ {{ error }}
      <button @click="fetchBookings" class="retry-btn">Retry</button>
    </div>

    <div v-if="loading" class="loading-message">Loading bookings...</div>

    <header class="calendar-header">
      <button @click="changeMonth(-1)">‹</button>
      <h2>{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
      <button @click="changeMonth(1)">›</button>
    </header>

    <div class="day-names">
      <div v-for="d in dayNames" :key="d" class="day-name">{{ d }}</div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="n in new Date(currentYear, currentMonth, 1).getDay()"
        :key="'empty-' + n"
        class="empty-cell"
      ></div>

      <div
        v-for="day in days"
        :key="day.getDate()"
        class="day-cell"
        :class="{
          today: isToday(day),
          selected: isSelected(day),
          'has-bookings': bookingsOnDate(day).length > 0,
        }"
        @click="selectDate(day)"
      >
        <div class="day-number">{{ day.getDate() }}</div>
        <div v-for="b in bookingsOnDate(day)" :key="b._id" class="booking-item">
          {{ b.service }} @ {{ formatTime(b.date) }}
        </div>
      </div>
    </div>

    <div v-if="selectedDate" class="selected-info">
      <h3>Selected Date: {{ selectedDate.toDateString() }}</h3>
      <div v-if="bookingsOnDate(selectedDate).length === 0" class="no-bookings">
        No bookings on this date.
      </div>
      <div v-else class="selected-bookings">
        <div
          v-for="b in bookingsOnDate(selectedDate)"
          :key="b._id"
          class="selected-booking-detail"
        >
          <strong>{{ b.customerName }}</strong> - {{ b.service }}<br />
          Time: {{ formatTime(b.date) }}<br />
          Location: {{ b.location }}
          <br />
          <button
            @click="deleteBooking(b._id)"
            class="delete-btn"
            style="margin-top: 8px"
          >
            🗑 Delete Booking
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calendar-container {
  max-width: 900px;
  margin: 1rem auto;
  padding: 1rem;
  background: #fff8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(201, 168, 124, 0.3);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #3a3a3a;
  overflow-x: hidden;
}

/* Header */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  text-align: center;
}

.calendar-header h2 {
  font-size: 1.3rem;
  color: #5b4329;
  flex-grow: 1;
}

.calendar-header button {
  background-color: #c9a87c;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.calendar-header button:hover {
  background-color: #b09158;
}

/* Day names */
.day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #5b4329;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

/* Calendar grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.day-cell {
  background: #f7f0db;
  border-radius: 6px;
  text-align: center;
  padding: 0.6rem 0.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  min-height: 65px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}
.day-cell:hover {
  background: #e8dcc2;
  transform: scale(1.03);
}
.day-cell.today {
  background: #7bb661;
  color: white;
  font-weight: 600;
}
.day-cell.selected {
  outline: 3px solid #c9a87c;
  background: #f0e4c0;
}
.day-cell.has-bookings {
  background: #ffe8f0;
}
.day-number {
  font-weight: 600;
  margin-bottom: 2px;
}
.empty-cell {
  visibility: hidden;
}
.booking-item {
  font-size: 0.65rem;
  background: #823973;
  color: white;
  border-radius: 4px;
  padding: 2px 3px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Selected info */
.selected-info {
  margin-top: 1rem;
  background: #f7f0db;
  border-radius: 8px;
  padding: 1rem;
  border: 2px solid #c9a87c;
}
.selected-info h3 {
  margin-top: 0;
  color: #5b4329;
  font-size: 1rem;
}
.selected-bookings {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.selected-booking-detail {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #823973;
  font-size: 0.9rem;
}
.no-bookings {
  color: #666;
  font-style: italic;
}
.delete-btn {
  background: #b22222 !important;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.delete-btn:hover {
  background: #8b0000 !important;
  transform: translateY(-1px);
}

/* ✅ Responsive adjustments */
@media (max-width: 900px) {
  .calendar-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media (max-width: 700px) {
  .calendar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .day-names {
    grid-template-columns: repeat(3, 1fr);
  }
  .calendar-header h2 {
    font-size: 1.1rem;
  }
  .booking-item {
    font-size: 0.7rem;
  }
}
@media (max-width: 480px) {
  .calendar-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .day-names {
    display: none;
  }
  .calendar-container {
    padding: 0.8rem;
    border-radius: 8px;
  }
  .calendar-header {
    flex-direction: column;
  }
  .calendar-header h2 {
    font-size: 1rem;
  }
  .day-cell {
    font-size: 0.8rem;
    min-height: 55px;
  }
}
</style>
