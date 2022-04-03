




window.onload = (event) => {
    let ul = document.querySelector('ul');
    let items = ul.children;
    for (let i = 0; i < items.length; i++) {
        animateIn(items[i], i);
    }
};
// items.forEach(function (item, index) {
//     animateOut(item);

function animateIn(li, index) {
    let delay = (index + 1) * 280;
    setTimeout(function () {
        console.log("andisp");
        li.children[0].classList.add('animated');
        li.children[0].classList.remove('tooleft');
    }, delay);
}

function animateOut(li) {
    let delay = 0;
    setTimeout(function () {
        li.style.opacity = 0;
        li.style.transform = "translateY(0px)";
    }, delay);
}
