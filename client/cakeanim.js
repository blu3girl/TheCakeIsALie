let c1 = document.querySelector('.cake1');
let c2 = document.querySelector('.cake2');

function loopFunction(delay, callback) {
    var loop = function () {
        callback();
        setTimeout(loop, delay);
    }; loop();
};

function alternatecake() {
    if (a) {
        c1.classList.remove('hide');
        c2.classList.add('hide');
        a = false;

    }
    else {
        c1.classList.add('hide');
        c2.classList.remove('hide');
        a = true;

    }
}

let a = false;

window.onload = (event) => {
    c1 = document.querySelector('.cake1');
    c2 = document.querySelector('.cake2');
    loopFunction(600, alternatecake);

};