import {orders, findProductInOrder, findMatchingItem, findMatchingOrder} from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {cart} from "../data/cart-class.js";
import {loadProductsFetch} from "../data/products.js";

await loadProductsFetch();

const url= new URL(window.location.href);
const orderId=url.searchParams.get('orderId');
const productId=url.searchParams.get('productId');

function renderTrackingPage (){
  document.querySelector('.cart-quantity').innerHTML=`${cart.updateCartQuantity()}`
  const matchingItemOrders= findProductInOrder(orders, orderId, productId);
  const matchingItemProducts=findMatchingItem(productId);
  const matchingOrder = findMatchingOrder(orders, orderId); 

  const deliveredMessage = dayjs().isBefore(dayjs(matchingItemOrders.estimatedDeliveryTime)) ? 'Arriving on' : 'Delivered on';

  let htmlTracking=document.querySelector('.order-tracking');
  htmlTracking.innerHTML=''
  htmlTracking.innerHTML+= `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      ${deliveredMessage} ${dayjs(matchingItemOrders.estimatedDeliveryTime).format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${matchingItemProducts.name}
    </div>

    <div class="product-info">
      Quantity: ${matchingItemOrders.quantity}
    </div>

    <img class="product-image" src="${matchingItemProducts.image}">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `
  const progressBar=document.querySelector('.progress-bar');
  const widthProgressBar= calculateDeliveryProgress(dayjs(),matchingOrder.orderTime,matchingItemOrders.estimatedDeliveryTime);
  if (widthProgressBar<100){
    progressBar.style.width=`${widthProgressBar}%`;
  } else{
    progressBar.style.width=`100%`;
  }
  
  const listLabels=document.querySelectorAll('.progress-label');
   if(widthProgressBar>=0 && widthProgressBar<50){
    listLabels[0].classList.add('current-status');
   } else if (widthProgressBar>=50 && widthProgressBar<100){
    listLabels[1].classList.add('current-status');
   } else{
    listLabels[2].classList.add('current-status')
   }

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

renderTrackingPage();

function calculateDeliveryProgress(currentTime, orderTime, deliveryTime) {
  return (snatchDayDifference(currentTime, orderTime)/snatchDayDifference(deliveryTime, orderTime))*100
}

function snatchDayDifference (date1, date2) {
  return dayjs(date1).diff(dayjs(date2), 'days');
}
