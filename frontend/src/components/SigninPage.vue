<template>
  <div class="auth-page">
    <div class="auth-form">
      <h2>Kayıt Ol</h2>
      <form @submit.prevent="registerUser">
        <div>
          <label for="firstname">Ad</label>
          <input v-model="firstname" type="text" id="firstname" required />
        </div>
        <div>
          <label for="lastname">Soyad</label>
          <input v-model="lastname" type="text" id="lastname" required />
        </div>
        <div>
          <label for="username">Kullanıcı Adı</label>
          <input v-model="username" type="text" id="username" required />
        </div>
        <div>
          <label for="password">Şifre</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit" class="submit-btn">Kayıt Ol</button>
      </form>
      <p>
        Zaten kayıtlı mısınız? 
        <button @click="goToLogin" class="login-btn">Giriş Yapın</button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstname: '',
      lastname: '',
      username: '',
      password: ''
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstname: this.firstname, lastname: this.lastname, username: this.username, password: this.password })
        });
        const data = await response.json();
        if (data.success) {
          alert('Kayıt başarılı!');
          this.$router.push('/login');
        } else {
          alert('Kayıt başarısız.');
        }
      } catch (error) {
        console.error('Register error:', error);
      }
    },
    goToLogin() {
      this.$router.push('/login');
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
  min-height: 80vh; 
  font-family: Arial, sans-serif;
  background: #fff; 
}

.auth-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px; 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  margin-top: 10px; 
}

.auth-form h2 {
  margin-bottom: 15px; 
  color: #333;
  font-size: 22px; 
}

.auth-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.auth-form input {
  width: 100%;
  padding: 10px; 
  margin-bottom: 10px; 
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.auth-form input:focus {
  border-color: #f76b1c;
}

.submit-btn, .login-btn {
  width: 100%;
  padding: 10px; 
  border: none;
  border-radius: 8px;
  background-color: #f76b1c;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover, .login-btn:hover {
  background-color:  #45a049;
  transform: translateY(-2px);
}

.submit-btn:active, .login-btn:active {
  transform: translateY(1px);
}

.auth-form p {
  margin-top: 15px; 
}

.login-btn {
  background-color: transparent;
  color: #f76b1c;
  border: 2px solid #f76b1c;
}

.login-btn:hover {
  background-color:  #45a049;
  color: #fff;
}

.login-btn:active {
  transform: translateY(1px);
}
</style>



