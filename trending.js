
var dtbaker_envato_trending = (function ($) {
    // copyright @dtbaker

    var config = {
        api_url: 'https://api.envato.com/',
        envato_personal_token: '',
        app_version: 1
    };
    var consoleHolder = console;
    var init_callbacks = [];

    return {
        get_config: function(name){return typeof name != 'undefined' ? config[name] : config;},
        set_config: function(name,value){
            if(typeof name == 'object'){
                for(var i in name){
                    if(name.hasOwnProperty(i)){
                        this.set_config(i, name[i]);
                    }
                }
            }
            if(typeof config[name] != 'undefined') {
                config[name] = value;
            }
        },
        get_storage: function(name){
            var s = localStorage.getItem(name);
            if(s)return JSON.parse(s);
            return false;
        },
        set_storage: function(name,value){
            localStorage.setItem(name, JSON.stringify(value));
        },
        init: function () {
            // code

            this.debug(true);

            while(init_callbacks.length > 0){
                var f = init_callbacks.pop();
                if(typeof f == 'function'){
                    f();
                }
            }

            return true;
        },
        add_init: function(func){
            init_callbacks.push(func);
        },
        debug: function(bool){
            if(!bool){
                consoleHolder = console;
                console = {};
                console.log = function(){};
                console.debug = function(){};
            }else
                console = consoleHolder;
        },
        util: {
            getParameterByName: function(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            },
            shuffle: function(o) {
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
        }
    };

})(jQuery);


// UI
(function (dtbaker_envato_trending, $) {
    dtbaker_envato_trending.ui = (function (t) {
        var $trending_items = $('.trending-items');
        var $trending_items_list = $trending_items.find('.item-grid');
        var $trending_menu = $('.trending-menu');
        return {
            init: function(){
                $trending_menu.on('click','a',function(){
                    var $li = $(this).parents('li').first();
                    $trending_menu.find('.current').removeClass('current');
                    $li.addClass('current');
                    t.ui.load_trending_items($(this).data('site'),$(this).data('category'));
                    return false;
                });
            },
            load_trending_items: function(site, category){
                $trending_items.addClass('loading');
                $trending_items_list.html('');
                t.api('v1/discovery/search/search/item',{
                    site:site,
                    category:category,
                    sort_by:'trending',
                    sort_direction:'desc'
                },function(result){
                    if(result && result.matches && result.matches.length) {
                        var random_matches = t.util.shuffle(result.matches);
                        var source   = $("#item-template").html();
                        var template = Handlebars.compile(source);
                        for (var i = 0; i < random_matches.length; i++) {
                            var item_data = random_matches[i];
                            var thumb = false, preview = false;
                            for(var th in item_data.previews){
                                if(item_data.previews.hasOwnProperty(th)){
                                    if(typeof item_data.previews[th].icon_url != 'undefined'){
                                        thumb = item_data.previews[th].icon_url;
                                    }
                                    if(typeof item_data.previews[th].landscape_url != 'undefined'){
                                        preview = item_data.previews[th].landscape_url;
                                    }
                                }
                            }
                            if(!preview){
                                // look for square_url
                                for(var th in item_data.previews){
                                    if(item_data.previews.hasOwnProperty(th)){
                                        if(typeof item_data.previews[th].square_url != 'undefined'){
                                            preview = item_data.previews[th].square_url;
                                        }
                                    }
                                }
                            }
                            item_data.preview_thumb_url = thumb;
                            item_data.preview_image_url = preview;
                            item_data.item_price = parseInt(item_data.price_cents / 100);
                            item_data.star_rating = [];
                            if(item_data.rating.rating > 1) {
                                for (var rate = 0; rate < 5; rate++) {
                                    if (rate <= item_data.rating.rating) {
                                        item_data.star_rating.push('//dmypbau5frl9g.cloudfront.net/assets/common/icons-buttons/rating/star-on-8522c30d5f8ae26075388a048547e0aa.png');
                                    } else {
                                        if (rate - 0.999 > item_data.rating.rating) {
                                            item_data.star_rating.push('//dmypbau5frl9g.cloudfront.net/assets/common/icons-buttons/rating/star-off-df75d137e471fa935adc4de8906072f6.png');
                                        } else {
                                            item_data.star_rating.push('//dmypbau5frl9g.cloudfront.net/assets/common/icons-buttons/rating/star-half-9f8b96449cfde41580c89a1c85359741.png');
                                        }
                                    }
                                }
                            }
                            var html    = template(item_data);
                            $trending_items_list.append(html);
                        }
                        $trending_items.removeClass('loading');
                    }
                });
            }
        };
    })(dtbaker_envato_trending);
    return dtbaker_envato_trending;
})(dtbaker_envato_trending || {}, jQuery);


// API
(function (dtbaker_envato_trending, $) {
    dtbaker_envato_trending.api = function(endpoint, data, callback){
        var t = this;
        $.ajax({
            type: "GET",
            url: t.get_config('api_url') + endpoint,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + t.get_config('envato_personal_token'));
            },
            data: data,
            success: function (result) {
                if (result.status == 'error') {
                    console.log('API error: ', false);
                    console.log(result, false);
                }
                if (typeof callback == 'function') {
                    callback(result);
                }
            },
            error: function () {
                console.log('API js error', false);
                if (typeof callback == 'function') {
                    callback(false);
                }
            },
            dataType: 'json'
        });
    };
    return dtbaker_envato_trending;
})(dtbaker_envato_trending || {}, jQuery);
