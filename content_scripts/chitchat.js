browser.runtime.onMessage.addListener(talk);

function talk(request, sender, sendResponse) {
    console.log("can you hear me")
    document.querySelector('#session_text').innerHTML = request 
}