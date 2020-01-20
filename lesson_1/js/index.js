const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

const renderGoodsItem = (title = "Some Stuff", price = 0) =>
    `<div class="goods__item"><h3 class="goods__title">${title}</h3><p class="goods__price">${price}$</p></div>`;

const renderGoodsList = (list = []) => {
    const goodsList = list.map(item => renderGoodsItem(item.title, item.price));
    document.querySelector('.goods__list').innerHTML = goodsList.join("");
}

renderGoodsList(goods);