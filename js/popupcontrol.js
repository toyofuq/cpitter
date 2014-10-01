// file: 
// -------------------------------------------
var closeWindow = function() {
    chrome.windows.getCurrent(function(window){
        chrome.windows.remove(window.id);
    });
};
var sendBackgroundPage = function(value) {
    var message = {}; 
    message.value = value;
    message.type = 'tweet';
    console.log('sendBackgroundPage');
    chrome.runtime.sendMessage('', message, {}, cbClose);
};

var submitTweet = function() {
    if(yourtweet.value !== undefined && yourtweet.value !== '') {
        sendBackgroundPage(yourtweet.value);
    } else {
        alert('tweet is empty....');
    }
};

var getBackgroundInfo = function(){
    var message = {};
    message.type = 'get_tweet_string';
    chrome.runtime.sendMessage('', message, {}, function(text){
        yourtweet.value = text;
    });
};

// Initiation "Tweet Window(Popup)".
// ------------------------------------------------------
var yourtweet;
window.onload = function(){
    var cancelBtn = document.getElementById("cancel");
    var tweetBtn = document.getElementById("tweet");
    yourtweet = document.getElementById("yourtweet");

    //
    cancelBtn.addEventListener('click', closeWindow);
    tweetBtn.addEventListener('click', submitTweet);

    // 
    getBackgroundInfo();
};

