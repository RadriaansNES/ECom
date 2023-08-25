// Initialize an empty shopping cart array
const shoppingCart = [];

//Convery array to JSON string and set as cookie
function saveCartToCookie() {
  const cartJSON = JSON.stringify(shoppingCart);
  console.log("Saving cart to cookie:", cartJSON);
  document.cookie = `shoppingCart=${cartJSON}; expires=123; =/`;
}

function loadCartFromCookie() {
  const cookieData = document.cookie.split(';').find(cookie => cookie.trim().startsWith('shoppingCart='));
  if (cookieData) {
    const cartJSON = cookieData.split('=')[1];
    console.log("Loading cart from cookie:", cartJSON);
    shoppingCart.length = 0; // Clear the current cart
    shoppingCart.push(...JSON.parse(cartJSON)); // Load cart from cookie
  }
}

// Function to add an item to the shopping cart
function addToCart(product, price, quantity) {
  // Check if the product is already in the cart
  const existingItem = shoppingCart.find(item => item.product === product);

  if (existingItem) {
    // If it exists, update the quantity
    existingItem.quantity += quantity;
  } else {
    // If it doesn't exist, create a new cart item object
    const cartItem = {
      product,
      price,
      quantity
    };
    // Add the item to the shopping cart
    shoppingCart.push(cartItem);
  }

  // Update the cart display
  updateCartDisplay();
  saveCartToCookie();
}

// Function to update the cart display
function updateCartDisplay() {
  const cartTableBody = $('#cartTableBody');
  const cartTotal = $('#cartTotal');
  const emptyCartMessage = $('#emptyCartMessage');
  const cartTableContainer = $('#cartTableContainer');
  const initTotal = $('#initTotal');
  const checkout = $('#checkout');

  // Clear the existing cart table
  cartTableBody.empty();

  // Calculate the total price
  let total = 0;

  if (shoppingCart.length === 0) {
    // If the cart is empty, display the empty cart message and hide the table
    cartTableContainer.hide();
    emptyCartMessage.show();
    $('#initTotal').attr('style', 'display:none !important');
    checkout.hide();

  } else {
    // If there are items in the cart, hide the empty cart message and show the table
    cartTableContainer.show();
    emptyCartMessage.hide();
    initTotal.show();
    checkout.show();

    // Iterate through the shopping cart items and display them
    shoppingCart.forEach((item, index) => {
      total += item.price * item.quantity;

      const newRow = $('<tr>');

      // Product column
      const productCell = $('<td>').text(item.product);

      // Price column
      const priceCell = $('<td>').text(`${item.price}$`);

      // Quantity input field column
      const qtyInputCell = $('<td class="qty">');
      const qtyInput = $('<input>')
        .attr('type', 'number')
        .attr('value', item.quantity)
        .data('index', index); // Store the item index in data attribute

      // Add a custom class to the input field
      qtyInput.addClass('custom-qty-input');

      qtyInputCell.append(qtyInput);

      // Total column
      const totalCell = $('<td>').text(`${item.price * item.quantity}$`);

      // Actions column
      const actionsCell = $('<td>');
      const removeButton = $('<button>').text('Remove').addClass('btn btn-danger btn-sm');
      removeButton.on('click', () => removeItemFromCart(index));
      actionsCell.append(removeButton);

      newRow.append(productCell, priceCell, qtyInputCell, totalCell, actionsCell);
      cartTableBody.append(newRow);
    });
  }

  // Update the total price outside the loop
  cartTotal.text(`${total}$`);
}

// Function to remove an item from the shopping cart
function removeItemFromCart(index) {
  shoppingCart.splice(index, 1);
  updateCartDisplay();
  saveCartToCookie();
}

// Attach a click event handler to the "Add to cart" buttons using jQuery
$('.addToCartButton').on('click', function () {
  const productName = $(this).data('product-name');
  const productPrice = $(this).data('product-price');
  const quantity = 1; // Default quantity
  addToCart(productName, productPrice, quantity);
});

// Attach a focusout event handler to the quantity input fields
$('#cartTableBody').on('focusout', '.custom-qty-input', function () {
  updateCartQuantity(this);
});

// Attach a keydown event handler to the quantity input fields to listen for Enter key
$('#cartTableBody').on('keydown', '.custom-qty-input', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent form submission if Enter is pressed
    updateCartQuantity(this);
  }
});

// Function to update the cart quantity
function updateCartQuantity(inputField) {
  const index = $(inputField).data('index'); // Get the index of the item in the cart
  const newValue = parseInt($(inputField).val());

  if (!isNaN(newValue) && newValue >= 0) {
    shoppingCart[index].quantity = newValue;
  } else {
    // Reset the input value to the previous quantity
    $(inputField).val(shoppingCart[index].quantity);
  }

  updateCartDisplay();
};