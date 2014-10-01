// --------------------------------------
var responseCode, authTokenInfo;
var tabId, result, _xhrOAuth, headers;
var statuses;
var tempArray = {};
var _xhrTweet;
var popupId;

// -----------------------------------------------
/* ex.
var hash = CryptoJS.HmacSHA1(Message, Passphrase);
console.log(hash.toString())
*/
var cbClosePopup = function(response) {
    if(response) {
        chrome.windows.getCurrent(cbClose);
    } else {
        alert('Please close current window.\n And retry Authorization.');
    }
};
var cbClose = function(window) {
    chrome.windows.remove(window.id);
};
// --------------------------------------------

var setLocalStorageAll = function(all) {
    for(var c in all) {
        localStorage.setItem(c, all[c]);
    }
};
var cbXhr = function(res) {
    var _arr = res.split('&');
    console.log(_arr);
    for(var i=0;i < _arr.length; i++) {
        var _ele = _arr[i].split('=');
        if(_ele.length === 2) {
            tempArray[_ele[0]] = _ele[1];
        }
    }
    if(tempArray.oauth_token !== undefined) {
        if(tempArray.user_id !== undefined) {
            oauth_info.oauth_token = tempArray.oauth_token;
            oauth_info.oauth_token_secret = tempArray.oauth_token_secret;
            setLocalStorageAll(tempArray);
            console.log('Save oauth token..');
        } else{
            var reqTokenAuthUrl = authorize_uri + '?oauth_token=' + tempArray['oauth_token'];
            console.log('[INFO]RequestAuth: ' + reqTokenAuthUrl);
            chrome.windows.create({
                url: reqTokenAuthUrl,
                type: 'popup',
                width: 600,
                height: 650
            }, function(window){
                popupId = window.id;
            });
        }
    }
};
var setOAuthInfo = function(oauth_info) {
    // Case OAuth Tokens exsits already on localStorage. -> set.
    oauth_info.oauth_token = localStorage.getItem('oauth_token') || '';
    oauth_info.oauth_token_secret = localStorage.getItem('oauth_token_secret') || '';
    console.log('oauth_token: ', oauth_info.oauth_token, '\n oauth_token_secret: ', oauth_info.oauth_token_secret);
};
var cbOnMessage = function(message, sender, sendResponse) {
    console.log('sender', sender);
    console.log('sendResponse', sendResponse);
    console.log('[INFO]MessageType: ', message.type);
    if(message !== undefined && message.type !== undefined){
        console.log('message: ', message);
        console.log('message type: ', message.type);
        switch (message.type) {
        case 'tweet':
            // send your tweet to Twitter's Server.
            //editTweet(message.type, message);
            console.log('retrieve tweet request.');
            sendTweet(message.value, message.type);
            sendResponse();
            break;
        case 'pin_code':
            // get your pin_code.
            var _query = initOAuth(access_token_uri, {'oauth_token': tempArray.oauth_token}, message);
            var _authString = getAuthorizationHeaderString(_query);
            console.log('[INFO] Http Authorization Headers' + _authString);
            var _header = {'Authorization': _authString};
            if(_xhrOAuth && _header) {
                console.log('[INFO]get Access Token. --------------------');
                _xhrOAuth('POST', access_token_uri, '', _header);
            }
            //sendResponse(true);
            /* It can only be used 'Event', 'app', 'csi', 'i8n', 'runtime', 'extension', \
             * 'loadTimes' in chrome.* within contentscript. 
             */
            chrome.windows.remove(popupId);
            break;
        case 'get_tweet_string':
            if(tweetInfo){
                sendResponse(tweet);
            } else {
                sendResponse('Empty');
            }
            break;
        default:
            console.log('[WARN]unknown message.type.');
        }
    } else {
        console.log('[INFO]unknown ?message?');
    }
};

// add runtime (Background proc <-> Foreground proc) 
chrome.runtime.onMessage.addListener(cbOnMessage);
// Start
// -----------------------------------------------
window.onload = function() {
    var _query, oauthHeader;
    if(setOAuthInfo(oauth_info));
    // 
    if(!oauth_info.oauth_token || !oauth_info.oauth_token_secret){
        _xhrOAuth = getXMLHttpRequest(cbOAuth);
        // get authorization OAuth needless query. 
        _query = initOAuth();
        // make Authorization http header.
        var _authString = getAuthorizationHeaderString(_query);
        console.log('[INFO] Http Authorization Headers' + _authString);
        var _header = {'Authorization': _authString};
        console.log('get Request TOken.');
        // get RequestToken.
        _xhrOAuth('POST', request_token_uri, '', _header);
    }
    _xhrTweet = getXMLHttpRequest(cbRestAPI);
    console.log('[INFO]Initiation complete.');
    // add Extension's Event.
    // -----------------------------------------------

    // add "tweet" Button to Chrome ContextMenus
    chrome.contextMenus.create(contextMenusTweet);
    chrome.contextMenus.create(contextMenusCopyTweet);
    //chrome.contextMenus.onClicked.addListener(onclickCopyTweet);
};
