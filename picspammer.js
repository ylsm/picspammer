//global variables
var urls;
var codeType;
var processedImgs = [];
var notFound = [];
var imgsDone = 0;
var rawUrls;
window.onload = function() {
    displayInitial();
}

//runs this first
function processUrls() {
    displayLoading();
    rawUrls = document.getElementById('urls').value;
    // split textarea string by newlines into array
    urls = rawUrls.match(/[^\r\n]+/g);
    var img;
    for (var i = 0; i < urls.length; i++) {
        // append http to start of URL if it's not there
        if (urls[i].indexOf("http://") == -1 && urls[i].indexOf("https://") == -1) {
            urls[i] = "http://" + urls[i];
        }
        // load the images
        img = document.createElement('img');
        img.onload = processImg;
        img.onerror = function() {
            notFound.push(this.src);
            checkFinishedLoading()
        };
        img.src = urls[i];
        img.index = i;
    }
}

//when an image loads, this happens
function processImg() {
    if (this.width > 0) {
        processedImgs[this.index] = {
            url: this.src,
            width: this.width,
            height: this.height
        };
    } else {
        // if it has no width then there's something wrong with it
        notFound.push(this.src);
    }
    checkFinishedLoading();
}

//this runs every time an image finishes loading
function checkFinishedLoading() {
    // increment total number of images finished loading
    imgsDone += 1;
    if (imgsDone >= urls.length) {
        genCode();
    }
}

//generates the HTML code
function genCode() {
    var codeList = [];
    var code = "";
    var includeUrl = document.getElementById('include-url').checked;
    var makeLink = document.getElementById('make-link').checked;
    for (var i in processedImgs) {
        if (codeType == "img") {
            code = '<img src="' + processedImgs[i].url + '" width="' + processedImgs[i].width + '"  height="' + processedImgs[i].height + '">';
            if (makeLink) {
                code = '<a href="' + processedImgs[i].url + '">' + code + '</a>';
            }
        } else if (codeType == "table") {
            code = '<table background="' + processedImgs[i].url + '" width="' + processedImgs[i].width + '"  height="' + processedImgs[i].height + '"><tr><td></td></tr></table>';
        } else {
            code = '[img=' + processedImgs[i].width + 'x' + processedImgs[i].height + ']' + processedImgs[i].url + '[/img]';
            if (makeLink) {
                code = '[url=' + processedImgs[i].url + ']' + code + '[/url]';
            }
        }
        if (includeUrl) {
            code += '\n' + processedImgs[i].url;
        }
        codeList.push(code);
    }
    displayCode(codeList);
}

//displays initial form
function displayInitial(preloadedUrls) {
    var workingArea = document.getElementById('working-area');
    var form = document.createElement('form');
    form.setAttribute("onsubmit", "processUrls();return false;");
    workingArea.appendChild(form);
    var textarea = document.createElement('textarea');
    textarea.setAttribute("id", "urls");
    textarea.autofocus = true;
    textarea.required = true;
    if (preloadedUrls != null) {
        textarea.innerHTML = preloadedUrls;
    }
    form.appendChild(textarea);
    var button = document.createElement('button');
    button.setAttribute("type", "submit");
    button.setAttribute("onclick", "codeType='img'");
    button.innerHTML = "img tags";
    form.appendChild(button);
    button = document.createElement('button');
    button.setAttribute("type", "submit");
    button.setAttribute("onclick", "codeType='table'");
    button.innerHTML = "table tags";
    form.appendChild(button);
    button = document.createElement('button');
    button.setAttribute("type", "submit");
    button.setAttribute("onclick", "codeType='bbcode'");
    button.innerHTML = "bbcode";
    form.appendChild(button);
    var span = document.createElement('span');
    span.setAttribute("class", "checkbox");
    form.appendChild(span);
    var input = document.createElement('input');
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", "include-url");
    span.appendChild(input);
    var label = document.createElement('label');
    label.setAttribute("for", "include-url");
    label.innerHTML = "Include plaintext URL of each image";
    span.appendChild(label);
    span = document.createElement('span');
    span.setAttribute("class", "checkbox");
    form.appendChild(span);
    input = document.createElement('input');
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", "make-link");
    span.appendChild(input);
    label = document.createElement('label');
    label.setAttribute("for", "make-link");
    label.innerHTML = "Make images link to source (only works for img tags and bbcode)";
    span.appendChild(label);
}

//displays loading overlay
function displayLoading() {
    var overlay = document.createElement('div');
    overlay.setAttribute('id', 'loading-overlay');
    document.body.appendChild(overlay);
}

//displays the code
function displayCode(codeList) {
    document.body.removeChild(document.getElementById('loading-overlay'));
    document.getElementById("title").innerHTML = "your fries are done";
    var workingArea = document.getElementById('working-area');
    workingArea.innerHTML = "";
    if (notFound.length > 0) {
        var ul = document.createElement('ul');
        var li;
        for (var i = 0; i < notFound.length; i++) {
            li = document.createElement('li');
            li.innerHTML = "*** " + notFound[i] + " is broken and was removed from the input below ***";
            ul.appendChild(li);
        }
        workingArea.appendChild(ul);
    }
    var codeBox = document.createElement('textarea');
    codeBox.setAttribute("onclick", "select()");
    codeBox.innerHTML = codeList.join('\n\n');
    var refreshButton = document.createElement('button');
    refreshButton.setAttribute("onclick", "reset()");
    refreshButton.innerHTML = "Spam some more";
    var backButton = document.createElement('button');
    backButton.setAttribute("onclick", "showPrev()");
    backButton.innerHTML = "I messed up!";
    var audio = document.createElement('audio');
    audio.setAttribute("src", "ding.mp3");
    audio.autoplay = true;
    workingArea.appendChild(codeBox);
    workingArea.appendChild(refreshButton);
    workingArea.appendChild(backButton);
    workingArea.appendChild(audio);
}

//back to initial screen
function reset() {
    clear();
    document.getElementById("title").innerHTML = "picspammer";
    document.getElementById('working-area').innerHTML = "";
    displayInitial();
}

//displays previous input
function showPrev() {
    document.getElementById("title").innerHTML = "picspammer";
    document.getElementById('working-area').innerHTML = "";
    displayInitial(rawUrls);
    clear();
}

//clear all the global variables
function clear() {
    urls, codeType, rawUrls = null;
    processedImgs.length = 0;
    notFound.length = 0;
    imgsDone = 0;
}