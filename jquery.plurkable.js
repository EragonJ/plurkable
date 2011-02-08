/*
 * plurkable - lightweight jQuery plugin for customizing Plurk widgets
 *
 * Version : 1.0
 * Author  : EragonJ | 陳佳隆
 * Email   : eragonj@hax4.in | jack.xxlong@gmail.com
 * Blog    : http://eragonj.hax4.in
 *
 */
(function() {

  var _this = null;

  var _settings = {
    num         : 20,
    username    : 'Plurkbuddy',
    show_link   : true,
    show_date   : true,
    date_format : 'yyyy/mm/dd HH:MM:ss'
  };

  function init() {
    // Get the actual $feed
    var $feed = fetch_feed(_settings.username);

    // Get the feed_info after parsing and modifications
    var feed_info = parse_feed($feed);

    build_structure_of(feed_info);
  }
  
  // Plurk DOESNT support jsonp 
  function fetch_feed(account) {

    var feed = $.ajax({
      async    : false,
      url      : 'fetchFeed.php',
      data     : "account="+account,
      dataType : 'xml',
      error    : function() {
        alert('forbidden user');
        throw "forbidden User , plz check !";
      },
      success  : function(data) {
        return data;
      }
    }).responseText;

    return $(feed);
  }

  function parse_feed($feed) {
    var feed_info = {
      pid     : [],
      content : [],
      link    : [],
      date    : [],
      length  : 0
    };

    $feed.find('entry').each(function() {
      feed_info.pid.push( $(this).find('id').text() );
      feed_info.content.push( $(this).find('content').text() );
      feed_info.link.push( $(this).find('link').attr('href') );
      feed_info.date.push( $(this).find('published').text() );
      feed_info.length ++;
    });

    process(feed_info);
    return feed_info;
  }

  function process(feed_info) {
    process_pid(feed_info.pid);
    process_link(feed_info.link); 
    process_date(feed_info.date); 
  }

  function process_pid(pid) {
    var re = /;(\d+)$/;
    for (var i=0; i<pid.length; i++) {
      pid[i] = (pid[i].match(re))[1];
    }
  }

  function process_link(link) {
    var prefix = 'http://www.plurk.com';
    for (var i=0; i<link.length; i++) {
      link[i] = prefix + link[i]; 
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
      var cache_block   = $('<li class="plurk_block"></li>');

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
