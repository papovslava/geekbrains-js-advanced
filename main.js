'use strict';

const GET_INDEX_ONLY = true;

class RenderableObject {
  constructor() {
    this.renderers = [
      {'default': () => { 
          console.error('Default renderer is not defined'); 
          return '';
        }
      }
    ];
  } 
  render(rendererName='default') { return this.renderers[rendererName].call(this); }
  addRenderer(name, renderer) { this.renderers[name] = renderer; }
  renderInContainer($container, position='beforeend', rendererName) {
    if (typeof $container == 'undefined') { console.error('Container is undefined'); return ''; }
    $container.insertAdjacentHTML(position, this.render(rendererName));
  }
}


class Product extends RenderableObject {
  constructor(title, price, pid) {
    super();
    this.title = title;
    this.price = price;
    this.pid = pid;
    this.amount = 1;
    this.addRenderer('default', () => `<li>
      <img src="./img/placeholder.jpg" alt="Image of the Product">
      <h3>${this.title}</h3>
      <p>$${this.price}</p>
      <button class="cta">Add to Cart</button>
    </li>`);
  }
}


class Products extends RenderableObject {
  constructor(products) {
    super();
    this.products = products;
    this.addRenderer('default', () => this.products.map((product) => product.render()).join('\n'));
  }
  getPrice() { return this.products.reduce((total, {price}) => total + price, 0) };  
  find(target, getIndex) { return this.findById(typeof target === 'object' ? target.pid : target, getIndex); }
  findById(targetPid, getIndex=false) {
    const fn = getIndex ? 'indexOf' : 'find';
    const product = Array.prototype[fn].call(this.products, ({pid}) => pid === targetPid);
    // const product = this.products[fn].call(this, ({pid}) => pid === targetPid);
    return (typeof product === 'undefined' ? false : product);
  }
}


class Cart extends Products {
  constructor() {
    super([]);
    // this.addRenderer('some cart renderer');
  }
  add(product, amount=1) {
    const productInCart = this.find(product);
    if (productInCart) { productInCart.amount += amount; }
    else {
      this.products.push(product);
      this.products[this.products.length-1].amount = amount;
    }
    return this.products; 
  }
  remove(product, amount=1) { 
    const productInCart = this.find(product);
    if (productInCart) { productInCart.amount -= amount; }
    if (!productInCart.amount) { 
      this.products.splice(this.find(product, GET_INDEX_ONLY), 1);
    }
    return this.products; 
  }
}


const products = new Products([
  new Product('Shirt', 150, 'id-10011002'),
  new Product('Socks', 50, 'id-10011003'),
  new Product('Jacket', 350, 'id-10011004'),
  new Product('Shoes', 250, 'id-10011005')
]);

const $products = document.querySelector('#products');

products.renderInContainer($products);
console.log(products.getPrice());
const cart = new Cart();
cart.add(products.find('id-10011003'));
cart.add(products.find('id-10011004'));
cart.add('id-10011004', 5);
cart.remove('id-10011004');
cart.remove('id-10011004', 2);
cart.add(products.find('id-10011005'));
cart.remove('id-10011005');
console.log(cart.products);
