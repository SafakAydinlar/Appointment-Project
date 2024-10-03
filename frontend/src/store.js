import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false,
    musteriId: null,
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getMusteriId: (state) => state.musteriId, 
  },
  mutations: {
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
    },
    setMusteriId(state, id) { 
      state.musteriId = id;
    },
  },
});
