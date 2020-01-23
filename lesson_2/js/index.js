class GoodsItem {
    constructor(id, title = "Some Stuff", price = 0, img = '') {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }
    render() {
        return `<div class="goods__item" data-id="${this.id}">
                    <img src="${this.img}" alt="Картинка товара">
                    <h3 class="goods__title">${this.title}</h3>
                    <p class="goods__price">${this.price}$</p>
                    <button class="js-add-to-cart goods__btn">Добавить</button>
                </div>`;
    }
}

class GoodsList {
    constructor(container) {
        this.container = document.querySelector(container);
        this.goods = [];
    }
    fetchGoods() {
        this.goods = [
            {id: 1, title: 'Shirt', price: 150, img: 'https://via.placeholder.com/250' },
            {id: 2, title: 'Socks', price: 50, img: 'https://via.placeholder.com/250' },
            {id: 3, title: 'Jacket', price: 350, img: 'https://via.placeholder.com/250' },
            {id: 4, title: 'Shoes', price: 250, img: 'https://via.placeholder.com/250' },
        ]
    }
    // Подсчёт суммы всех товаров
    totalPrice() {
        let sum = 0;

        this.goods.map(good => {
            sum += good.price;
        });
        console.log(`${sum}$`);
    }
    initListners() {
        const btns = [...this.container.querySelectorAll(".js-add-to-cart")];
        btns.map(btn => {
            btn.addEventListener("click", e => {
                const goodId = e.target.parentElement.getAttribute('data-id');
                this.addToCart(parseInt(goodId, 10));
            });
        })
    }
    addToCart(goodId) {
        const good = this.findGood(goodId);
        console.log(good);
    }
    findGood(id) {
        return this.goods.find(good => good.id === id);
    }
    render() {
        let listHtml = '';

        this.goods.map(good => {
            const goodItem = new GoodsItem(good.id, good.title, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListners();
        this.totalPrice();
    }
}
// Класс для корзины
class Cart extends GoodsList {
    constructor(props) {
        super(props);
    }
    removeItem() {
        // Удаление товара
    }
    addEvents() {
        // метод для добавления на кнопки +-, при изменении инпута и "удалить" событий.
    }
    render() {
        // Отрисовка корзины
    }
    init() {
        // Сначала отрисовывает товары в корзине, потом вешаем обработчик событий.
    }
}

class CartItem extends GoodsItem {
    constructor(props) {
        super(props);
    }
    render() {
        return `<div class="cart__item">
                    <span class="cart__title">${this.title}</span>
                    <span class="cart__price">${this.price}</span>
                    <button class="cart__btn">Удалить</button>
                </div>`;
    }
}

const list = new GoodsList(".goods__list");
list.fetchGoods();

document.addEventListener("DOMContentLoaded", () => {
    list.render();
})