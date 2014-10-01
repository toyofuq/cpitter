var yourtweet;
// -------------------------------
var closePopup = function() {
    chrome.windows.getCurrent(cbClose);
};
var cbClose = function(window) {
    chrome.windows.remove(window.id);
};

var sendBackground = function(value) {
    var message = {}; 
    message.value = value;
    message.type = 'tweet';
    console.log('sendBackground');
    chrome.runtime.sendMessage('', message, {}, closePopup);
};

var submit = function() {
    if(yourtweet.value !== undefined && yourtweet.value !== '') {
        sendBackground(yourtweet.value);
    } else {
        alert('tweet is empty....');
    }
    //return ;
};

var getBackgroundInfo = function(){
    var message = {};
    message.type = 'get_tweet_string';
    chrome.runtime.sendMessage('', message, {}, function(text){yourtweet.value = text;});
};

// Initiation "Tweet Window(Popup)".
// ------------------------------------------
window.onload = function(){
    var cancelBtn = document.getElementById("cancel");
    var tweetBtn = document.getElementById("tweet");
    yourtweet = document.getElementById("yourtweet");

    cancelBtn.addEventListener('click', closePopup);
    tweetBtn.addEventListener('click', submit);

    getBackgroundInfo();
};

