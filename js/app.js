$( document ).ready(function() {
    // We're using the bootstrap3-typehead library to select the correct town
    $.get('/states.json', function(data){
        $(".typeahead").typeahead({
            source: data,
            displayText: function(item) {
                return item.name + ', ' + item.state;
            }
        });
    },'json');
});
