
  // Check if the user is authenticated
  fetch('/check-auth') 
    .then(response => {
      if (response.status === 200) {
        // User is authenticated, continue displaying the page
      } else {
        // User is not authenticated, redirect to the login page
        window.location.href = '/'; //Send home 
      }
    });
