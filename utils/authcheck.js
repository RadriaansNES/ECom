function updateHeader(authenticated) {
  const loginLink = document.querySelector('.navbar-brand[href="/account"]');
  if (authenticated) {
    loginLink.textContent = 'Account';
  } else {
    loginLink.textContent = 'Login';
  }
}

fetch('/check-auth')
  .then((response) => {
    if (response.status === 200) {
      updateHeader(true);
    } else {
      updateHeader(false);
    }
  });