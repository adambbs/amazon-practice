import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {formatCurrency} from '../scripts/utils/money.js';
import {loadProductsFetch} from '../data/products.js';
import {cart} from '../data/cart-class.js';
import {saveToStorage, orders, findProductInOrder, findMatchingItem} from "../data/orders.js";

await loadProductsFetch();

function renderOrders() {
  document.querySelector('.cart-quantity').innerHTML=`${cart.updateCartQuantity()}`;
  let listOrders=document.querySelector('.orders-grid');
  listOrders.innerHTML=''
  orders.forEach((order) => {
    listOrders.innerHTML+=`<div class="order-container-${order.id}"></div>`;

    let orderContainer= document.querySelector(`.order-container-${order.id}`);
    let orderHeader = `
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div class="today-date">${todayDate(order)}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div class="total-price">${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div class="order-ID">${order.id}</div>
        </div>
      </div>
    `;
    orderContainer.innerHTML+=orderHeader;

    let productsGrid='';

    order.products.forEach((product)=> {
      const productOrdered= findMatchingItem(product.productId);
      productsGrid=`
          <div class="order-details-grid">
            <div class="product-image-container">
              <img src="${productOrdered.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${productOrdered.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${dayjs(product.estimatedDeliveryTime).format('MMMM D')}
              </div>
              <div class="product-quantity">
                Quantity: ${product.quantity}
              </div>
              <button class="buy-again-button button-primary" data-id="${order.id}" data-product-id="${product.productId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
          </div>
      ` 
      orderContainer.innerHTML+=productsGrid;
    })
  });
  document.querySelectorAll(".buy-again-button").forEach((button)=>{
    button.addEventListener('click', () => {
      const orderId= button.dataset.id;
      const productId=button.dataset.productId;
      const foundItem=findProductInOrder(orders, orderId, productId);
      foundItem.quantity++;
      saveToStorage();
      renderOrders();
    })
  })
  document.querySelector('.search-button')
  .addEventListener('click', () => {
    const search = document.querySelector('.search-bar').value;
    window.location.href = `amazon.html?search=${search}`;
  })

  document.querySelector('.search-bar')
  .addEventListener('keydown', (event) => {
    if(event.key==='Enter'){
      const search = document.querySelector('.search-bar').value;
      window.location.href = `amazon.html?search=${search}`;
    }
  })
}
renderOrders();

function todayDate(object) {
  const timeOrder=dayjs(object.orderTime);
  const todayFormatted= timeOrder.format(
    'MMMM D'
  );
  return todayFormatted;
}



