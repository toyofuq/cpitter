// ---------------------------------------
var value = {};
// --------------------------------------------
var sendResponseCode = function(value) {
    console.log('send pin_code');
    if (value !== undefined) {
        value.type = 'pin_code';
        chrome.runtime.sendMessage('', value, {});
    } else {
        console.log("Error: no response code.");
    }
};

var code = document.getElementsByTagName('code')[0].innerText;
value['pin_code'] = code;
if(value.pin_code !== undefined) {
    console.log('[info]Pin code: ' + value.pin_code);
    console.log('chrome: ', chrome);
    sendResponseCode(value);
    alert('This window will be automatically deleted.');
} else {
    alert('Failed: Get a response code.\n Please retry once.');
}
