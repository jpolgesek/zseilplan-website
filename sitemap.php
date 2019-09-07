<?php
$raw_data = file_get_contents("data.json");
$data = json_decode($raw_data, true);

$base_text = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
$base_url = explode(basename(__FILE__), "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}");
$base_url = $base_url[0];

$last_mod = explode(" ", $data["comment"]);
$last_mod = explode(".", $last_mod[1]);
$last_mod = $last_mod[2] . "-" . $last_mod[1] . "-" . $last_mod[0];

$xml = new SimpleXMLElement($base_text);

function addURL(&$xml, $url){
	global $base_url, $last_mod;
    $track = $xml->addChild('url');
    $track->addChild('loc', $base_url . $url);
    $track->addChild('lastmod', $last_mod);
}

addURL($xml, "");

foreach ($data['teachermap'] as $short => $long) {
	$long = strtolower($long);
	$long = str_ireplace(" ", "-", $long);
	if (!strpos($long, "brak") && !strpos($long, "#")){
		addURL($xml, "nauczyciel/$long");
	}
}

foreach ($data['classrooms'] as $room) {
    if (!strpos($long, "@")) {
        addURL($xml, "sala/$room");
    }
}

foreach ($data['units'] as $unit) {
    addURL($xml, "klasa/$unit");
}

Header('Content-type: text/xml');
print($xml->asXML());