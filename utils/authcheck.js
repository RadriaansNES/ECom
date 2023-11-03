  fetch('/check-auth') 
    .then(response => {
      if (response.status === 200) {
      } else {
        window.location.href = '/';
      }
    });
