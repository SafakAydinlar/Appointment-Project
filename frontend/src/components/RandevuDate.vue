<template>
  <div class="randevu-date">
    <NavigationBar />
    <div class="barber-info" v-if="barber">
      <img :src="barber.photo" alt="Kuaför Fotoğrafı" class="barber-photo" />
      <h2>{{ barber.name }}</h2>
    </div>
    <div class="appointment-container">
      <div class="calendar-container">
        <div class="calendar-header">
          <button @click="prevMonth">Önceki Ay</button>
          <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
          <button @click="nextMonth">Sonraki Ay</button>
        </div>
        <div class="calendar-grid">
          <div
            class="calendar-day"
            v-for="(day, index) in calendarDays"
            :key="index"
            @click="selectDate(day)"
            :class="{ selected: isSelected(day), 'past-day': day.isPast }"
          >
            {{ day.date }}
          </div>
        </div>
      </div>
      <div class="time-selector" v-if="selectedDate">
        <h3>Saat Seçiniz</h3>
        <div
          v-for="hour in hours"
          :key="hour"
          @click="isHourBooked(hour) ? null : selectHour(hour)"
          :class="{ selected: selectedHour === hour, 'booked': isHourBooked(hour) }"
        >
          {{ hour }}:00
        </div>
      </div>
    </div>
    
    <div class="appointment-bar" v-if="appointmentDateTime">
      <span>Randevu Tarihiniz:</span>
      <span>{{ formattedAppointmentDateTime }}</span>
    </div>
    <button :disabled="!appointmentDateTime" class="book-btn" @click="bookAppointment">
      Randevu Al
    </button>
  </div>
</template>


<script>
import NavigationBar from './NavigationBar.vue';

export default {
  components: {
    NavigationBar
  },
  props: {
    kuaforId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      selectedDate: null,
      selectedHour: null,
      hours: Array.from({ length: 9 }, (_, i) => i + 9),
      monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      appointmentDateTime: '',
      formattedAppointmentDateTime: '',
      barber: null,
      bookedSlots: []
    };
  },
  computed: {
  calendarDays() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const startDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const days = [];
    const today = new Date();

    for (let i = 0; i < startDay; i++) {
      days.push({ date: '', isPast: false });  // Boş günler
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(this.currentYear, this.currentMonth, i);
      const isPast = currentDate < today.setHours(0, 0, 0, 0); // Geçmiş günleri belirler
      days.push({ date: i, isPast: isPast });
    }

    return days;
  }
},
  methods: {
    async fetchBookedSlots() {
      if (!this.selectedDate) return;

      const localDate = new Date(this.selectedDate);
      const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));

      const response = await fetch(`/api/bookedSlots?KuaforId=${this.kuaforId}&date=${utcDate.toISOString()}`);

      const data = await response.json();
      if (data.success) {
        this.bookedSlots = data.bookedSlots.map(slot => ({
          hours: slot.hours,
          minutes: slot.minutes
        }));
      } else {
        console.error(data.message);
      }
    },

    selectDate(day) {
    if (day.date && !day.isPast) { // Geçmiş tarihler seçilemez
      const selectedDate = new Date(this.currentYear, this.currentMonth, day.date);
      this.selectedDate = selectedDate;
      this.updateAppointmentDateTime();
      this.selectedHour = null;
      this.fetchBookedSlots();
    } else if (day.isPast) {
      alert('Geçmiş tarihlerden randevu alamazsınız. Lütfen geçerli bir tarih seçin.');
    }
  },
    selectHour(hour) {
  const today = new Date();
  const selectedDateTime = new Date(this.selectedDate);
  selectedDateTime.setHours(hour);

  if (selectedDateTime.toDateString() === today.toDateString() && selectedDateTime < today) {
    alert('Bugünün geçmiş saatlerinden randevu alamazsınız. Lütfen geçerli bir saat seçin.');
    return;
  }

  this.selectedHour = hour;
  this.updateAppointmentDateTime();
},
    formatDateTime(dateTime) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      };
      return new Date(dateTime).toLocaleString('tr-TR', options);
    },
    updateAppointmentDateTime() {
      if (this.selectedDate && this.selectedHour !== null) {
        const localDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), this.selectedHour);
        this.appointmentDateTime = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), localDate.getHours())).toISOString();
        this.formattedAppointmentDateTime = this.formatDateTime(this.appointmentDateTime);
      } else {
        this.appointmentDateTime = '';
        this.formattedAppointmentDateTime = '';
      }
    },
    isHourBooked(hour) {
      if (!this.selectedDate) return false;

      const appointmentDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), hour);

      return this.bookedSlots.some(slot => {
        return slot.hours === appointmentDate.getHours() && slot.minutes === appointmentDate.getMinutes();
      });
    },
    bookAppointment() {
      const musteriId = sessionStorage.getItem('musteriId');

      if (this.barber && this.selectedDate && this.selectedHour && musteriId) {
        const appointmentDetails = {
          MusteriId: musteriId,
          KuaforId: this.kuaforId,
          RandevuZamani: this.appointmentDateTime
        };

        fetch('/api/bookAppointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentDetails)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Randevu başarıyla alındı!');
            this.fetchBookedSlots();
          } else {
            alert('Randevu alma işlemi başarısız oldu.');
          }
        })
        .catch(error => {
          console.error('Randevu alma hatası:', error);
        });
      } else {
        alert('Lütfen tüm bilgileri doldurduğunuzdan emin olun.');
      }
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    isSelected(day) {
      return this.selectedDate && this.selectedDate.getDate() === day.date;
    },
    loadBarberInfo() {
      const barbers = {
        1: { name: 'Mehmet Kuaför', photo: 'https://st.depositphotos.com/1743476/4625/i/950/depositphotos_46252055-stock-photo-portrait-of-happy-laughing-man.jpg' },
        2: { name: 'Hasan Kuaför', photo: 'https://www.shutterstock.com/image-photo/headshot-smiling-handsome-man-trendy-260nw-1491969905.jpg' },
        3: { name: 'Can Kuaför', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBIcNaXHdGGW-1yOF2_O83ptWCRVWqXiEltQ&s' },
        4: { name: 'Buğra Kuaför', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwL2sRZFiJRy7-pvHxfOS3U7VFdh-VCcYFIg&s'}
      };
      this.barber = barbers[this.kuaforId] || null;
    }
  },
  mounted() {
    this.loadBarberInfo();
  }
};
</script>


<style scoped>

.randevu-date {
  font-family: Arial, sans-serif;
  padding: 20px;
  display: flex; 
  flex-direction: column; 
  align-items: center; 
}


.barber-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
}

.barber-photo {
  width: 80px; 
  height: 80px; 
  border-radius: 50%;
  margin-right: 10px; 
}

.barber-info h2 {
  font-size: 1.5em; 
}


.appointment-container {
  display: flex; 
  justify-content: space-between; 
  width: 100%; 
}


.calendar-container {
  flex: 1; 
  border: 2px solid  #f76b1c;
  padding: 10px; 
}


.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); 
  gap: 5px; 
}


.calendar-day {
  cursor: pointer;
  padding: 10px; 
  border: 1px solid #eee;
  text-align: center;
  border-radius: 5px; 
  transition: background-color 0.3s; 
}

.calendar-day.selected {
  background-color: #4caf50; 
  color: white;
}


.time-selector {
  flex: 1; 
  border: 2px solid  #f76b1c; 
  padding: 10px; 
  margin-left: 10px; 
}

.calendar-day.past-day {
  background-color: #f44336; /* Kırmızı renk */
  color: white;
  cursor: not-allowed;
  opacity: 0.6; /* Opaklığı düşürerek belirginleştir */
}

.calendar-day.past-day:hover {
  background-color: #f44336; /* Geçmiş günlerde hover etkisini kaldır */
}
.time-selector div {
  cursor: pointer;
  padding: 5px; 
  border: 1px solid #eee;
  margin: 3px; 
  text-align: center;
  border-radius: 5px; 
  transition: background-color 0.3s; 
}

.time-selector div.selected {
  background-color: #4caf50;
  color: white;
}

.time-selector div.booked {
  background-color: #f44336; 
  color: white;
}


.appointment-bar {
  margin-top: 20px;
  text-align: center; 
  font-size: 1.2em; 
  border: 2px solid #f76b1c; 
  padding: 10px; 
  border-radius: 5px; 
}


.book-btn {
  padding: 10px 20px;
  color: white;
  background-color: #f76b1c; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; 
  margin-top: 20px; 
}

.book-btn:hover {
  background-color: #4caf50;
}

.book-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Butonlar ve ay-yıl ismi arasına boşluk ekler */
  margin-bottom: 10px;
}

.calendar-header button {
  padding: 5px 10px;
  background-color: #f76b1c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.calendar-header button:hover {
  background-color: #4caf50;
}

</style>




