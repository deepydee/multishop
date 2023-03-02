export class Cart {
  #cartData = [];
  #opts = {};

  constructor(options) {
    this.#initOptions(options);
    this.updateData();
    if (this.#opts.renderCartOnInit) {
      this.renderCart();
    }
    if (this.#opts.renderMenuCartOnInit) {
      this.renderMenuCart();
    }
    this.#bindHandlers();
  }

  #initOptions(options) {
    const defaultOptions = {
      renderCartOnInit: true,
      renderMenuCartOnInit: true,
      shippingPrice: 10,
      elAddToCart: '.add-to-cart',
      attrId: 'id',
      attrName: 'name',
      attrPrice: 'price',
      attrDelta: 'delta',
      elCart: '#cart',
      elGoods: '#goods',
      elTotalCartCount: '#total-cart-count',
      elSubtotalCartSum: '#subtotal-cart-summ',
      elShippingSum: '#shipping',
      elTotalCartSum: '#total-cart-summ',
      elCartItem: '.cart-item',
      elCartCount: '.count',
      elCartSum: '.summ',
      elChangeCount: '.change-count',
      elRemoveFromCart: '.remove-from-cart',
      elOrder: '#order',
    };

    options = this.#defaults(options ?? {}, defaultOptions);
    this.#opts = {...options};
  }

  #bindHandlers() {
    this.#onClickAddBtn();
    this.#onClickChangeCountInCart();
    this.#onClickRemoveFromCart();
  }

  #defaults(destination, source) {
    Object.keys(source).forEach((key) => {
      if (destination[key] === undefined || destination[key] === null) {
        destination[key] = source[key];
      }
    });

    return destination;
  }

  renderCart() {
    this.#cartData.forEach((good) => {
      this.#appendCartItem(good);
    });

    this.renderTotalCartSum();
  }

  renderTotalCartSum() {
    const subtotalSum = document.querySelector(this.#opts.elSubtotalCartSum);
    const shippingSum = document.querySelector(this.#opts.elShippingSum);
    const totalSum = document.querySelector(this.#opts.elTotalCartSum);

    subtotalSum.textContent = `\$${this.getSubtotalSum()}`;
    shippingSum.textContent = `\$${this.getShippingSum()}`;
    totalSum.textContent = `\$${this.getSum()}`;
  }

  renderMenuCart() {
    const totalCartCount = document.querySelectorAll(this.#opts.elTotalCartCount);
    let countAll = +this.getCountAll();

    totalCartCount.forEach((cartElem) => {
      cartElem.textContent = countAll !== 0 ? countAll : 0;
    });
  }

  #appendCartItem(good) {
    const cartContainer = document.querySelector(this.#opts.elCart);
    const template = `
    <tr class="cart-item" data-id="${good.id}">
      <td class="align-middle"><img src="${good.img}" alt="" style="width: 50px;"> ${good.name}</td>
      <td class="align-middle">${good.price}</td>
      <td class="align-middle">
          <div class="input-group quantity mx-auto" style="width: 100px;">
              <div class="input-group-btn">
                  <button class="btn btn-sm btn-primary btn-minus change-count" data-id="${good.id}" data-delta="-1">
                  <i class="fa fa-minus"></i>
                  </button>
              </div>
              <input type="text" class="form-control form-control-sm bg-secondary border-0 text-center count" value="${good.count}">
              <div class="input-group-btn">
                  <button class="btn btn-sm btn-primary btn-plus change-count" data-id="${good.id}" data-delta="1">
                      <i class="fa fa-plus"></i>
                  </button>
              </div>
          </div>
      </td>
      <td class="align-middle summ">\$${+good.count * +good.price}</td>
      <td class="align-middle"><button class="btn btn-sm btn-danger remove-from-cart" data-id="${good.id}"><i class="fa fa-times"></i></button></td>
    </tr>
    `;

    cartContainer.insertAdjacentHTML("beforeend", template);
  }

  #onClickAddBtn() {
    const catalogContainer = document.querySelector(this.#opts.elGoods);

    catalogContainer?.addEventListener('click', (event) => {
      const addBtn = event.target.closest(this.#opts.elAddToCart);

      if (!addBtn) return;

      const id = addBtn.dataset[this.#opts.attrId];
      const name = addBtn.dataset[this.#opts.attrName];
      const price = addBtn.dataset[this.#opts.attrPrice];
      const img = document.querySelector(`img[data-id="${addBtn.dataset[this.#opts.attrId]}"]`)
        .getAttribute('src');
      const count = 1;

      const item = {
        id,
        name,
        price,
        img,
        count,
      };

      this.add(item);
      this.renderMenuCart();
      // alert('Good has been placed to cart');
    });
  }

  #onClickChangeCountInCart() {
    const cartContainer = document.querySelector(this.#opts.elCart);

    cartContainer?.addEventListener('click', (event) => {
      const changeCountBtn = event.target.closest(this.#opts.elChangeCount);
       
      if (!changeCountBtn) return;

      const cartElem = changeCountBtn.closest('tr');
      const id = changeCountBtn.dataset[this.#opts.attrId];
      const delta = changeCountBtn.dataset[this.#opts.attrDelta];

      const cartItem = this.changeCount(id, delta);
      const cartCount = document.querySelector(`[data-id="${id}"] ${this.#opts.elCartCount}`);

      if (cartItem.count) {
        cartCount.value = cartItem.count;
      } else {
        cartElem.remove();
      }

      this.renderMenuCart();
      this.renderTotalCartSum();
    });
  }

  #onClickRemoveFromCart() {
    const cartContainer = document.querySelector(this.#opts.elCart);

    cartContainer?.addEventListener('click', (event) => {
      const removeBtn = event.target.closest(this.#opts.elRemoveFromCart);

      if (!removeBtn) return;

      const id = removeBtn.dataset[this.#opts.attrId];
      const cartElem = removeBtn.closest('tr');

      this.remove(id);
      cartElem.remove();
      this.renderMenuCart();
      this.renderTotalCartSum();
    })
  }

  getShippingSum() {
    return this.#opts.shippingPrice;
  }

  setShippingPrice(price) {
    this.#opts.shippingPrice = price;
  }

  updateData() {
    this.#cartData = JSON.parse(localStorage.getItem('cart')) ?? [];
    return this.#cartData;
  }

  getData() {
    return this.#cartData;
  }

  saveData() {
    localStorage.setItem('cart', JSON.stringify(this.#cartData));
    return this.#cartData;
  }

  clearData() {
    this.#cartData = [];
    this.saveData();
    return this.#cartData;
  }

  getById(id) {
    return this.#cartData
      .find((good) => good.id === id) ?? {};
  }

  add(item) {
    this.updateData();
    let oldItem = this.getById(item.id);

    if (Object.keys(oldItem).length === 0) {
      this.#cartData.push(item);
    } else {
      oldItem.count += item.count;
    }

    this.saveData();
    return this.#cartData;
  }

  remove(id) {
    this.updateData();
    
    this.#cartData.splice(
      this.#cartData.
        findIndex((good) => +good.id === id),
      1
    );

    this.saveData();
    return this.#cartData;
  }

  changeCount(id, delta) {
    let item = this.getById(id);

    if (item) {
      item.count += +delta;
      if (item.count < 1) {
        this.remove(id);
      }

      this.saveData();
    }

    return this.getById(id) ?? {};
  }

  getCount() {
    return this.#cartData.length;
  }

  getCountAll() {
    return this.#cartData
      .reduce((sum, item) => {
        return sum + item.count;
      }, 0);
  }

  getSubtotalSum() {
    return this.#cartData
    .reduce((sum, item) => {
      return sum + item.count * item.price;
    }, 0);
  }

  getSum() {
    return this.getShippingSum() + this.#cartData
      .reduce((sum, item) => {
        return sum + item.count * item.price;
      }, 0);
  }
}