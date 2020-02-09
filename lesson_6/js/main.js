const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

function debounce(callback, wait, immediate) {
  let timeout;

  return function () {
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

Vue.component('error-message', {
  data: () => ({
    error: null,
  }),
  template: `
    <div class="error">
      <span class="error__text" v-if="error">Произошла ошибка при отображении товаров. {{ error }}</span>
    </div>
  `,
  methods: {
    notify(error) {
      this.error = error;
      setTimeout(() => this.clean(), 2000);
    },
    clean() {
      this.error = null;
    }
  }
});

Vue.component('goods-search', {
  props: ['goods', 'filteredGoods'],
  computed: {
    filter() {
      return debounce((event) => {
        const regexp = new RegExp(event.target.value.trim(), 'i');
        const filteredGoods =  this.goods.filter((good) => regexp.test(good.product_name));

        this.$emit('update:filteredGoods', filteredGoods);
      }, 300);
    }
  },
  template: `
        <form class="search">
            <input type="text" @input="filter" class="search__input" placeholder="Поиск">
        </form>
    `
});

Vue.component('goods-cart', {
  data: () => {
    return {
      isVisibleCart: false
    }
  },
  methods: {
    onCartBtnClick() {
      this.isVisibleCart = !this.isVisibleCart;
    }
  },
  template: `
        <div class="cart">
          <button class="cart__button" @click="onCartBtnClick">Корзина</button>
          <div v-if="isVisibleCart" class="cart__container">
            <svg @click="onCartBtnClick" class="cart__close" width="25" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 475.2 475.2" xml:space="preserve">
              <path
                d="M405.6,69.6C360.7,24.7,301.1,0,237.6,0s-123.1,24.7-168,69.6S0,174.1,0,237.6s24.7,123.1,69.6,168s104.5,69.6,168,69.6 s123.1-24.7,168-69.6s69.6-104.5,69.6-168S450.5,114.5,405.6,69.6z M386.5,386.5c-39.8,39.8-92.7,61.7-148.9,61.7 s-109.1-21.9-148.9-61.7c-82.1-82.1-82.1-215.7,0-297.8C128.5,48.9,181.4,27,237.6,27s109.1,21.9,148.9,61.7 C468.6,170.8,468.6,304.4,386.5,386.5z" />
              <path
                d="M342.3,132.9c-5.3-5.3-13.8-5.3-19.1,0l-85.6,85.6L152,132.9c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1 l85.6,85.6l-85.6,85.6c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.6-85.6l85.6,85.6c2.6,2.6,6.1,4,9.5,4 c3.5,0,6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1l-85.4-85.6l85.6-85.6C347.6,146.7,347.6,138.2,342.3,132.9z" />
            </svg>
            <table class="cart__items-wrapper cart__items-wrapper_hidden">
              <thead>
                <th class="cart__items-title">Название</th>
                <th class="cart__items-title">Цена</th>
                <th class="cart__items-title">Количество</th>
                <th class="cart__items-title"></th>
              </thead>
              <tbody class="cart__items"></tbody>
            </table>
            <button class="cart__clean">Очистить</button>
          </div>
        </div>
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
    <div class="goods__list" v-if="checkFilteredGoods" v-on:inputValue>
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
  },
  methods: {
    makeGETRequest(url) {
      return new Promise((resolve, reject) => {
        let xhr;

        if (window.XMLHttpRequest) {
          xhr = new window.XMLHttpRequest();
        } else xhr = new window.ActiveXObject('Microsoft.XMLHTTP');

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const body = JSON.parse(xhr.responseText);

              resolve(body);
            } else reject(new Error('Network Error'));
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
        this.$refs.error.notify(error);
        console.error(error);
      }
    },
  },
  mounted() {
    this.$nextTick(() => this.fetchGoods());
  }
});