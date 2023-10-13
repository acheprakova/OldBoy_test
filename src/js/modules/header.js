export function menuBurger() {
    const buttonMenu = document.getElementById('burger');
    const menu = document.querySelector('.header__navigation');
    buttonMenu.addEventListener('click', e => {
        e.preventDefault();
        buttonMenu.classList.toggle("active");
        menu.classList.toggle("active");
    })
}