<template>
  <nav class="navbar">
    <div class="nav-left">
      <span class="brand-name">Şafak Kuaför</span>
    </div>
    <ul class="nav-right">
      <li><a href="#" @click="goToHome">ANASAYFA</a></li>
      <li><a href="#" @click="goToRandevuPage">Yeni Randevu Al</a></li>
      <li><a href="#" @click="goToRandevuEdit">Randevularım</a></li>
      <li><a href="#" @click="logout">Çıkış Yap</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  methods: {
    goToRandevuPage() {
      this.$router.push('/randevu');
    },
    goToHome() {
      this.$router.push('/home');
    },
    goToRandevuEdit() {
      this.$router.push('/randevularim');
    },
    logout() {
      sessionStorage.removeItem('musteriId');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px; 
  background-color: #f76b1c; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-left {
  display: flex;
  align-items: center; 
}

.brand-name {
  font-weight: bold;
  font-size: 30px; 
  color: white; 
  margin-right: 20px; 
}

.navbar ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.navbar li {
  margin: 0 10px; 
}

.navbar a {
  background-color: transparent; 
  color: white; 
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 20px; 
  border: 2px solid white; 
  border-radius: 5px; 
  transition: background-color 0.3s, color 0.3s; 
}

.navbar a:hover {
  background-color: white; 
  color: #f76b1c; 
}

.nav-right {
  display: flex;
  gap: 20px;
  margin-right: 5px; 
}
</style>