<?php

require_once(implode(DIRECTORY_SEPARATOR, array(__DIR__, krumo, 'class.krumo.php')));

$client = new SoapClient("http://wsf.cdyne.com/WeatherWS/Weather.asmx?WSDL");

krumo($client->__getFunctions());
