const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const makeGETRequest = (url) => {
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
}

class GoodsItem {
  constructor(id, title = 'Some Stuff', price = 0) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.img = 'https://via.placeholder.com/250';
  }
  render() {
    return
    `<div class="goods__item" data-id="${this.id}">
      <img src="${this.img}" alt="Картинка товара" width="250" height="250">
      <h3 class="goods__title">${this.title}</h3>
      <p class="goods__price">${this.price}$</p>
      <button class="js-add-to-cart goods__btn">Добавить</button>
    </div>`;
  }
}

class GoodsList {
  constructor($container) {
    this.$container = document.querySelector($container);
    this.goods = [];
    this.cartGoods = [];
  }

  fetchGoods() {
    return fetch(`${API_URL}/catalogData.json`)
      .then(response => response.json())
      .then(goods => this.goods = goods)
      .catch(error => error);
  }

  totalPrice() {
    // Подсчёт суммы всех товаров
    let sum = 0;

    this.goods.map(good => {
      sum += good.price;

      return true;
    });
    console.log(`${sum}$`);
  }

  initListners() {
    const $btns = [...this.$container.querySelectorAll(".js-add-to-cart")];

    $btns.map($btn => {
      $btn.addEventListener('click', event => {
        const goodId = event.target.parentElement.getAttribute("data-id");

        this.addToCart(parseInt(goodId, 10));
      });
    });
  }

  findGood(id) {
    return this.goods.find(good => good.id_product === id);
  }

  addToCart(goodId) {
    const good = this.findGood(goodId);

    this.cartGoods.push(good);

    return super.cartGoods;
  }

  removeFromCart(goodId) {
    const good = this.findGood(goodId);

    this.cartGoods.splice(good, 1);

    return super.cartGoods;
  }

  cleanCart() {
    this.cartGoods = [];
  }

  updateCartItem(goodId, good) {
    const good = this.findGood(goodId);

    this.cartGoods[good] = good;

    return this.cartGoods;
  }

  render() {
    let $listHtml = '';

    this.goods.map(good => {
      const goodItem = new GoodsItem(good.id_product, good.product_name, good.price, good.img);

      $listHtml += goodItem.render();

      return true;
    });
    this.$container.innerHTML = $listHtml;
    this.initListners();
    this.totalPrice();
  }
}

class GoodsPage extends GoodsList {
  constructor(props) {
    super(props);
  }

  initListners() {
    super.initListners();
  }

  fetchGoods() {
    super.fetchGoods();
  }

  addToCart(goodId) {
    super.addToCart(goodId);
  }

  removeFromCart(goodId) {
    super.removeFromCart(goodId);
  }

  cleanCart() {
    super.cleanCart(goodId);
  }

  updateCartItem(goodId, good) {
    super.updateCartItem(goodId);
  }

  render() {
    super.render();
  }
}

// Класс для корзины
class Cart extends GoodsList {
  constructor($container) {
    this.$container = $container;
    super($container);
  }

  initListners() {
    const $closeBtn = document.querySelector(".cart__close");
    const $cartCleanBtn = document.querySelector(".cart__clean");
    const $cartBtn = document.querySelector(".cart__button");

    $cartBtn.addEventListener('click', () => this.showCart(this.$container));
    $closeBtn.addEventListener('click', () => this.hideCart(this.$container));
    $cartCleanBtn.addEventListener('click', () => this.cleanCart());

    super.initListners();
  }

  showCart(container) {
    console.log(this.cartGoods);
    container.classList.remove('cart__container_hidden');
  }

  hideCart(container) {
    container.classList.add('cart__container_hidden');
  }

  updateCartItem(goodId, goods) {
    const good = super.findGood(goodId);

    super.cartGoods[good] = goods;

    return super.cartGoods;
  }
}

class CartItem extends GoodsItem {
  constructor(...props) {
    super(...props);
    this.count = 0;
  }
  incCount() {

  }
  decCount() {

  }
  render() {
    return
    `<tr class="cart__item" data-id=${this.id}>
        <td>
          <h3 class="cart__item-title">${this.title}</h3>
        </td>
        <td>
          <p class="cart__item-price">${this.price}$</p>
        </td>
        <td class="cart__cell">
          <button class="cart__dec">-</button>
          <input class="cart__input" type="text" data-price="${this.price}" value="1">
          <button class="cart__inc">+</button>
        </td>
        <td>
          <button class="cart__item-remove" data-remove="${this.id}">Удалить</button>
        </td>
      </tr>`;
  }
}

const list = new GoodsPage(".goods__list");
const cart = new Cart(".cart__container");

cart.initListners();
list.fetchGoods().then(() => list.render());
