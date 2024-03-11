document.addEventListener('DOMContentLoaded', function () {
    function hideCart() {
      var cartElement = document.getElementById('cart');
      cartElement.style.display = 'none';
    }

    function showCart() {
      var cartElement = document.getElementById('cart');
      cartElement.style.display = '';
    }

    document.getElementById('navbarSupportedContent').addEventListener('show.bs.collapse', hideCart);
    document.getElementById('navbarSupportedContent').addEventListener('hidden.bs.collapse', showCart);
  });