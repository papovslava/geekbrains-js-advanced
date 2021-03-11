'use strict';

const GET_INDEX_ONLY = true;

class API {
  constructor() {
    this.urlGetProducts = './products.json';
  }

  parseJSON(data) {
    return new Promise(resolve => resolve(JSON.parse(data)));
  }

  fetch(url, success=console.log, error=console.error) {
    let xhr;

    if (window.XMLHttpRequest) { xhr = new XMLHttpRequest(); }
    else if (window.ActiveXObject) { xhr = new ActiveXObject("Microsoft.XMLHTTP"); }

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { success(xhr.responseText); }
        else if (xhr.status > 400) { error(xhr.status); }
      }
    }

    xhr.open('GET', url, true);
    xhr.send();
  }

  fetchProducts(url=this.urlGetProducts) {
    return new Promise((resolve, reject) => {
      this.fetch(url, resolve, reject);
    });
  }
}

class RenderableObject {
  constructor($container) {
    this.$container = $container;
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
  renderInContainer($container=this.$container, position='beforeend', rendererName) {
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


class Misc {
  constructor(items) { this.items = items; }
  find(target, getIndex) { return this.findById(typeof target === 'object' ? target.pid : target, getIndex); }
  findById(targetPid, getIndex=false) {
    const fn = getIndex ? 'indexOf' : 'find';
    const product = Array.prototype[fn].call(this.items, ({pid}) => pid === targetPid);
    // const product = this.products[fn].call(this, ({pid}) => pid === targetPid);
    return (typeof product === 'undefined' ? false : product);
  }
}


class Products extends RenderableObject {
  constructor($container) {
    super($container);
    this.items = [];
    this.api = new API();
    this.misc = new Misc(this.items);
    this.addRenderer('default', () => this.items.map(product => product.render()).join('\n'));
    this.fetch();
  }
  getPrice() { return this.items.reduce((total, {price}) => total + price, 0) };  
  fill(data) {
    return new Promise(resolve => {
      for (let {title, price, id} of data) {
        console.log(title, price, id);
        this.items.push(new Product(title, price, id))
      }
      resolve(this.items);
    })
  }
  fetch() {
    this.api.fetchProducts()
      .then(response => this.api.parseJSON(response))
      .then(data => this.fill(data))
      .then(() => this.renderInContainer())
      .catch(err => console.error(err))
  }
}


class Cart extends RenderableObject {
  constructor($container) {
    super($container);
    this.items = [];
    this.misc = new Misc(this.items);
    // this.addRenderer('some cart renderer');
  }
  add(product, amount=1) {
    const productInCart = this.misc.find(product);
    if (productInCart) { productInCart.amount += amount; }
    else {
      this.items.push(product);
      this.items[this.items.length-1].amount = amount;
    }
    return this.items; 
  }
  remove(product, amount=1) { 
    const productInCart = this.misc.find(product);
    if (productInCart) { productInCart.amount -= amount; }
    if (!productInCart.amount) { 
      this.items.splice(this.misc.find(product, GET_INDEX_ONLY), 1);
    }
    return this.items; 
  }
  show() {
    console.log(this.items);
  }
}


const products = new Products(document.querySelector('#products'));

// pending products fetch
setTimeout(() => {
  console.log(products.getPrice());
  const cart = new Cart();
  cart.add(products.misc.find('id-10011003'));
  cart.add(products.misc.find('id-10011004'));
  cart.add('id-10011004', 5);
  cart.remove('id-10011004');
  cart.remove('id-10011004', 2);
  cart.add(products.misc.find('id-10011005'));
  cart.remove('id-10011005');
  cart.show();
}, 200);
