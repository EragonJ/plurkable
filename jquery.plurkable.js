/*
 * plurkable - lightweight jQuery plugin for customizing Plurk widgets
 *
 * Version : 1.1
 * Author  : EragonJ | 陳佳隆
 * Email   : eragonj@hax4.in | jack.xxlong@gmail.com
 * Blog    : http://eragonj.hax4.in
 *
 */
(function() {

    var _this = null;

    var _settings = {
        num          : 20,
        username     : 'Plurkbuddy',
        show_link    : true,
        show_date    : true,
        date_format  : 'yyyy/mm/dd HH:MM:ss'
    };

    function init() {

        // Get the actual $feed
        eval("var feed = " + fetch_feed(_settings.username));

        // Get the feed_info after parsing and modifications
        var feed_info = parse_feed(feed.value.items);

        build_structure_of(feed_info);
    }
    
    // Use my customized Yahoo Pipe's 
    function fetch_feed(account) {

        var feed = $.ajax({
            async   : false,
            url     : 'http://pipes.yahoo.com/pipes/pipe.run?_id=4cce1c85385491e7bfc90071fbd820cf&_render=json',
            data    : "username="+account,
            error   : function() {
                throw "forbidden User , plz check your username!";
            },
            success : function(data) {
                return data;
            }
        }).responseText;

        return feed;
    }

    function parse_feed(feed) {

        var feed_info = {
            pid     : [],
            content : [],
            link    : [],
            date    : [],
            length  : feed.length
        };

        for (var i = 0; i < feed.length; i++) {
            feed_info.pid.push( feed[i].id );
            feed_info.content.push( feed[i].content.content );
            feed_info.link.push( feed[i].link );
            feed_info.date.push( feed[i].published );
        }

        process(feed_info);
        return feed_info;
    }

    function process(feed_info) {

        process_pid(feed_info.pid);
        process_date(feed_info.date); 
    }

    function process_pid(pid) {

        var re = /;(\d+)$/;
        for (var i=0; i<pid.length; i++) {
            pid[i] = (pid[i].match(re))[1];
        }
    }

    function process_date(date) {

        // support formats as users wish
        for (var i=0; i<date.length; i++) {

            var current_date = new Date(date[i]);

            // powered by Steven Levithan's format lib
            if ( typeof Date.prototype.format != 'undefined') {
                date[i] = current_date.format(_settings.date_format);
            }
            else {
                // default 
                date[i] = current_date.toLocaleDateString();
            }
        }
    }

    // DOM manipulating
    function build_structure_of(info) {

        $('<ul class="plurkList"></ul>').appendTo($_this);

        for (var i=0; i<info.length && i<_settings.num; i++) {
            var cache_block     = $('<li class="plurk_block"></li>');

            // We must have contents , right ?
            cache_block.append('<p class="plurk_content">'+info.content[i]+'</p>');
            cache_block.append('<p class="plurk_options"><span class="plurk_link"></span><span class="plurk_date"></span></p>');

            if (true == _settings.show_link) {
                cache_block.find(".plurk_link").html('<a href="'+info.link[i]+'" target="_blank">Details</a> ');
            }
            
            if (true == _settings.show_date) {
                cache_block.find(".plurk_date").html(info.date[i]);
            }

            cache_block.appendTo(".plurkList");
        }
    }

    $.fn.plurkable = function(options) {

        $(this).each(function() {

            // default settings
            $.extend(_settings,options); 
            $_this = $(this);

            // in order to manipulate <div id="plurkable"></div>
            init.apply($_this);
        });

        return this;
    };

})(jQuery);
