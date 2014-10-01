// file: cpitter.js
// declare functions.
// -------------------------------------------
var sendResponseCopyAndTweet = function(message) {
    console.log('cpitter.js: ' + message.type);
    // message is 'info' object.
    if(message.url !== undefined && message.title !== undefined) {
        chrome.runtime.sendMessage(message);
    } else {
        console.log("Error: no response code.:", message);
    }
};
var cbTweet = function(bl) {
    if(bl) console.log('send Tweet');
};
var formTweetString = function(base) {
    var _s = ''; // limit 140characters...
    var cutString =function(text, len) {
        var t = '';
        var b = true;
        (text.length > len)? len -=3: b=false;
        t += text.substring(0, len);
        if(b) t += '...';
        t +='\n';
        return t;
    };
    console.log(base);
    for(var l in base) {
        console.log(l);
        switch (l) {
        case 'url':
            // 23 charactors...
            _s+= base[l];
            break;
        case 'text':
            // 50 charactors.. trunc over 50s.
            _s += cutString(base[l], 50);
            break;
        case 'title':
            // 50 charactors.. trunc over 50s.
            _s += cutString(base[l], 50);
            break;
        default:
            console.log('Index is: ' + l);
        }
    }
    //_s += ' #cpitter'; // 9charactors...
    console.log(_s);
    return _s;
};

var editTweet = function(key, base) {
    var _tweet = formTweetString(base);
    // call mytwitter.js
    sendTweet(_tweet, key);
};
// Handler onclick in extension.
var onclickTweetHandler = function(info, tab) {
    console.log('onClicked[info]: ', info);
    console.log('onClicked[tab]: ', tab);
    chrome.windows.create(getTweetPageSetting());
};

var onclickCopyTweetHandler = function(info, tab) {
    console.log('onClicked[info]: ', info);
    console.log('onClicked[tab]: ', tab);
    var tweetInfo = {
        'type': 'tweet'
    };
    // get conf for open Twitter.com's webpage.
    var conf = getTweetPageSetting();
    // if exist Context Copy Strings, create 'tweetInfo.text'.
    if(info.selectionText) tweetInfo['text'] = info.selectionText;
    // setting title and url of current web page.
    if(tab.title !== undefined && info.pageUrl !== undefined) {
        tweetInfo['title'] = tab.title;
        tweetInfo['url'] = tab.url;
        // add query to URL.
        conf.url += '?text=' + encodeURIComponent(formTweetString(tweetInfo));
        conf.url += '&hashtags=' + 'test';
        // via=toyopa -> @toyopaさんから
        console.log('conf.url: ', conf.url);
        chrome.windows.create(conf);
    } else {
        console.log('[WARN] Contents is empty.');
    }
};

// define Arguments..
// ----------------------------------------------
var contextMenusTweet = {
    id: 'tweet',
    title: 'tweet',
    contexts: [
        'selection',
        'image',
        'audio',
        'video',
        'page'
    ],
    onclick: onclickTweetHandler
};
//
var contextMenusCopyTweet = {
    id: 'copytweet',
    title: 'copy and tweet',
    contexts: [
        'selection',
        'image',
        'audio',
        'video',
        'page'
    ],
    onclick: onclickCopyTweetHandler
};
var getTweetPageSetting = function(){
    return {
        url: 'https://twitter.com/share',
        width: 500,
        height: 300,
        type: 'popup',
        focused: true
    };
};
