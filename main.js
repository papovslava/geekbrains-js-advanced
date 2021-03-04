const products = [
  { title: 'Shirt', price: 150 },
  { title: 'Socks', price: 50 },
  { title: 'Jacket', price: 350 },
  { title: 'Shoes', price: 250 }
];


const $products = document.querySelector('#products');


const renderProduct = ({title, price}) => {
  return `
    <li>
      <img src="./img/placeholder.jpg" alt="Image of the Product">
      <h3>${title}</h3>
      <p>$${price}</p>
      <button class="cta">Add to Cart</button>
    </li>
  `;
}


const renderProducts = (list = products, $container = $products) => {
  let listHTML = list.map(
    item => renderProduct(item)
  ).join('\n');

  $container.insertAdjacentHTML('beforeend', listHTML);
}


renderProducts();