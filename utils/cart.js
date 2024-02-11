
const shoppingCart = [];
let cartJSON = null;

document.addEventListener("DOMContentLoaded", function () {

  loadCartFromCookie();
  updateCartDisplay();
});

function saveCartToCookie() {
  const cartJSON = JSON.stringify(shoppingCart);
  document.cookie = `shoppingCart=${cartJSON}; path=/`;
}

function loadCartFromCookie() {
  const cookieData = document.cookie.split(';').find(cookie => cookie.trim().startsWith('shoppingCart='));
  if (cookieData) {
    const cartJSON = cookieData.split('=')[1];
    shoppingCart.length = 0;
    shoppingCart.push(...JSON.parse(cartJSON));
  }
}

function addToCart(productName, productPrice, quantity, priceId) {
  const existingItem = shoppingCart.find(item => item['price-id'] === priceId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const cartItem = {
      'price-id': priceId,
      name: productName,
      price: productPrice,
      quantity,
    };

    shoppingCart.push(cartItem);
  }

  updateCartDisplay();
  saveCartToCookie();
  $('#cartModal').modal('show');
}


function updateCartDisplay() {
  const cartTableBody = $('#cartTableBody');
  const cartTotal = $('#cartTotal');
  const emptyCartMessage = $('#emptyCartMessage');
  const cartTableContainer = $('#cartTableContainer');
  const initTotal = $('#initTotal');
  const checkout = $('#checkout');

  cartTableBody.empty();

  let total = 0;

  if (shoppingCart.length === 0 && cartJSON === null) {
    cartTableContainer.hide();
    emptyCartMessage.show();
    $('#initTotal').attr('style', 'display:none !important');
    checkout.hide();
  } else {
    cartTableContainer.show();
    emptyCartMessage.hide();
    initTotal.show();
    checkout.show();

    shoppingCart.forEach((item, index) => {
      total += item.price * item.quantity;

      const newRow = $('<tr>');

      const productCell = $('<td>').text(item.name);

      const priceCell = $('<td>').text(`$${item.price}`);

      const qtyInputCell = $('<td class="qty">');
      const qtyInput = $('<input>')
        .attr('type', 'number')
        .attr('value', item.quantity)
        .data('index', index);

      qtyInput.addClass('custom-qty-input');

      qtyInputCell.append(qtyInput);

      const itemTotal = $('<td>').text(`$${(item.quantity * item.price).toFixed(2)}`);

      const actionsCell = $('<td>');
      const removeButton = $('<button>').text('X').addClass('btn btn-danger btn-sm');
      removeButton.on('click', () => removeItemFromCart(index));


      actionsCell.css('text-align', 'center');

      actionsCell.append(removeButton);

      newRow.append(productCell, priceCell, qtyInputCell, itemTotal, actionsCell);
      cartTableBody.append(newRow);
    });
  }

  const formattedTotal = total.toFixed(2);
  cartTotal.text(`$${formattedTotal}`);
}

function removeItemFromCart(index) {
  shoppingCart.splice(index, 1);
  updateCartDisplay();
  saveCartToCookie();
}

$('.addToCartButton').on('click', function () {
  const productName = $(this).data('product-name');
  const productPrice = $(this).data('product-price');
  const priceId = $(this).data('price-id');
  const quantity = 1;
  addToCart(productName, productPrice, quantity, priceId);
});

$('#cartTableBody').on('focusout', '.custom-qty-input', function () {
  updateCartQuantity(this);
});

$('#cartTableBody').on('keydown', '.custom-qty-input', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    updateCartQuantity(this);
  }
});

function updateCartQuantity(inputField) {
  const index = $(inputField).data('index');
  const newValue = parseInt($(inputField).val());

  if (!isNaN(index) && index >= 0 && index < shoppingCart.length) {
    if (!isNaN(newValue) && newValue >= 0) {
      if (newValue === 0) {
        shoppingCart.splice(index, 1);
      } else {
        shoppingCart[index].quantity = newValue;
      }
      saveCartToCookie();
    } else {
      $(inputField).val(shoppingCart[index].quantity);
    }
  }

  updateCartDisplay();
}
