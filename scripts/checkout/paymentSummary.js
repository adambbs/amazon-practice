import {cart} from '../../data/cart-class.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import {addOrder} from '../../data/orders.js';

export function renderPaymentSummary() {
  let productPriceCents=0;
  let shippingPriceCents= 0;
  let totalItems=0;
  
  cart.cartItems.forEach((cartItem) => {
    const product=getProduct(cartItem.productId);
    productPriceCents +=product.priceCents * cartItem.quantity;
    
    const deliveryOption=getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
    totalItems+=cartItem.quantity;
  })

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents= totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalItems}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-payment-summary-shipping">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-payment-summary-total">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
  .addEventListener('click', async () =>{
    try{
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart.cartItems
        })
      });
  
      const order= await response.json();
      if (!order.id){
        throw new Error('The cart is empty.')
      } else{
        addOrder(order);
        cart.resetCart();
        window.location.href = 'orders.html'
      }

    } catch (error){
      alert(error.message)
      console.error('Unexpected error. Try again later.');
    }
  });
}