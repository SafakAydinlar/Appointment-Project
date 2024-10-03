<template>
  <div>
    <NavigationBar /> 
    <div class="randevu-edit">
      <h2>Randevularım</h2>
      <ul v-if="randevular.length">
        <li v-for="randevu in randevular" :key="randevu.RandevuId">
          Kuaför: {{ getKuaforAdi(randevu.KuaforId) }} - Tarih: {{ formatDateTime(randevu.RandevuZamani) }}
          <button @click="randevuSil(randevu.RandevuId)" class="delete-btn">RANDEVU SİL</button>
        </li>
      </ul>
      <p v-else>Henüz bir randevunuz yok.</p>
    </div>
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue'; 

export default {
  components: {
    NavigationBar, 
  },
  data() {
    return {
      randevular: [], 
      kuaforler: [],  
      musteriId: null 
    };
  },
  async created() {
    
    const storedMusteriId = sessionStorage.getItem('musteriId');
    if (storedMusteriId) {
      this.musteriId = storedMusteriId;
    } else {
      console.error('Müşteri ID bulunamadı');
      return;
    }

    try {
     
      const randevuResponse = await fetch(`/api/randevular?musteriId=${this.musteriId}`);
      if (randevuResponse.ok) {
        this.randevular = await randevuResponse.json();
        console.log('Randevular:', this.randevular); 
      } else {
        console.error('Randevular alınamadı');
      }

      const kuaforResponse = await fetch('/api/kuaforler');
      if (kuaforResponse.ok) {
        this.kuaforler = await kuaforResponse.json();
        console.log('Kuaförler:', this.kuaforler); 
      } else {
        console.error('Kuaförler alınamadı');
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  },
  methods: {
    
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
    
    getKuaforAdi(kuaforId) {
      const kuafor = this.kuaforler.find(k => k.KuaforId === kuaforId);
      return kuafor ? kuafor.KuaforAdi : 'Bilinmiyor';
    },
    
    async randevuSil(randevuId) {
      if (confirm('Bu randevuyu silmek istediğinize emin misiniz?')) {
        try {
          const response = await fetch(`/api/randevusil/${randevuId}`, { // Endpoint düzeltildi
            method: 'DELETE'
          });
          if (response.ok) {
            
            this.randevular = this.randevular.filter(randevu => randevu.RandevuId !== randevuId);
            alert('Randevu başarıyla silindi.');
          } else if (response.status === 404) {
            alert('Randevu bulunamadı.');
          } else {
            alert('Randevu silinirken bir hata oluştu.');
          }
        } catch (error) {
          console.error('Randevu silme hatası:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.randevu-edit {
  margin-top: 80px; 
}

.randevu-edit h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.randevu-edit ul {
  list-style: none;
  padding: 0;
}

.randevu-edit li {
  background: #f4f4f4;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.randevu-edit li .delete-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.randevu-edit li .delete-btn:hover {
  background-color: #ff1a1a;
}

.randevu-edit p {
  font-size: 18px;
  color: gray;
}
</style>
