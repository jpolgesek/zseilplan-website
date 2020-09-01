<?php

if (isset($_GET["new"])){
    $data = file_get_contents('php://input');
}else{
    die();
}

$data = json_decode($data);

$file = file_get_contents(".htsubscriptions.json");
$subscriptions = json_decode($file, true);

/*
if (!is_array($subscriptions)){
    $subscriptions = Array();
    print("CREATING NEW!");
}
*/


$subscriptions[end(explode("/",$data->endpoint))] = $data;
file_put_contents(".htsubscriptions.json", json_encode($subscriptions));

?>