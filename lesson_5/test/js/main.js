const app = new Vue({
  el: '#app',
  data: {
    currentName: 'Dahtess',
    names: ['Dahtess', 'Ksed']
  },
  methods: {
    clickHandler(name) {
      console.log(name);
    }
  },
  computed: {
    hasName() {
      return this.currentName.length !== 0;
    },
    upperCaseName() {
      return this.currentName.toUpperCase();
    }
  }
});