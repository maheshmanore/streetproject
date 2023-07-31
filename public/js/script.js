// public/js/script.js
document.addEventListener('DOMContentLoaded',async () => {
    const registerForm = document.querySelector('#register-form');
    const loginForm = document.querySelector('#login-form');
  
    if (registerForm) {
      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const password = formData.get('password');
  
        const response = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          window.location.href = '/dashboard';
        } else {
          alert('Registration failed. Try a different username.');
        }
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
  
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          window.location.href = '/dashboard';
        } else {
          alert('Login failed. Check your credentials.');
        }
      });
    }

    try {
        const response = await fetch('/check-auth');
        if (response.ok) {
          // User is authenticated
          const currentPath = window.location.pathname;
          if (currentPath === '/') {
            // Redirect to dashboard if the user is on the root URL
            window.location.href = '/dashboard';
          }
          // Add more conditions for other views that require authentication
          // For example:
          // else if (currentPath === '/profile') {
          //   window.location.href = '/profile';
          // }
    
          // Remove the login page from history to prevent navigation back to it
          history.replaceState({}, '', '/dashboard');
        } else {
          // User is not authenticated
          const currentPath = window.location.pathname;
          if (currentPath !== '/') {
            // Redirect to login page if the user is not on the root URL
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    });
  

  