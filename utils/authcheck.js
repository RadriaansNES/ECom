function updateHeader(authenticated) {
  const loginLink = document.getElementById('Login');
  if (authenticated) {
    loginLink.textContent = 'Account';
  } else {
    loginLink.textContent = 'Login';
  }
  loginLink.style.display = 'block';  
}

fetch('/check-auth')
  .then((response) => {
    const isAuthenticated = response.status === 200;
    updateHeader(isAuthenticated);
  });
