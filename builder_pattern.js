/* 
3. *Некая сеть фастфуда предлагает несколько видов гамбургеров:
### Маленький (50 рублей, 20 калорий).
### Большой (100 рублей, 40 калорий).

### Гамбургер может быть с одним из нескольких видов начинок (обязательно):
### С сыром (+10 рублей, +20 калорий).
### С салатом (+20 рублей, +5 калорий).
### С картофелем (+15 рублей, +10 калорий).

### Дополнительно гамбургер можно посыпать приправой (+15 рублей, +0 калорий) и полить майонезом (+20 рублей, +5 калорий). 
### Напишите программу, рассчитывающую стоимость и калорийность гамбургера. 
    Можно использовать примерную архитектуру класса из методички, но можно использовать и свою.
*/

'use strict';

class Kitchen {
  constructor(){}
  prepare(builder) { 
    builder.step1();
    builder.step2();
    builder.step3();
    builder.step4();
    builder.step5();
    builder.get();
  }
}


class HamburgerBuilder {
  constructor() { 
    this.hamburger = null;
  }
  step1() { this.hamburger.addSupplement(CHEESE); }
  step2() { this.hamburger.addSupplement(SALAD); }
  step3() { this.hamburger.addSupplement(POTATOE); }
  step4() { this.hamburger.addSupplement(SPICE); }
  step5() { this.hamburger.addSupplement(MAYO); }
  get() { 
    console.log(`${this.hamburger.type} hamburger is prepared.
      It includes ${this.hamburger.supplements.join(', ')};
      Final price is ${this.hamburger.price} and it will have ${this.hamburger.calories} calories`);
    return this.hamburger; 
  }
}


class SmallHamburgerBuilder extends HamburgerBuilder {
  constructor(supplements) { 
    super();
    this.hamburger = new SmallHamburger(supplements);
  }
}


class BigHamburgerBuilder extends HamburgerBuilder {
  constructor(supplements) { 
    super();
    this.hamburger = new BigHamburger(supplements);
  }
}


const CHEESE = 'cheese';
const SALAD = 'salad';
const POTATOE = 'potatoe';
const SPICE = 'spice';
const MAYO = 'mayonnaise';
const ONE_OF = [CHEESE, SALAD, POTATOE];
const SMALL = 'small';
const BIG = 'big';


class Hamburger {
  constructor(price, calories, supplements=[]) {
    this.price = price;
    this.calories = calories;
    if (supplements.filter(supplement => ONE_OF.includes(supplement)).length === 0) {
      console.error(`Every Hamburger must have at lease one of the following supplements: ${ONE_OF.join(', ')}`);
      console.error(`This one only has: ${supplements.join(', ')} and will not be created`);
    }
    this.supplements = supplements;
    this.supplementStructure = {};
    this.supplementStructure[CHEESE] = {price: 10, calories: 20};
    this.supplementStructure[SALAD] = {price: 20, calories: 5};
    this.supplementStructure[POTATOE] = {price: 15, calories: 10};
    this.supplementStructure[SPICE] = {price: 15, calories: 0};
    this.supplementStructure[MAYO] = {price: 20, calories: 5};
  }
  addSupplement(name) {
    if (this.supplements.indexOf(name) !== -1) {
      this.price += this.supplementStructure[name].price; 
      this.calories += this.supplementStructure[name].calories; 
    }
  }
}


class SmallHamburger extends Hamburger {
  constructor(supplements) { 
    super(50, 20, supplements);
    this.type = SMALL; 
  }
}


class BigHamburger extends Hamburger {
  constructor(supplements) { 
    super(100, 40, supplements); 
    this.type = BIG;
  }
}


const kitchen = new Kitchen();
let smallHamburgerBuilder = new SmallHamburgerBuilder([CHEESE, SALAD, POTATOE, MAYO]);
kitchen.prepare(smallHamburgerBuilder);
smallHamburgerBuilder = new SmallHamburgerBuilder([POTATOE, MAYO]);
kitchen.prepare(smallHamburgerBuilder);
smallHamburgerBuilder = new SmallHamburgerBuilder([CHEESE, SPICE]);
kitchen.prepare(smallHamburgerBuilder);
let bigHamburgerBuilder = new BigHamburgerBuilder([SALAD, SPICE]);
kitchen.prepare(bigHamburgerBuilder);
bigHamburgerBuilder = new BigHamburgerBuilder([MAYO]);


/*
PS C:\Users\papov\GitHub\geekbrains-js-advanced> node .\builder_pattern.js
small hamburger is prepared.
      It includes cheese, salad, potatoe, mayonnaise;
      Final price is 115 and it will have 60 calories
small hamburger is prepared.
      It includes potatoe, mayonnaise;
      Final price is 85 and it will have 35 calories
small hamburger is prepared.
      It includes cheese, spice;
      Final price is 75 and it will have 40 calories
big hamburger is prepared.
      It includes salad, spice;
      Final price is 135 and it will have 45 calories
Every Hamburger must have at lease one of the following supplements: cheese, salad, potatoe
This one only has: mayonnaise and will not be created      
*/