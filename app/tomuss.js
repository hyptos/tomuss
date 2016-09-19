/*
 * tomuss
 * https://github.com/hyptos/tomuss
 *
 * Copyright (c) 2016 Antoine Martin
 * Licensed under the MIT license.
 */

'use strict';

var page = require('webpage').create();
var loadInProgress = false;
var testindex = 0;

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onAlert = function(msg) {
    console.log('alert!!> ' + msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function(status) {
    loadInProgress = false;
    if (status !== 'success') {
        console.log('Unable to access network');
        phantom.exit();
    } else {
        console.log("load finished");
    }
};

var steps = [
    function() {
        page.open('https://tomusss.univ-lyon1.fr/');
    },
    function() {
        page.injectJs("https://code.jquery.com/jquery-2.2.4.min.js");
        page.evaluate(function() {
            document.getElementById('username').value = 'p0907931';
            document.getElementById('password').value = 'XXXXXXXX';
            $('.btn-submit').click();
        });
    },
    function() {
        console.log('Answers:');
        page.evaluate(function () {
            var arrayUes = document.getElementsByClassName('DisplayUE');
            for(var i = 0; i < arrayUes.length; i++){
                var arrayUe = arrayUes[i];
                console.log(arrayUe.getElementsByClassName('DisplayUETitle')[0].innerText);
                var arrayCellBox = arrayUe.getElementsByClassName('DisplayCellBox');
                for(var j = 0; j < arrayCellBox.length; j++){
                    var title = arrayCellBox[j].getElementsByClassName('DisplayCellTitle')[0].innerText;
                    var value = arrayCellBox[j].getElementsByClassName('DisplayCellValue')[0].innerText;
                    value = value.trim();
                    if(value && value != ""){
                        console.log('Examen: '+ title+ ' => '+ value);
                    }
                }
            }
        });
    },
    function() {
        console.log('Exiting');
    }
];

var interval = setInterval(function() {
    if (!loadInProgress && typeof steps[testindex] == "function") {
        console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
}, 50);