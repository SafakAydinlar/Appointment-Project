<template>
  <div class="auth-page">
    <div class="auth-form">
      <h2>Giriş Yap</h2>
      <form @submit.prevent="loginUser">
        <div>
          <label for="login-username">Kullanıcı Adı</label>
          <input v-model="loginUsername" type="text" id="login-username" required />
        </div>
        <div>
          <label for="login-password">Şifre</label>
          <input v-model="loginPassword" type="password" id="login-password" required />
        </div>
        <button type="submit" class="submit-btn">Giriş Yap</button>
      </form>
      <p>
        Üye değil misiniz? 
        <button @click="goToSignin" class="signup-btn">Kayıt Ol</button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginUsername: '',
      loginPassword: ''
    };
  },
  methods: {
    async loginUser() {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.loginUsername, password: this.loginPassword })
    });
    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('username', this.loginUsername); 
      sessionStorage.setItem('password', this.loginPassword); 

      
      if (data.musteriId) {
        sessionStorage.setItem('musteriId', data.musteriId);
        sessionStorage.setItem('adi', data.adi); 
        sessionStorage.setItem('soyadi', data.soyadi); 
      }

      
      if (this.loginUsername === "1.admin" && this.loginPassword === "admin123") {
        this.$router.push('/admin-panel'); 
      } else {
        this.$router.push('/home'); 
      }
    } else {
      alert('Giriş başarısız.');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

,
    goToSignin() {
      this.$router.push('/signup');
    }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background: #fff;
}

.auth-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  margin-top: 40px;
}

.auth-form h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

.auth-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.auth-form input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.auth-form input:focus {
  border-color: #f76b1c;
}

.submit-btn, .signup-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #f76b1c;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover, .signup-btn:hover {
  background-color:  #45a049;
  transform: translateY(-2px);
}

.submit-btn:active, .signup-btn:active {
  transform: translateY(1px);
}

.auth-form p {
  margin-top: 20px;
}

.signup-btn {
  background-color: transparent;
  color: #f76b1c;
  border: 2px solid #f76b1c;
}

.signup-btn:hover {
  background-color:  #45a049;
  color: #fff;
}

.signup-btn:active {
  transform: translateY(1px);
}
</style>
