// ========================================
var rest_uri = {
    home_timeline: {
        uri: 'statuses/home_timeline.json',
        method: 'GET',
        callback: undefined
    },
    tweet: {
        uri: 'statuses/update.json',
        method: 'POST',
        callback: undefined
    },
    tester: {
        uri: 'rt',
        method: 'POST',
        callback: undefined
    }
};
// REST API'S functions.
var sendTweet = function(tweet, restapi) {
    var _uri = api_uri + rest_uri[restapi].uri;
    var _options = {
        'status': encodeURIComponent(tweet)
    };
    // set HttpRequest's body required for 'POST'.
    var _body = concatParam(_options);
    console.log('[INFO] _body: ', _body);
    var _query = initOAuth(_uri, _options);
    var _authString = getAuthorizationHeaderString(_query);
    var _header = {'Authorization': _authString};
    console.log(_header);
    // call xhr.js
    _xhrTweet(rest_uri[restapi].method, _uri, _body, _header);
};
