<template>
  <div>
    <NavigationBar />
    <div class="barber-selection">
      <h1>Kuaför Seçimi</h1>
      <div class="barber-list">
        <div class="barber" v-for="kuafor in kuaforler" :key="kuafor.KuaforId">
          <img :src="kuafor.KuaforUrl" :alt="kuafor.KuaforAdi" class="barber-photo" />
          <h2>{{ kuafor.KuaforAdi }}</h2>
          <button @click="selectKuafor(kuafor)" class="select-btn">Seç</button>
        </div>
      </div>

      <div v-if="selectedKuafor" class="randevu-container">
        <button @click="selectBarber(selectedKuafor.KuaforId)" class="randevu-btn">
          {{ selectedKuafor.KuaforAdi }}'den Randevu Al
        </button>
      </div>
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
      kuaforler: [],
      selectedKuafor: null
    };
  },
  computed: {
    musteriId() {
      return this.$store.getters.getMusteriId; 
    }
  },
  methods: {
    async fetchKuaforler() {
      try {
        const response = await fetch('/api/kuaforler');
        const data = await response.json();
        this.kuaforler = data;
      } catch (error) {
        console.error('Kuaförler alınamadı:', error);
      }
    },
    selectKuafor(kuafor) {
      this.selectedKuafor = kuafor;
    },
    selectBarber(barberId) {
      console.log('Seçilen kuaför ID:', barberId);
      console.log('Müşteri ID:', this.musteriId); 
      this.$router.push({
        name: 'RandevuDate',
        params: {
          kuaforId: barberId,
          musteriId: this.musteriId 
        }
      });
    }
  },
  created() {
    this.fetchKuaforler();
  }
};
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f3f4f6; 
  color: #333; 
}


.barber-selection {
  margin-top: 10px; 
  text-align: center;
  padding: 20px; 
}

.barber-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 15px;
  margin-bottom: 20px; 
  overflow-x: auto; 
}

.barber {
  background-color: #ffffff; 
  border: 2px solid #f76b1c; 
  border-radius: 10px;
  padding: 15px; 
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); 
  width: 180px; 
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.barber-photo {
  width: 100%;
  height: 120px; 
  object-fit: cover; 
  border-radius: 8px; 
  margin-bottom: 8px; 
}

h2 {
  font-size: 1.2rem; 
  margin: 5px 0; 
}

.select-btn {
  background-color: #f76b1c;
  color: white; 
  padding: 8px 12px; 
  border: none;
  border-radius: 5px; 
  cursor: pointer;
  font-size: 0.9rem; 
  transition: background-color 0.3s; 
}

.select-btn:hover {
  background-color: #45a049; 
}

.randevu-container {
  margin-top: 20px; 
}

.randevu-btn {
  background-color: #f76b1c;
  color: white; 
  padding: 10px 20px; 
  border: none;
  border-radius: 5px; 
  cursor: pointer;
  font-size: 1.1rem; 
  transition: background-color 0.3s; 
}

.randevu-btn:hover {
  background-color: #45a049; 
}
</style>