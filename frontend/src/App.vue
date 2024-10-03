<template>
  <div class="container">
    <header>
      <h1 class="kuafor-header">ŞAFAK KUAFÖR</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.state.isAuthenticated);

    return { isAuthenticated };
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
}

header {
  text-align: center;
  margin-top: 0; 
  margin-bottom: 20px;
}

.kuafor-header {
  font-size: 2.5rem; 
  color: #ff6347; 
  margin-top: 0;
}

main {
  width: 100%;
  max-width: 800px;
  padding: 20px;
}
</style>
