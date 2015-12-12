<?php

$sites = array(
	'themeforest.net',
	'codecanyon.net',
	'3docean.net',
	'audiojungle.net',
);

$file = 'track-'.date('Y-m-d').'.txt';

$track = @json_decode(file_get_contents($file),true);
if(!is_array($track))$track=array();

$site = isset($_GET['site']) && in_array($_GET['site'],$sites) ? $_GET['site'] : false;
$id = isset($_GET['id']) ? (int)$_GET['id'] : false;
if($site && $id){
	$track[] = array(
		'ip' => $_SERVER['REMOTE_ADDR'],
		'id' => $id,
		's' => $site,
		't' => time(),
	);
	file_put_contents($file,json_encode($track));
	header("Location: http://".$site.'/item/x/'.$id.'?ref=dtbaker');
}else{
	header("Location: http://dtbaker.net");
}
