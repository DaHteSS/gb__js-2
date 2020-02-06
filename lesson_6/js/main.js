const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

function debounce(callback, wait, immediate) {
  let timeout;

  return function() {
      const context = this;
      const args = arguments;
      const later = () => {
          timeout = null;
          if (!immediate) callback.apply(context, args);
      };
      const callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) callback.apply(context, args)
  }
}

Vue.component('goods-search', {
    props: ['goods'],
    computed: {
        filterGoods() {
            return debounce((event) => {
                const regexp = new RegExp(event.target.value.trim(), 'i');

                return this.goods.filter((good) => regexp.test(good.product_name));
            }, 300);
        }
    },
    template: `
        <form class="search">
            <input type="text" @input="filterGoods" class="search__input" placeholder="Поиск">
        </form>
    `
  });

Vue.component('goods-item', {
  props: ['good'],
  template: `
      <div class="goods__item">
        <img src="https://via.placeholder.com/250" alt="Картинка товара" width="250" height="250">
        <h3 class="goods__title">{{ good.product_name }}</h3>
        <p class="goods__price">{{ good.price }}$</p>
        <button class="goods__btn">Добавить</button>
      </div>
  `
});

Vue.component('goods-list', {
  props: ['goods'],
  computed: {
    checkFilteredGoods() {
      return this.goods.length !== 0;
    }
  },
  template: `
    <div class="goods__list" v-if="checkFilteredGoods">
      <goods-item v-for="good in goods" :key="good.id_product" :good="good"></goods-item>
    </div>
    <div class="goods__none" v-else>Нет данных</div>
  `
});

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
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
  mounted() {
    this.fetchGoods();
  }
});