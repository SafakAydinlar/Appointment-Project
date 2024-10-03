<template>
  <div>
    <NavigationBar />
    <div class="home-content">
      <h1>Şafak Kuaföre Hoşgeldiniz, {{ userName }}</h1>
      <button @click="goToRandevuPage" class="appointment-button">
        Randevu Almak İçin Tıklayınız
      </button>
    </div>
  </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue';

export default {
  components: {
    NavigationBar
  },
  data() {
    return {
      userName: ''
    };
  },
  created() {
    this.userName = sessionStorage.getItem('adi') + ' ' + sessionStorage.getItem('soyadi');
  },
  methods: {
    goToRandevuPage() {
      this.$router.push({ name: 'RandevuPage' });
    }
  }
}
</script>

<style scoped>

.home-content {
  margin-top: 80px; 
  padding: 20px;
  text-align: center;
}

.home-content h1 {
  color: #333;
}

.home-content p {
  color: #666;
  font-size: 18px;
}

.appointment-button {
  background-color: #f76b1c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.appointment-button:hover {
  background-color: #45a049;
}
</style>
