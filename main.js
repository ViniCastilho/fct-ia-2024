let lib = {
    'gui': [],
    'board': [],

};

lib.playerClick = function (y, x) {
    alert(3*y+x);
}

lib.reset = function () {
    for (let i = 0; i < 9; i++) {
        let btn = document.querySelector(`#p${i+1}`);
        let y = Math.floor(i/3);
        let x = i % 3;
        btn.addEventListener('click', function () { lib.playerClick(y, x) });
        btn.style.gridRow = y+1;
        btn.style.gridColumn = x+1;
        btn.style.backgroundColor = '#55FF55';
        lib.gui.push(btn);
    }
}

lib.reset();