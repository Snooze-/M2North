$( document ).ready(function() {
    // This function makes the AJAX call to our PHP page to get weather info and
    // then displays the results on the page.
    showForecast = function(item) {
        $.get('/forecast.php', { 'zip': item.zip }, function(data) {
            console.log(data);
        }, 'json');
    };

    // We're using the bootstrap3-typehead library to select the correct town
    $.get('/states.json', function(data) {
        $(".typeahead").typeahead({
            source: data,
            displayText: function(item) {
                return item.name + ', ' + item.state;
            },
            afterSelect: showForecast
        });
    }, 'json');
});
