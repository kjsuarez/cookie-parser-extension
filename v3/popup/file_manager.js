export { downloadJson }

function downloadJson(str) {
    var file = new File([str], "cookies.json")
    var file_url = URL.createObjectURL(file)
    let downloading = browser.downloads.download({
        url: file_url,
        filename: "cookies.json"
    })

    downloading.then((id) => {
        console.log(`Started downloading: ${id}`);
        browser.downloads.onChanged.addListener(fileCompleted)
        function fileCompleted(downloadDelta) {
            if (downloadDelta.id == id) {
                console.log(`download url to be revoked: ${file_url}`);
                URL.revokeObjectURL(file_url);
            }
        }
    });
}

