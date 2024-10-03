<template>
  <div>
    <nav class="navbar">
      <div class="navbar-left">
        <h2>Şafak Kuaför</h2>
      </div>
      <div class="navbar-right">
        <button @click="logout">Çıkış Yap</button>
      </div>
    </nav>

    <div class="content">
      <table v-if="randevular.length > 0">
        <thead>
          <tr>
            <th>Randevu ID</th>
            <th>Müşteri ID</th>
            <th>Kuaför ID</th>
            <th>Randevu Zamanı</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="randevu in randevular" :key="randevu.RandevuId">
            <td>{{ randevu.RandevuId }}</td>
            <td>{{ randevu.MusteriId }}</td>
            <td>{{ randevu.KuaforId }}</td>
            <td>{{ formatDateTime(randevu.RandevuZamani) }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else>Henüz randevu bulunmamaktadır.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      randevular: [], 
    };
  },
  mounted() {
    this.fetchRandevular(); 
  },
  methods: {
    async fetchRandevular() {
      try {
        const response = await fetch('/api/adminrandevu/');
        const data = await response.json();

        if (data.success) {
          this.randevular = data.randevular; 
        } else {
          alert('Randevular getirilemedi.');
        }
      } catch (error) {
        console.error('Randevular çekilirken hata:', error);
      }
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
    logout() {
      
      sessionStorage.clear(); 
      this.$router.push('/login'); 
    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; 
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f76b1c; 
  color: white;
  position: fixed; 
  top: 0; 
  left: 0; 
  right: 0; 
  z-index: 1000; 
}

.navbar-left h2 {
  margin: 0;
}

.navbar-right {
  margin-left: auto; 
}

.navbar-right button {
  background-color: white;
  color: #f76b1c;
  border: none;
  padding: 12px 25px; 
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s; 
}

.navbar-right button:hover {
  background-color: #f9f9f9;
}

.content {
  margin-top: 60px; 
  padding: 20px; 
  flex-grow: 1; 
  background-color: #ffffff; 
  border-radius: 5px; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f76b1c;
  color: white;
}

td {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>


