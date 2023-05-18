let getter_button = document.querySelector('#get-button');
let setter_button = document.querySelector('#set-button');
let clear_button = document.querySelector('#clear-button');
let encrypt_symbol = document.querySelector('.encrypt-symbol')
let session_text = document.querySelector('#session_text')
let warning_text = document.querySelector(".warning-text") 

let passphrase = self.crypto.randomUUID();
let passphrase_input = document.querySelector('#passphrase-input')
passphrase_input.value = passphrase
passphrase_input.addEventListener("keyup", updatePassphrase);
function updatePassphrase(e) {
    passphrase = passphrase_input.value
}

let encrypt_status_change_button = document.querySelector('.encrypt-status-btn')
let encrypt_state = false;

session_text.addEventListener("keyup", checkValidJson);
function checkValidJson(e) {
    if (encrypt_state) {
        warning_text.innerHTML = ""
        setter_button.disabled = false
    } else {
        try {
            JSON.parse(session_text.value)
            warning_text.innerHTML = ""
            setter_button.disabled = false
        } catch (error) {
            warning_text.innerHTML = "Input text is not valid JSON"
            setter_button.disabled = true
        }  
    }
    
}

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

encrypt_status_change_button.onclick = function(e){
    encrypt_state = !encrypt_state
    // document.querySelector('.unencrypted').hidden = encrypt_state
    document.querySelector('.encrypted').hidden = !encrypt_state
    encrypt_symbol.innerText = encrypt_state ? "lock" : "lock_open"
    checkValidJson(null)
}

getter_button.onclick = function(e){
    getActiveTab().then((tabs) => {
        browser.cookies.getAll({
            url: tabs[0].url
        }).then( (cookies) => {
            let cookie_str = JSON.stringify(cookies)
            if (encrypt_state) {
                let crypt_cookies = CryptoJS.AES.encrypt(cookie_str, passphrase).toString();
                session_text.innerHTML = crypt_cookies
                console.log(`encrypting with ${passphrase}` );
            } else {
                session_text.innerHTML = cookie_str
            }
            checkValidJson(null)
        });        
    });
}

setter_button.onclick = function(e){
    document.querySelector('.loading').hidden = false
    document.querySelector('.loaded').hidden = true
    getActiveTab().then((tabs) => {
        var cookie_text = session_text.value
        if (encrypt_state) {
            try {
                passphrase = passphrase_input.value
                var bytes  = CryptoJS.AES.decrypt(cookie_text, passphrase);
                var decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            } catch (error) {
                console.log("error caught")
                cookie_ary = []
                alert(`(Incorrect Password) ${error}`)  
            }
        } else {
            var decryptedText = cookie_text
        }
        
        try {
            var cookie_ary = JSON.parse(decryptedText)
        } catch (error) {
            cookie_ary = []
            alert(`Your JSON string is malformed, try using a JSON linter on your input text. (${error})`)
        }

        for(cookie of cookie_ary){
            Object.assign(cookie, {url: tabs[0].url})
            delete cookie.hostOnly
            delete cookie.session
            delete cookie.firstPartyDomain
            delete cookie.partitionKey
            delete cookie.storeId
            delete cookie.sameSite
            console.log("setting cookie: " + JSON.stringify(cookie))
            browser.cookies.set(cookie)
        }
        document.querySelector('.loading').hidden = true
        document.querySelector('.loaded').hidden = false
        browser.tabs.reload();
    });        
}

clear_button.onclick = function(e){
    document.querySelector('.loading').hidden = false
    document.querySelector('.loaded').hidden = true
    getActiveTab().then((tabs) => {
        browser.cookies.getAll({
            url: tabs[0].url
        }).then( (cookies) => {
            for (const cookie of cookies) {
                browser.cookies.remove({
                    url: tabs[0].url,
                    name: cookie.name
                })
            }
            document.querySelector('.loading').hidden = true
            document.querySelector('.loaded').hidden = false
            console.log("cleared cookies")
            browser.tabs.reload();
        });
        
    });
}
  