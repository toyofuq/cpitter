/*
// -------------------------------------------
var startConnect = function(){
    SC.connect(function(){
        console.log("test");
        console.log("connect");
        
    });
};
var oauthSC = function() { 
    SC.initialize(
        {
            client_id: client_info.client_id,
            redirect_uri: client_info.redirect_uri
        }
    );
    //startConnect();
    SC.connect(function(){
        SC.get('/me', 
               function(me){
                   console.log(me); 
               });
    });
    console.log("connect");
};
var bg, me;
var dom;
// onStart.
window.onload = function() {
    bg = chrome.extension.getBackgroundPage();
    // localStorageは同一extension内で共有可能.
    if(!localStorage.getItem('access_token')) {
        console.log('[GET]: access_token');
        oauthSC();
    } else {
        access_token = localStorage.getItem('access_token');
        console.log('[your access_token]: ' + access_token);
    }
};
*/
