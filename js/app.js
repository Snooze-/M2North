$( document ).ready(function() {
    // This function makes the AJAX call to our PHP page to get weather info and
    // then displays the results on the page.
    getForecastData = function(item) {
        $.get('/forecast.php', { 'zip': item.zip }, function(data) {
            showForecast({
                'city': data.GetCityForecastByZIPResult.City,
                'state': data.GetCityForecastByZIPResult.State,
                'station': data.GetCityForecastByZIPResult.WeatherStationCity,
                'condition': data.GetCityForecastByZIPResult.ForecastResult.Forecast[0].WeatherID,
                'description': data.GetCityForecastByZIPResult.ForecastResult.Forecast[0].Desciption,
                'hightempFahr': data.GetCityForecastByZIPResult.ForecastResult.Forecast[0].Temperatures.DaytimeHigh,
                'lowtempFahr': data.GetCityForecastByZIPResult.ForecastResult.Forecast[0].Temperatures.MorningLow,
                'precipday': data.GetCityForecastByZIPResult.ForecastResult.Forecast[0].ProbabilityOfPrecipiation.Daytime,
                'precipnight': data.GetCityForecastByZIPResult.ForecastResult.Forecast[0].ProbabilityOfPrecipiation.Nighttime,
                'date': data.GetCityForecastByZIPResult.ForecastResult.Forecast[0].Date
            });

            showWeekly(data.GetCityForecastByZIPResult.ForecastResult.Forecast);

            // We have some data, so we can hide the prompt now.
            $("#prompt").fadeOut();
            // We first hide the element with javascript before removing the hidden
            // class, this is so we have a nice fade in effect instead of an ugly
            // pop.
            $("#infobox").hide().removeClass('hidden');
            $("#day-picker").hide().removeClass('hidden');
            $("#infobox").fadeIn();
            $("#day-picker").fadeIn();
        }, 'json');
    };

    // This function is used to show detailed information for a specific day
    showForecast = function(forecastData) {
        if (forecastData.city) {
            $("#city").text(forecastData.city);
        }

        if (forecastData.state) {
            $("#state").text('(' + forecastData.state + ')');
        }

        if (forecastData.station) {
            $("#station").text(forecastData.station);
        }

        // This is another exception, but places such as Beacon, NY sometimes do
        // not have a complete set of tempratures so we need to check for that.
        if (forecastData.hightempFahr) {
            hightempCels = Math.round((parseFloat(forecastData.hightempFahr) - 32) / 1.8000);
        } else {
            hightempCels = '';
        }

        if (forecastData.lowtempFahr) {
            lowtempCels = Math.round((parseFloat(forecastData.lowtempFahr) - 32) / 1.8000);
        } else {
            lowtempCels = '';
        }

        $("#weather-description").text(forecastData.description);
        $("#hightemp-fahr").text(forecastData.hightempFahr);
        $("#lowtemp-fahr").text(forecastData.lowtempFahr);
        $("#hightemp-cels").text(hightempCels);
        $("#lowtemp-cels").text(lowtempCels);
        $("#precipday").text(forecastData.precipday);
        $("#precipnight").text(forecastData.precipnight);

        // We need to set the text to an empty string here in case the
        // previous value was '?'
        $("#selected-glyph").text('');

        switch(forecastData.condition) {
            case 1:
                $("#selected-glyph").attr('class', 'climacon lightning');
                break;
            case 2:
                $("#selected-glyph").attr('class', 'climacon cloud sun');
                break;
            case 3:
            case 14:
                $("#selected-glyph").attr('class', 'climacon cloud');
                break;
            case 4:
                $("#selected-glyph").attr('class', 'climacon sun');
                break;
            case 5:
                $("#selected-glyph").attr('class', 'climacon showers');
                break;
            case 6:
                $("#selected-glyph").attr('class', 'climacon showers sun');
                break;
            case 17:
                $("#selected-glyph").attr('class', 'climacon drizzle sun');
                break;
            case 27:
                $("#selected-glyph").attr('class', 'climacon snow');
                break;
            default:
                // This is pretty rare, but in some cases, such as
                // PRETTY PRAIRIE, KS there may not be a WeatherID for the
                // day
                $("#selected-glyph").attr('class', '');
                $("#selected-glyph").text('?');
        }

        $('#date').text(moment(forecastData.date).format("YYYY-MM-DD"));
    };

    // This function is used to show the summarised forecast for the week and
    // link up the events for the week selector buttons
    showWeekly = function(weeklyData) {
        $(weeklyData).each(function(index) {
            var dailyForcast = this;
            var currentButton = $('#day-picker a').eq(index);

            // We need to set the text to an empty string here in case the
            // previous value was '?'
            currentButton.find('span.day-glyph').text("");

            switch(dailyForcast.WeatherID) {
                case 1:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon lightning');
                    break;
                case 2:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon cloud sun');
                    break;
                case 3:
                case 14:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon cloud');
                    break;
                case 4:
                case 12:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon sun');
                    break;
                case 5:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon showers');
                    break;
                case 6:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon showers sun');
                    break;
                case 17:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon drizzle sun');
                    break;
                case 27:
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph climacon snow');
                    break;
                default:
                    // This is pretty rare, but in some cases, such as
                    // PRETTY PRAIRIE, KS there may not be a WeatherID for the
                    // day
                    currentButton.find('span.day-glyph').attr('class', 'day-glyph');
                    currentButton.find('span.day-glyph').text("?");
            }

            currentButton.find('p.day-date').text(moment(dailyForcast.Date).format("YYYY-MM-DD"));

            // Make each of the days clickable to so more information can be
            // displayed if the user clicks on the day.
            currentButton.click(function() {
                showForecast({
                    'condition': dailyForcast.WeatherID,
                    'description': dailyForcast.Desciption,
                    'date': dailyForcast.Date,
                    'hightempFahr': dailyForcast.Temperatures.DaytimeHigh,
                    'lowtempFahr': dailyForcast.Temperatures.MorningLow,
                    'precipday': dailyForcast.ProbabilityOfPrecipiation.Daytime,
                    'precipnight': dailyForcast.ProbabilityOfPrecipiation.Nighttime
                });
            });
        });
    };

    // We're using the bootstrap3-typehead library to select the correct town
    $.get('/states.json', function(data) {
        $(".typeahead").typeahead({
            source: data,
            displayText: function(item) {
                return item.name + ', ' + item.state;
            },
            afterSelect: getForecastData
        });
    }, 'json');
});
