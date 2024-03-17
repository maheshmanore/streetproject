// public/js/script.js
document.addEventListener('DOMContentLoaded',async () => {
    const registerForm = document.querySelector('#register-form');
    const loginForm = document.querySelector('#login-form');
    
    const submitButton = document.getElementById('submitButton');
  
    if (registerForm) {
      submitButton.addEventListener('click', async (event) => {
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
      submitButton.addEventListener('click', async (event) => {
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

    
    
  
  });
  

  