<?php

require_once(implode(DIRECTORY_SEPARATOR, array(__DIR__, krumo, 'class.krumo.php')));

$client = new SoapClient("http://wsf.cdyne.com/WeatherWS/Weather.asmx?WSDL");

$forecast = $client->GetCityForecastByZIP(array('ZIP' => $_GET['zip']));

if (strpos($_SERVER['HTTP_ACCEPT'], 'application/json') === false ) {
    // This isn't a JSON reqeust so let's give the user a nice readible result
    krumo($forecast);
} else {
    // The user asked for json formatted text so let's give it to them
    print(json_encode($forecast));
}
