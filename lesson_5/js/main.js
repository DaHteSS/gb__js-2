const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
    searchLine: '',
    isVisibleCart: false
  },
  methods: {
    makeGETRequest(url) {
      return new Promise((resolve, reject) => {
        let xhr;

        if (window.XMLHttpRequest) {
          xhr = new window.XMLHttpRequest();
        } else {
          xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const body = JSON.parse(xhr.responseText);
              resolve(body);
            } else {
              reject(new Error("Network Error"));
            }
          }
        }
        xhr.onerror = (err) => reject(err);

        xhr.open('GET', url);
        xhr.send();
      });
    },
    async fetchGoods() {
      try {
        this.goods = await this.makeGETRequest(`${API_URL}/catalogData.json`);
        this.filteredGoods = [...this.goods];
      } catch (error) {
        console.error(error);
      }
    },
    onCartBtnClick() {
      this.isVisibleCart = !this.isVisibleCart;
    }
  },
  computed: {
    filterGoods() {
      const regexp = new RegExp(this.searchLine, 'i');

      return this.filteredGoods.filter((good) => regexp.test(good.product_name));
    },
    checkFilteredGoods() {
      return this.filterGoods.length !== 0;
    }
  },
  mounted() {
    this.fetchGoods();
  }
});