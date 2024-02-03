document.addEventListener('DOMContentLoaded', () => {
    const nav2 = document.querySelector('.nav2');
    const nav1 = document.querySelector('.nav1');
    const nav3 = document.querySelector('.nav3');
    const nav1Height = nav1.clientHeight;

    function toggleNav2Fixed() {
      if (window.scrollY > nav1Height) {
        nav2.classList.add('fixed');
        nav3.classList.add('fixed');
      } else {
        nav2.classList.remove('fixed');
        nav3.classList.remove('fixed');
      }
    }

    toggleNav2Fixed();

    window.addEventListener('scroll', toggleNav2Fixed);
  });