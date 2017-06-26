var page = require('webpage').create();
var cheerios = require("cheerio");
page.onConsoleMessage = function(msg) {console.log('CONSOLE: ' + msg)}
page.onUrlChanged = function(targetUrl) {console.log('New URL: ' + targetUrl)}
page.onResourceReceived = function(response) {
    if (response.stage !== "end") return;
    console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + response.url);
};
page.onResourceRequested = function(requestData, networkRequest) {
    console.log('Request (#' + requestData.id + '): ' + requestData.url);
};
page.onUrlChanged = function(targetUrl) {
    console.log('New URL: ' + targetUrl);
};
page.onLoadFinished = function(status) {
    console.log('Load Finished: ' + status);
    page.includeJs('https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js', function() {

    })
};
page.onLoadStarted = function() {
    console.log('Load Started');
};
page.onNavigationRequested = function(url, type, willNavigate, main) {
    console.log('Trying to navigate to: ' + url);
};


page.open("http://cachedview.com/", function(status){
    if(status==="success"){
        page.evaluate(function () {
            document.getElementById("inputUrl").value = "http://shop.tcgplayer.com/price-guide/magic/aether-revolt";
            document.querySelector(".btn-success").click();
        })

        // setTimeout(function() {
        //     // page.includeJs('https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js', function(){
        //         page.evaluate(function() {
        //             console.log(document.querySelector("#maincontentinnerpadding a"));
        //             // var $collectionPage = cheerio.load(resMainPage.content, {decodeEntities: false});
        //             // var collectionTable = $collectionPage("#collectionContainer");
        //         })
        //     // })
        //     console.log("Second Page");
        //    phantom.exit();
        // }, 20000);
    }else{
        console.log(status);
        phantom.exit();
    }
})


