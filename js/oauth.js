// ----------------------------------------------
// sort Object's property name.
var sortObj = function(org) {
    var sorted = {};
    var sortTmp = [];
    for (var i in org) {
        sortTmp.push(i);
    }
    //console.log(sortTmp);
    sortTmp.sort();
    //console.log(sortTmp);
    for (var i=0; i < sortTmp.length; i++) {
        sorted[sortTmp[i]] = org[sortTmp[i]];
    }
    return sorted;
};
// return randoom strings your specified length.
var genRandomString = function(len) {
    var randomBase = '0123456789abcdef';
    // NG
    //var randomBase = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var randomBaseMax = randomBase.length - 1;
    var s = '';
    for(var i=0; i < len; i++) {
        // 0 is min-index, baseString, randomBase[0~(length-1)]
        //s += Math.random() * (randomBaseMax - 0) + 0;
        s += randomBase[Math.floor(Math.random() * (randomBaseMax))];
    }
    return s;
};
// Base64.
var base64encoded = function(str) {
    return window.btoa(str);
};
var base64decoded = function(str) {
    return window.atob(str);
};
// For application based.
// for twitter.
var params = {
    'grant_type': 'client_credentials'
}; 
var AuthorizationHttpHeaders = {
    // ex. 
    // need to add after 'Basic ' + <bearer token>...
    'Authorization': ''
};
// --------------------------------------------------------
var concatParam = function(params) {
    var param = '';
    for(var p in params) {
        param += (p + '=' + params[p] + '&');  
    };
    return param.substring(0, param.length-1);
};
var getAuthorizationHeaderString = function(prm){
    var param = '';
    for(var p in prm) {
        param += (p + '="' + prm[p] + '",');  
    };
    return 'OAuth ' + param.substring(0, param.length-1);
};
var getSignatureBaseString = function(prm, uri, method) {
    var _method = encodeURIComponent(method);
    var _len = uri.search(/\?/) || undefined;
    var _uri = (_len !== -1)? encodeURIComponent(uri.substring(0, _len)): encodeURIComponent(uri);
    var tmp_param = concatParam(prm);
    var _param = encodeURIComponent(tmp_param);
    return (_method + '&' + _uri + '&' + _param);
};
var getSignature = function(base) {
    // return signature for oauth.
    var _key = oauth_info.oauth_consumer_secret + '&' + oauth_info.oauth_token_secret;
    var _hash = CryptoJS.HmacSHA1(base, _key);
    var _s = _hash.toString(CryptoJS.enc.Base64);
    //return _s;
    return encodeURIComponent(_s);
};

var initOAuth = function(urls, options, response) {
    var reqQuery;
    var _url = urls || request_token_uri;
    reqQuery = getRequestTokenUriParam();
    var _headers;
    delete reqQuery.oauth_callback;
    _headers = function() {
        var _reqQuery = {};
        for(var c in reqQuery) {
            console.log(c);
            _reqQuery[c] = reqQuery[c];
        }
        return _reqQuery;
    }();
    if(options) {
        console.log(options);
        if(localStorage.getItem('oauth_token')) {
            console.log('GET LOCALSTORAGE...')
            reqQuery['oauth_token'] = localStorage.getItem('oauth_token');
            _headers['oauth_token'] = reqQuery['oauth_token'];
        } else {
            console.log('copy oauth token by options...');
            reqQuery['oauth_token'] = options['oauth_token'];
            _headers['oauth_token'] = reqQuery['oauth_token'];
            delete options.oauth_token;
        }
        console.log('[INFO]add Options. ---------------------');
        if(response !== undefined && response.pin_code !== undefined){
            reqQuery['oauth_verifier'] = response.pin_code;
            _headers['oauth_verifier'] = reqQuery['oauth_verifier'];
        }
        for(var op in options) {
            console.log(op);
            reqQuery[op] = options[op];
        }

        //oauth_info.oauth_token = options.oauth_token;
        //oauth_info.oauth_token_secret = options.oauth_token_secret;
    }
    console.log('BEFORE baseString: ');
    console.log(reqQuery);
    var _baseString = getSignatureBaseString(sortObj(reqQuery), _url, 'POST');
    console.log("[INFO] baseString: " + _baseString);
    var _signature = getSignature(_baseString);
    console.log("[INFO] raw signature: " + _signature);
    if(_signature !== undefined) {
        _headers['oauth_signature'] = _signature;
        console.log('[INFO] oauth_signature: ' + _headers.oauth_signature);
        return _headers;
        /*
        var _authString = getAuthorizationHeaderString(reqTokenParam);
        return {'Authorization': _authString};
        */
    } else {
        console.log('[WARN] oauth_signature is none.');
    }
};
