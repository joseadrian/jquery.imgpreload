/* v1.4 */
/*

Copyright (c) 2009 Dimas Begunoff, http://www.farinspace.com

https://github.com/farinspace/jquery.imgpreload

Licensed under the MIT license
http://en.wikipedia.org/wiki/MIT_License

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

if ('undefined' != typeof jQuery)
{
	(function($){

		// extend jquery (because i love jQuery)
		$.imgpreload = function (imgs,settings)
		{
			settings = $.extend({},$.fn.imgpreload.defaults,(settings instanceof Function)?{all:settings}:settings);

			// use of typeof required
			// https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Operators/Special_Operators/Instanceof_Operator#Description
			if ('string' == typeof imgs) { imgs = new Array(imgs); }
			
			if($.isPlainObject(imgs)) { imgs = $.map(imgs, function(value, key){ return { key: key, value: value }; }); }
			
			var loaded = new Array(), type = $.isArray(imgs) ? 'array' : '';

			(function load(i){
				if( ++i >= imgs.length ) {
				  return;
				}
				
				var img = new Image();

				var img_obj = img;
				
				var key = i;

				if(type == 'array') {
					img_obj = img;
					url = imgs[i];
					if(url.key) {
						key = url.key;
						url = url.value;
					}
				} else {
					img_obj = imgs.get(i);
					url = img_obj.src || img_obj.style.backgroundImage.replace(/^url\((?:"|')?(.*)(?:'|")?\)$/mg, "$1");
				}

				$(img).bind('load error', function(e)
				{
					loaded.push(img_obj);

					$.data(img_obj, 'loaded', 'error' != e.type);
					
					if (settings.each instanceof Function) { settings.each.call(img_obj, key, Math.round(loaded.length / imgs.length * 100)); }

					// http://jsperf.com/length-in-a-variable
					if (loaded.length>=imgs.length && settings.all instanceof Function) { settings.all.call(loaded); }

					$(this).unbind('load error');
					
					!settings.async && load(i); 
				});

				img.src = url;
				
				settings.async && load(i); 
			})(-1);
			
			return imgs;
		};

		$.fn.imgpreload = function(settings)
		{
			$.imgpreload(this,settings);

			return this;
		};

		$.fn.imgpreload.defaults =
		{
			each: null // callback invoked when each image in a group loads
			, all: null // callback invoked when when the entire group of images has loaded
			, async: true
		};

	})(jQuery);
}

/*

	Usage:

	$('#content img').imgpreload(function()
	{
		// this = array of dom image objects
		// callback executes when all images are loaded
	});

	$('#content img').imgpreload
	({
		each: function()
		{
			// this = dom image object
			// check for success with: $(this).data('loaded')
			// callback executes when each image loads
		},
		all: function()
		{
			// this = array of dom image objects
			// check for success with: $(this[i]).data('loaded')
			// callback executes when all images are loaded
		}
	});

	$.imgpreload('/images/a.gif',function()
	{
		// this = array of dom image objects
		// check for success with: $(this[i]).data('loaded')
		// callback
	});

	$.imgpreload(['/images/a.gif','/images/b.gif'],function()
	{
		// this = array of dom image objects
		// check for success with: $(this[i]).data('loaded')
		// callback executes when all images are loaded
	});

	$.imgpreload(['/images/a.gif','/images/b.gif'],
	{
		each: function()
		{
			// this = dom image object
			// check for success with: $(this).data('loaded')
			// callback executes on every image load
		},
		all: function()
		{
			// this = array of dom image objects
			// check for success with: $(this[i]).data('loaded')
			// callback executes when all images are loaded
		}
	});

*/
