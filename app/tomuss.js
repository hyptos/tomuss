/*
 * tomuss
 * https://github.com/hyptos/tomuss
 *
 * Copyright (c) 2016 Antoine Martin
 * Licensed under the MIT license.
 */

let page = require('webpage').create();

let loadInProgress = false;
let testindex = 0;

page.onConsoleMessage = function onConsoleMessage(msg) {
    console.log(msg);
};

page.onAlert = function onAlert(msg) {
    console.log('alert!!> ' + msg);
};

page.onLoadStarted = function onLoadStarted() {
    loadInProgress = true;
    console.log('load started');
};

page.onLoadFinished = function onLoadFinished(status) {
    loadInProgress = false;
    if (status !== 'success') {
        console.log('Unable to access network');
        phantom.exit();
    } else {
        console.log('load finished');
    }
};

let steps = [
    function () {
        page.open('https://tomusss.univ-lyon1.fr/');
    },
    function () {
        page.injectJs('https://code.jquery.com/jquery-2.2.4.min.js');
        page.evaluate(function () {
            document.getElementById('username').value = 'p0907931';
            document.getElementById('password').value = 'XXXXXXXX';
            $('.btn-submit').click();
        });
    },
    function () {
        console.log('Answers:');
        page.evaluate(function () {
            let arrayUes = document.getElementsByClassName('DisplayUE');
            for (let i = 0; i < arrayUes.length; i++) {
                let arrayUe = arrayUes[i];
                console.log(arrayUe.getElementsByClassName('DisplayUETitle')[0].innerText);
                let arrayCellBox = arrayUe.getElementsByClassName('DisplayCellBox');
                for (let j = 0; j < arrayCellBox.length; j++) {
                    let title = arrayCellBox[j].getElementsByClassName('DisplayCellTitle')[0].innerText;
                    let value = arrayCellBox[j].getElementsByClassName('DisplayCellValue')[0].innerText;
                    value = value.trim();
                    if (value && value != "") {
                        console.log('Examen: ' + title + ' => ' + value);
                    }
                }
            }
        });
    },
    function () {
        console.log('Exiting');
    }
];

setInterval(function () {
    if (!loadInProgress && typeof steps[testindex] === 'function') {
        console.log('step ' + (testindex + 1));
        steps[testindex]();
        testindex = testindex + 1;
    }
    if (typeof steps[testindex] !== 'function') {
        console.log('test complete!');
        phantom.exit();
    }
}, 50);
