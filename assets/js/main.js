const burgerMenu = document.querySelector('.burger-menu');
const mainNav = document.querySelector('.main-nav');

burgerMenu.addEventListener('click', function() {
    burgerMenu.classList.toggle('active');
    mainNav.classList.toggle('active');
})