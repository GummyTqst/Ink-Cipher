const burgerMenu = document.querySelector('.burger-menu');
const mainNav = document.querySelector('.main-nav');

burgerMenu.addEventListener('click', function() {
    burgerMenu.classList.toggle('active');
    mainNav.classList.toggle('active');
})



let dialog = document.getElementById('dialog');
let dialogContent = document.getElementById('dialog-content');
const showBtn = document.querySelectorAll('.show-dialog');
const closeBtn = document.querySelector('.close-dialog');

showBtn.forEach(function (btn) {
    btn.addEventListener('click', function() {
        let hiddenContent = this.querySelector('.modal-content');
        
        if (hiddenContent) {
            dialogContent.innerHTML = hiddenContent.innerHTML;
            dialog.showModal();
        }
    });
})

closeBtn.addEventListener('click', closeDialog);

function closeDialog() {
    dialog.close();
    dialogContent.innerHTML = "";
}