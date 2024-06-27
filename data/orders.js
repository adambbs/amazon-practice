import {getProduct} from "./products.js";

export const orders= JSON.parse(localStorage.getItem('orders'))|| [];

export function saveToStorage(){
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function addOrder (order) {
  orders.unshift(order);
  saveToStorage();
}

export function findMatchingItem(productId){
  return getProduct(productId);
}

export function findMatchingOrder(orders, orderId){
  let matchingOrder;
  orders.forEach((order) => {
    if (orderId===order.id){
      matchingOrder=order;
    }
  })

  return matchingOrder;
}

export function findProductInOrder(orders, orderId, productId){
  let matchingOrder = findMatchingOrder(orders, orderId)
  let matchingItem;

  matchingOrder.products.forEach((product) => {
    if (productId===product.productId){
      matchingItem=product;
    }
  })
  return matchingItem;
}