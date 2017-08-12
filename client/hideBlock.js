/**
 * Created by blackmamba on 09/08/17.
 */

function func(a) {
    var el;
    if(a === 1) {
        el = document.getElementById("meseAnno");
    }
    if(a === 2) {
        el = document.getElementById("giornoMeseAnno");
    }
    el.style.display = el.style.display === "none" ? "block" : "none";
}

function showValue() {
    document.getElementById('range').innerHTML = this.value;
}

document.getElementById('f1').onclick = function () {
    func(1);
};
document.getElementById('f2').onclick = function() {
    func(2);
};

(function () {
    var inputs = document.getElementsByTagName('input'),
        i, l = inputs.length;
    for (i = 0; i < l; i += 1) {
        if (inputs[i].getAttribute('type') === 'range') {
            inputs[i].onclick = showValue;
        }
    }
}());
