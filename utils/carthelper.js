document.addEventListener('DOMContentLoaded', function () {
    // Function to hide cart when navigation is shown
    function hideCart() {
      var cartElement = document.getElementById('cart');
      cartElement.style.display = 'none';
    }

    // Function to show cart when navigation is hidden
    function showCart() {
      var cartElement = document.getElementById('cart');
      cartElement.style.display = ''; // or 'inline', or any other appropriate display style
    }

    // Add event listeners for Bootstrap collapse events
    document.getElementById('navbarSupportedContent').addEventListener('show.bs.collapse', hideCart);
    document.getElementById('navbarSupportedContent').addEventListener('hidden.bs.collapse', showCart);
  });