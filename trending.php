<?php

// generate some trending items to display in advertising on dtbaker.net


// add your personal token here from build.envato.com
$token = 'PUT YOUR TOKEN HERE';

?>
<html>
<head>
	<title>Trending</title>
	<link rel="stylesheet" href="trending.css">
</head>
<body>

<div class="trending-wrapper">

<div class="trending-header">
	<ul class="trending-menu">
		<li><h2>This Weeks Most Popular:</h2></li>
		<li class="current"><a href="" data-category="wordpress" data-site="codecanyon.net">WordPress Plugins</a></li>
		<li><a href="" data-category="wordpress" data-site="themeforest.net">WordPress Themes</a></li>
		<li><a href="" data-category="php-scripts" data-site="codecanyon.net">PHP Scripts</a></li>
		<li><a href="" data-category="" data-site="videohive.net">Video Clips</a></li>
		<li><a href="" data-category="" data-site="audiojungle.net">Music &amp; Sound Effects</a></li>
	</ul>
</div>
<div class="trending-items">
	<div class="loading-anim">Loading&#8230;</div>
	<ul class="item-grid">
	</ul>
</div>

</div>

<script id="item-template" type="text/x-handlebars-template">
	<li>
		<div class="thumbnail">
			<div class="item-thumbnail">
				<div class="item-thumbnail__image">
					<a href="go.php?site={{site}}&id={{id}}" target="_blank"><img border="0" data-preview-url="{{preview_image_url}}" src="{{preview_thumb_url}}" data-tooltip="{{name}}"></a>
				</div>
				<div class="item-thumbnail-actions">
					<ul class="item-thumbnail-actions__list">
						<li class="more-details">
							<a href="go.php?site={{site}}&id={{id}}" target="_blank">More Details</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="item-info">
			<h3>
				<a href="go.php?site={{site}}&id={{id}}" target="_blank">{{name}}</a>
			</h3>
		</div>
		<div class="sale-info">
			<div class="rating">
				<div class="rating-basic">
					<div class="rating-basic__stars">
						{{#if star_rating}}
							{{#each star_rating}}
								<img src="{{this}}">
							{{/each}}
						{{/if}}
					</div>
				</div>
			</div>
			<small class="sale-count">{{number_of_sales}} Sales</small>
			<small class="price">${{item_price}}</small>
		</div>
	</li>
</script>

<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="handlebars-v4.0.2.js"></script>
<script type="text/javascript" src="trending.js"></script>
<script>
	jQuery(function(){
		// start the magic:
		dtbaker_envato_trending.set_config({
			envato_personal_token: '<?php echo $token;?>',
			ref: 'dtbaker'
		});
		dtbaker_envato_trending.init();
		dtbaker_envato_trending.ui.init();
		dtbaker_envato_trending.ui.load_trending_items('codecanyon.net','wordpress');
	});
</script>

</body>
</html>