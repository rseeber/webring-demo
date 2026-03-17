/*
(async () => {

    let feed = await parser.parseURL(CORS_PROXY + feedLink, function(err, feed){
        if (err){ 
            console.log("error");
            throw err;
        }
    });

    console.log(feed.title);

    //iterate through each entry in the current rss/xml file
    feed.items.forEach(entry => {
        entry.feed = feed;
        // append the blog entry to the list of posts
        //posts.push({"feedLink": feed.link, "feedTitle": feed.title, "title": entry.title, "link": entry.link, "timestamp": entry.timestamp});
        //posts.push("yeyea");
        posts.push(entry);
        console.log("[41]: "+ entry);

        //addListItem(entry.link, feed.title + ": " + entry.title);
    });

})();
*/

// fetch the rss feed, and parse it
function fetchRss(feedLink){
    console.log("fetchRss() START");
    feed = parser.parseURL(CORS_PROXY + feedLink, function(err){
        if (err){ 
            console.log("error");
            throw err;
        }
    });
    console.log("fetchRss() END");

    return Promise.resolve(feed);
}

function getRssFeeds(feeds){
    let posts = new Array();
    let feed;

    //iterate for each rss feed
    feeds.forEach(async feedLink => {

        fetchRss(feedLink).then(
            function() {
                console.log(feed.title);
            }).then(
                function() {
                    //iterate through each entry in the current rss/xml file
                    feed.items.forEach(entry => {
                        entry.feed = feed;
                        // append the blog entry to the list of posts
                        posts.push(entry);
                        console.log("[41]: "+ entry);
                    });

                }).then(
                    function() {
                        return Promise.resolve(posts);
                    });


    });
}

function old_getRssFeeds(feeds){
    let posts = new Array();

    //iterate for each rss feed
    feeds.forEach(feedLink => {
        
        //parse the current rss/xml file
        parser.parseURL(CORS_PROXY + feedLink, function(err, feed) {
            if (err){ 
                console.log("error");
                throw err;
            }
            console.log(feed.title);
            feed.items.forEach(function(entry) {
                entry.feed = feed;
                // append the blog entry to the list of posts
                //posts.push({"feedLink": feed.link, "feedTitle": feed.title, "title": entry.title, "link": entry.link, "timestamp": entry.timestamp});
                //posts.push("yeyea");
                posts.push(entry);
                console.log("[41]: "+ entry);

                //addListItem(entry.link, feed.title + ": " + entry.title);
            })
        })
    });

    return Promise.resolve(posts);
}

function addListItem(url, pageText){
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = url;
    const text = document.createTextNode(pageText);
    //<li><a>page text</a></li>
    li.appendChild(link);
    link.appendChild(text);
    document.getElementById("webring-list").appendChild(li);
}

async function loadWebringIndex() {
    

    let posts = getRssFeeds(feeds).then(
        function() {
            //sort posts in reverse-chronological order
            //[TODO]

            console.log("posts len = " + posts.length);

            // this is failing cuz of a race condition. 
            // We need to await the feeds being handled before we run this for loop
            posts.forEach(entry => {
                console.log("[52]: "+ entry);
                addListItem(entry["link"], entry["feed.title"] + ": " + entry["title"]);
            });
        });


}

// Note: some RSS feeds can't be loaded in the browser due to CORS security.
// To get around this, you can use a proxy.
//const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
const CORS_PROXY = "";

const feeds = ["https://pluralistic.net/feed/"];

let parser = new RSSParser();

loadWebringIndex();