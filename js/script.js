
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var imgSrc = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + street + ', ' + city;

    //$('body').append('<img class="bgimg" src="'+ imgSrc + '">'); NOT VALID WITHOUT API KEY
    var nytAPI = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=TpMKpyLufUcZ2L9ypvSFjBCR0Tl55dLN';

    $.getJSON(nytAPI, function(data)
    {
        var docs = data["response"]["docs"];
        var $nytArtList = $('#nytimes-articles');
        for (docIndex in docs){
            var $articleElem = $('<li class="article"></li>');
            var $attrElem = $('<a href="'+docs[docIndex]['web_url']+'">'+docs[docIndex]['headline']['main']+'</a>')
            var $parElem = $('<p>'+docs[docIndex]['lead_paragraph']+'</p>')
            $articleElem.append($attrElem);
            $articleElem.append($parElem);
            $nytArtList.append($articleElem);
        }
    }).fail(function(e){
        $nytHeaderElem.text('NYT Articles Cannot Be Loaded');
    });

    var wikiAPI = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrsearch=' + city + '&gsrlimit=15&callback=JSON_CALLBACK';

    var wikiTimeout = setTimeout(function(){
        $wikiElem.text("Wiki Resources Cannot Be Loaded");
    }, 8000);

    $.ajax({
        url: wikiAPI,
        jsonp: "callback",
        dataType: 'jsonp',
        xhrFields: {
            withCredentials: true
        }
    }).done(function(data) {
        console.log(data);
        var pages = data["query"]["pages"];
        var $wikiArtList = $('#wikipedia-links');
        for (pageIndex in pages){
            var $articleElem = $('<li></li>');
            var $attrElem = $('<a href="' + 'http://en.wikipedia.org/?curid=' + pages[pageIndex]['pageid'] + '">'+pages[pageIndex]['title']+'</a>');
            $articleElem.append($attrElem);
            $wikiArtList.append($articleElem);
        }

        clearTimeout(wikiTimeout);
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();
