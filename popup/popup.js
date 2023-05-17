let getter_button = document.querySelector('#get-button');
let setter_button = document.querySelector('#set-button');
let clear_button = document.querySelector('#clear-button');
console.log("I see this");
function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

getter_button.onclick = function(e){
    console.log("and this");
    getActiveTab().then((tabs) => {
        browser.cookies.getAll({
            url: tabs[0].url
        }).then( (cookies) => {
            logCookies(cookies)
            document.querySelector('#session_text').innerHTML = JSON.stringify(cookies)
            // browser.tabs.sendMessage(tabs[0].id, {cookies: JSON.stringify(cookies)});
        });

        
    });
}

setter_button.onclick = function(e){
    document.querySelector('.loading').hidden = false
    document.querySelector('.loaded').hidden = true
    getActiveTab().then((tabs) => {
        let cookie_text = document.querySelector('#session_text').value
        let cookie_ary = JSON.parse(cookie_text)
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

function logCookies(cookies) {
    console.log("cookers");
    console.log(JSON.stringify(cookies))
    // for (const cookie of cookies) {
    //     console.log(cookie.value);
    // }
}
  

  