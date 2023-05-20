browser.runtime.onMessage.addListener(talk);

function talk(request, sender, sendResponse) {
    console.log("can you hear me")
    
}



  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "alert") {
      alert("here I am")
    } else {
      console.log("couldn't find it")
    }
  });