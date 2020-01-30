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
    return `
      <div class="goods__item" data-id="${this.id}">
        <img src="${this.img}" alt="Картинка товара" width="250" height="250">
        <h3 class="goods__title">${this.title}</h3>
        <p class="goods__price">${this.price}$</p>
        <button class="js-add-to-cart goods__btn">Добавить</button>
      </div>
    `;
  }
}

class GoodsList {
  constructor($container, $cart) {
    this.$container = document.querySelector($container);
    this.$cartContainer = document.querySelector($cart);

    this.goods = [];
    this.cartGoods = [];
  }

  async fetchGoods() {
    try {
      const response = await fetch(`${API_URL}/catalogData.json`);
      this.goods = await response.json();
    }
    catch (error) {
      return error;
    }
  }

  updateCart() {
    const $cartItems = document.querySelector(".cart__items");
    const $cartWrapper = document.querySelector(".cart__items-wrapper");
    let $cartGoods = '';

    this.cartGoods.map(good => $cartGoods += new CartItem(good.id_product, good.product_name, good.price).render());
    this.$cartContainer.innerHTML = $cartGoods;

    if($cartItems.children.length === 0) {
      $cartWrapper.classList.add("cart__items-wrapper_hidden");
    } else {
      $cartWrapper.classList.remove("cart__items-wrapper_hidden");
    }
  }

  totalPrice() {
    // Подсчёт суммы всех товаров
    let sum = 0;

    this.goods.map(good => sum += good.price);
    console.log(`${sum}$`);
  }

  initListners() {
    const $btns = [...this.$container.querySelectorAll(".js-add-to-cart") || []];
    const $cartCleanBtn = document.querySelector(".cart__clean");

    $btns.map($btn => {
      $btn.addEventListener('click', e => {
        const goodId = e.target.parentElement.getAttribute("data-id");

        this.addToCart(parseInt(goodId, 10));
      });
    });
    $cartCleanBtn.addEventListener('click', () => this.cleanCart());
  }

  initDeleteListner () {
    const $deleteItemBtn = [...document.querySelectorAll(".cart__item-remove") || []];
    $deleteItemBtn.map($btn => {
      $btn.addEventListener('click', e => {
        const goodId = e.target.getAttribute("data-remove");
        this.removeFromCart(parseInt(goodId, 10));

        if(this.cartGoods.length !== 0) {
          this.initDeleteListner();
        }
      })
    })
  }

  findGood(id) {
    return this.goods.find(good => good.id_product === id);
  }

  addToCart(goodId) {
    const good = this.findGood(goodId);

    if(this.cartGoods.indexOf(good) != -1) {
        return;
    } else {
        this.cartGoods.push(good);
        this.updateCart();
        this.initDeleteListner();
    }
  }

  removeFromCart(goodId) {
    const good = this.findGood(goodId);

    this.cartGoods.splice(good, 1);
    this.updateCart();
  }

  cleanCart() {
    this.cartGoods = [];
    this.updateCart();
  }

  render() {
    let $listHtml = '';

    this.goods.map(({ id_product, product_name, price, img }) => {
      const goodItem = new GoodsItem(id_product, product_name, price, img);

      $listHtml += goodItem.render();
    });

    this.$container.innerHTML = $listHtml;
    this.initListners();
    this.totalPrice();
  }
}

// Класс для корзины
class Cart extends GoodsList {
  constructor($container, update) {
    super($container, update);
  }

  initListners() {
    const $closeBtn = document.querySelector(".cart__close");
    const $cartBtn = document.querySelector(".cart__button");

    $cartBtn.addEventListener('click', () => this.showCart(this.$container));
    $closeBtn.addEventListener('click', () => this.hideCart(this.$container));
  }

  showCart() {
    this.$container.classList.remove('cart__container_hidden');
  }

  hideCart() {
    this.$container.classList.add('cart__container_hidden');
  }
}

class CartItem extends GoodsItem {
  constructor(...props) {
    super(...props);
    this.count = 0;
  }
  incCount() {}
  decCount() {}
  render() {
    return `
      <tr class="cart__item" data-id=${this.id}>
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

const cart = new Cart(".cart__container", ".cart__items");
const list = new GoodsList(".goods__list", ".cart__items");

cart.initListners();
list.fetchGoods().then(() => list.render());
