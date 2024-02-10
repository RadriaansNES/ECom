document.addEventListener('DOMContentLoaded', function() {
    var fadeElements = document.querySelectorAll('.fade-in');
  
    var observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.4 }); 
  
    fadeElements.forEach(function(el) {
      observer.observe(el);
    });
  });
  