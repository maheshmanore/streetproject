document.addEventListener('DOMContentLoaded', () => {
  const navbarContainer = document.querySelector('#navbar-container');

  // Fetch the navbar component and inject it into the container
  fetch('/views/design/navbar/navbar.html')
    .then((response) => response.text())
    .then((data) => {
      navbarContainer.innerHTML = data;
      initializeNavbar();
    })
    .catch((error) => console.error('Error fetching navbar:', error));
});

function initializeNavbar() {
  const menuIcon = document.querySelector('.menu-icon');
  const navLinks = document.querySelector('.nav-links');

  menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('show-nav');
  });
}
