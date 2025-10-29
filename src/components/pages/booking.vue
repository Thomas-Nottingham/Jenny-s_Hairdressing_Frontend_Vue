<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();

// --- Reactive state ---
const categories = ref({});
const selectedCategory = ref("");
const selectedService = ref("");
const form = ref({
  customerName: "",
  date: "",
  time: "",
  location: "salon",
});
const bookings = ref([]);

// Salon closing time (18:00)
const SALON_CLOSE_HOUR = 18;
const SALON_CLOSE_MINUTE = 0;
const BUFFER_MINUTES = 15; // 15 minute buffer between bookings

// --- Fetch services and bookings from backend ---
onMounted(async () => {
  try {
    // Fetch services
    const { data: servicesData } = await axios.get(
      "http://localhost:3001/booking/services"
    );
    const grouped = {};
    servicesData.forEach((service) => {
      if (!grouped[service.category]) grouped[service.category] = [];
      grouped[service.category].push(service);
    });
    categories.value = grouped;

    // Fetch bookings
    const { data: bookingsData } = await axios.get(
      "http://localhost:3001/booking/bookings"
    );
    bookings.value = bookingsData;
  } catch (err) {
    console.error(err);
    toast.error("Failed to load data");
  }
});

// --- Generate all possible time slots ---
const allTimeSlots = [];
for (let h = 10; h <= 17; h++) {
  allTimeSlots.push(`${String(h).padStart(2, "0")}:00`);
  allTimeSlots.push(`${String(h).padStart(2, "0")}:15`);
  allTimeSlots.push(`${String(h).padStart(2, "0")}:30`);
  if (h < 17) {
    allTimeSlots.push(`${String(h).padStart(2, "0")}:45`);
  }
}

// --- Get selected service duration ---
const selectedServiceDuration = computed(() => {
  if (!selectedService.value) return 0;

  for (const cat in categories.value) {
    const service = categories.value[cat].find(
      (s) => s.name === selectedService.value
    );
    if (service) return service.duration || 60; // Default to 60 mins if not specified
  }
  return 60;
});

// --- Convert time string to minutes from midnight ---
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// --- Convert minutes from midnight to time string ---
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// --- Check if a time slot conflicts with existing bookings ---
const isTimeSlotAvailable = (slotTime, serviceDuration, selectedDate) => {
  const slotStartMinutes = timeToMinutes(slotTime);
  const slotEndMinutes = slotStartMinutes + serviceDuration + BUFFER_MINUTES;

  // Check if service would finish after salon closes
  const salonCloseMinutes = SALON_CLOSE_HOUR * 60 + SALON_CLOSE_MINUTE;
  if (slotStartMinutes + serviceDuration > salonCloseMinutes) {
    return false;
  }

  // Get bookings for the selected date
  const selectedDateBookings = bookings.value.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const checkDate = new Date(selectedDate);
    return (
      bookingDate.getFullYear() === checkDate.getFullYear() &&
      bookingDate.getMonth() === checkDate.getMonth() &&
      bookingDate.getDate() === checkDate.getDate()
    );
  });

  // Check for conflicts with existing bookings
  for (const booking of selectedDateBookings) {
    const bookingDate = new Date(booking.date);
    const bookingStartMinutes =
      bookingDate.getHours() * 60 + bookingDate.getMinutes();

    // Find the booked service duration
    let bookingDuration = 60; // Default
    for (const cat in categories.value) {
      const service = categories.value[cat].find(
        (s) => s.name === booking.service
      );
      if (service && service.duration) {
        bookingDuration = service.duration;
        break;
      }
    }

    const bookingEndMinutes =
      bookingStartMinutes + bookingDuration + BUFFER_MINUTES;

    // Check for overlap
    // New booking starts before existing ends AND new booking ends after existing starts
    if (
      slotStartMinutes < bookingEndMinutes &&
      slotEndMinutes > bookingStartMinutes
    ) {
      return false;
    }
  }

  return true;
};

// --- Compute available time slots based on selected date and service ---
const availableTimeSlots = computed(() => {
  if (!form.value.date || !selectedService.value) return allTimeSlots;

  const serviceDuration = selectedServiceDuration.value;

  return allTimeSlots.filter((time) => {
    return isTimeSlotAvailable(time, serviceDuration, form.value.date);
  });
});

// --- Validate date is not Sunday or Monday ---
const isDateValid = computed(() => {
  if (!form.value.date) return true;
  const date = new Date(form.value.date + "T00:00:00");
  const day = date.getDay();
  return day !== 0 && day !== 1; // 0 = Sunday, 1 = Monday
});

// --- Reset time when date or service changes ---
watch(
  () => form.value.date,
  () => {
    form.value.time = ""; // Reset time when date changes
    if (!isDateValid.value) {
      toast.warning(
        "Sorry, we are closed on Sundays and Mondays. Please select another date."
      );
      form.value.date = "";
    }
  }
);

watch(
  () => selectedService.value,
  () => {
    form.value.time = ""; // Reset time when service changes
  }
);

// --- Handle Booking submission ---
const submitBooking = async () => {
  if (!selectedService.value) {
    toast.warning("Please select a service.");
    return;
  }
  if (!form.value.date) {
    toast.warning("Please select a date.");
    return;
  }
  if (!isDateValid.value) {
    toast.warning("Sorry, we are closed on Sundays and Mondays.");
    return;
  }
  if (!form.value.time) {
    toast.warning("Please select a time.");
    return;
  }

  try {
    // Combine date + time in local time
    const [year, month, day] = form.value.date.split("-");
    const [hours, minutes] = form.value.time.split(":");
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // JS months are 0-based
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    const res = await axios.post("http://localhost:3001/booking/bookings", {
      ...form.value,
      date,
      service: selectedService.value,
    });

    // Update bookings
    bookings.value.push(res.data.booking); // Assuming backend returns the new booking
    toast.success(res.data.message || "Booking submitted!");
    form.value = { customerName: "", date: "", time: "", location: "salon" };
    selectedCategory.value = "";
    selectedService.value = "";
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Booking failed");
  }
};
</script>

<template>
  <section class="Front">
    <div class="booking-overlay">
      <form @submit.prevent="submitBooking" class="booking-form">
        <h2>Book Your Appointment</h2>

        <!-- Category Selection -->
        <label><strong>Select Category:</strong></label>
        <select v-model="selectedCategory" class="form-input">
          <option value="">-- Choose a category --</option>
          <option v-for="(services, cat) in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <!-- Services -->
        <div
          v-for="(services, cat) in categories"
          v-show="selectedCategory === cat"
          :key="cat"
          class="category-section"
        >
          <h3>{{ cat }}</h3>
          <div class="services-grid">
            <label
              v-for="service in services"
              :key="service._id"
              class="service-option"
            >
              <input
                type="radio"
                name="service"
                :value="service.name"
                v-model="selectedService"
              />
              <div class="service-info">
                <span class="name">{{ service.name }}</span>
                <span class="price">
                  {{
                    service.price
                      ? `from £${service.price.toFixed(2)}`
                      : "on quotation"
                  }}
                </span>
                <span class="duration">
                  {{ service.duration ? `${service.duration} mins` : "" }}
                </span>
              </div>
              <span class="checkmark" v-if="selectedService === service.name"
                >✔</span
              >
            </label>
          </div>
        </div>

        <!-- Customer Name -->
        <input
          type="text"
          v-model="form.customerName"
          placeholder="Your Name"
          class="form-input"
          required
        />

        <!-- Date -->
        <label><strong>Select Date:</strong></label>
        <p class="info-text">We are closed on Sundays and Mondays</p>
        <input
          type="date"
          v-model="form.date"
          class="form-input"
          :min="new Date().toISOString().split('T')[0]"
          required
        />

        <!-- Time -->
        <label><strong>Select Time:</strong></label>
        <p v-if="selectedService && selectedServiceDuration" class="info-text">
          Selected service duration: {{ selectedServiceDuration }} minutes
        </p>
        <select
          v-model="form.time"
          class="form-input"
          required
          :disabled="!selectedService"
        >
          <option value="">
            {{
              selectedService
                ? "-- Choose a time --"
                : "-- Select a service first --"
            }}
          </option>
          <option v-for="time in availableTimeSlots" :key="time" :value="time">
            {{ time }}
          </option>
        </select>

        <button type="submit" class="submit-btn">Book Now</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.Front {
  position: relative;
  background-image: url("../../assets/images/bookings-bg.png");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: "Lato", sans-serif;
}

.booking-overlay {
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  overflow-y: auto;
  max-height: 90%;
}

.booking-form h2 {
  text-align: center;
  font-family: "Raleway", sans-serif;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #4a2a55;
}

.info-text {
  color: #823973;
  font-size: 0.9rem;
  margin: 0.3rem 0 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1rem;
  margin: 0.8rem 0 1.2rem;
  border: 1px solid #a17cbd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border 0.3s, box-shadow 0.3s;
}

.form-input:focus {
  border-color: #6c5fa3;
  box-shadow: 0 0 8px rgba(108, 95, 163, 0.3);
  outline: none;
}

.form-input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  opacity: 0.6;
}

.category-section {
  margin-bottom: 2rem;
}

.category-section h3 {
  color: #823973;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.3rem;
}

.services-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.service-option {
  position: relative;
  flex: 1 1 48%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  background: #f3e8ff;
  border: 1px solid #d1b3ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-option:hover {
  background: #e6d2ff;
  border-color: #b389ff;
  box-shadow: 0 6px 16px rgba(179, 137, 255, 0.25);
}

.service-option input {
  accent-color: #823973;
  margin-bottom: 0.5rem;
}

.checkmark {
  position: absolute;
  top: 10px;
  right: 12px;
  color: #4a2a55;
  font-weight: bold;
  font-size: 1.3rem;
}

.service-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.service-info .name {
  font-weight: 600;
  color: #3a1e4b;
  font-size: 1rem;
}

.service-info .price {
  color: #5e3b7f;
  font-weight: 500;
  font-size: 0.95rem;
}

.service-info .duration {
  color: #5e3b7f;
  font-weight: 400;
  font-size: 0.85rem;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #823973, #5e3b7f);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #5e3b7f, #823973);
  box-shadow: 0 6px 16px rgba(130, 57, 115, 0.35);
}

@media (max-width: 600px) {
  .service-option {
    flex: 1 1 100%;
  }
}
</style>
