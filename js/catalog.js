export class Catalog {
  #url = '../data/goods.json';

  constructor(url) {
    this.#url = url;
    this.#appendCatItems();
  }

  async #getJSON() {
    const url = this.#url;
    
    try {
      const responce = await fetch(url);
  
      if (responce.ok) {
        const data = await responce.json();
        return data;
      } else {
        console.log(`HTTP Error: ${responce.status}`);
        return -1;
      }
    } catch (e) {
      console.log(`Error: ${e.name}: ${e.message}`);
      return -1;
    }
  }

  #appendCatItem(goodsList, good) {
    let template = `
    <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
      <div class="product-item bg-light mb-4">
        <div class="product-img position-relative overflow-hidden">
            <img class="img-fluid w-100" src="${good.img}" alt="" data-id="${good.id}">
            <div class="product-action">
                <a class="btn btn-outline-dark btn-square add-to-cart" href="#" data-id="${good.id}" data-name="${good.name}" data-price="${good.price}"><i class="fa fa-shopping-cart"></i></a>
                <a class="btn btn-outline-dark btn-square" href="#"><i class="far fa-heart"></i></a>
                <a class="btn btn-outline-dark btn-square" href="#"><i class="fa fa-sync-alt"></i></a>
                <a class="btn btn-outline-dark btn-square" href="#"><i class="fa fa-search"></i></a>
            </div>
        </div>
        <div class="text-center py-4">
            <a class="h6 text-decoration-none text-truncate" href="">${good.name}</a>
            <div class="d-flex align-items-center justify-content-center mt-2">
                <h5>${good.price}</h5><h6 class="text-muted ml-2"><del></del></h6>
            </div>
            <div class="d-flex align-items-center justify-content-center mb-1">
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small>(99)</small>
            </div>
          </div>
      </div>
    </div>
    `;
  
    goodsList.insertAdjacentHTML("beforebegin", template);
  }

  #appendCatItems() {
    const goodsList = document.querySelector('#goods .pg');
  
    this.#getJSON()
      .then((data) => {
        data.forEach((good) => {
          this.#appendCatItem(goodsList, good);
        });
      });
  };
}






// const removeCatItems = () => {
//   const catItems = document.querySelector('#goods .row').children;

//   [...catItems].forEach((item) => {
//     if (itemm.last)
//   });
// };