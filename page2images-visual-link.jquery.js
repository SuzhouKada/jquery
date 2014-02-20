/***
 *   http://www.page2images.com
 *
 *   ************demo start************
 *   // the first para is apikey, default is free key.
 *   // the second para is preload, if you want to load images when document load
 *   // the third para is includeinnerlink, if your screenshots include current domain.
 *   p2iQuery().run("Free", false, false);
 *   // Please notice your domain when use YOUR_DIRECTLINK_KEY.
 *   p2iQuery().run(YOUR_DIRECTLINK_KEY, false, true);
 *   
 *   Please add below scripts in your html.
 *   ===========================================================================
 *   <script type="text/javascript" src="/js/p2i.thumbnails.js"></script>
 *   <script>
 *   	window.onload=function() {
 *   		p2iQuery().run("6b51f3e77d98e07f", false, true);
 *   		//p2iQuery().run("Free", true, true);
 *   	};
 *   </script>
 *   ===========================================================================
 *   ************demo end************
 ***/
(function () {
	var p2iQuery = function () {
		return p2iQuery.fn.init();
	};

	p2iQuery.fn = p2iQuery.prototype = {
		p2iQuery: "1.0.0",
		init: function() {
			return this;
		},
		run: function(apikey, preload, includeinnerlink) {
			this.apikey = apikey || "Free";
			this.preload = preload || false;
			this.includeinnerlink = includeinnerlink || false;
			this.isonmouseover = true;

			var is_free = apikey == "Free";
			this.add_page2images_popup(is_free);
			this.preload_all_a_link_tags();
		},
		add_page2images_popup: function(is_free) {
			if (document.getElementById('page2images_popup') == null) {
				var p2i_pop = "<div style='border: 1px solid #222222;'><img  id='page2images_img' src='' />";
				if (is_free) {
					p2i_pop += '<div style="border-top: 1px solid #222222; padding: 0 3px;  text-align: right;"><a href="http://www.page2images.com" style="color:#222222; font-size:10px;">Website Preview By Page2Images</a></div>';
				}
				p2i_pop += "</div>";
				var elem = document.createElement("div");
				elem.id = "page2images_popup";
				elem.style.background = "#FFFFFF";
				elem.style.display = "none";
				elem.style.position = "absolute";
				elem.style.zIndex = 999;
				elem.style.border = "1px solid #DDDDDD";
				elem.innerHTML = p2i_pop;
				document.body.insertBefore(elem, document.body.childNodes[0]);
			}
		},
		verified_href: function(href) {
			href = href.replace(/[/]$/, '');
			if (href == document.location.href) {
				return false;
			}
			
			var p2ireg=new RegExp("^javascript");
			if (p2ireg.test(href)) {
				return false;
			}

			if (this.includeinnerlink) {
				return true;
			}
			
			if ((new RegExp("^http[s]?://")).test(href) || (new RegExp("^www")).test(href)) {
				p2ireg=new RegExp(document.location.hostname);
				if (p2ireg.test(href)) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},
		get_img_api_url: function(url) {
			if (!(new RegExp("^http[s]?://")).test(url) && !(new RegExp("^www")).test(url)) {
				if ((new RegExp("^/")).test(url)) {
					url = document.location.hostname+url;
				} else {
					url = document.location.href + '/' + url;
				}
			}

			if (this.apikey == 'Free') {
				return "http://api.page2images.com/freeimagetag?p2i_visual_link=1&p2i_url=" + url;
			} else {
				return "http://api.page2images.com/directlink?p2i_key=" + this.apikey +"&p2i_visual_link=1&p2i_url=" + url;
			}
		},
		setupmouseoverout: function(elem){
			elem.addEventListener('mouseover', function(evt) {
				p2iQuery().isonmouseover = true;
				p2iQuery().current_href = p2iQuery().get_img_api_url(this.href);
				p2iQuery().evt = evt;
				p2iQuery().Timer = setTimeout(function(){
					p2iQuery().isonmouseover = true;
					if (!p2iQuery().isonmouseover) {
						return;
					}
					var img_src = p2iQuery().current_href;
					document.getElementById("page2images_img").src= img_src;
					
					var p2i_popup = document.getElementById("page2images_popup");
					p2i_popup.style.display='block';
					var evt = p2iQuery().evt;
					var pleft = evt.clientX + 15;
					
					var sp = document.body.scrollTop ||document.documentElement.scrollTop;
					var ptop = evt.clientY + sp + 15;
					
					if (pleft + p2i_popup.offsetWidth > window.innerWidth) {
						pleft = pleft - p2i_popup.offsetWidth - 30;
					}

					p2i_popup.style.left=pleft + 'px';
					p2i_popup.style.top= ptop + 'px';
					p2iQuery().isonmouseover = false;
				}, 500);
			});
			elem.onmouseout = function(evt) {
				p2iQuery().isonmouseover = false;
				clearTimeout(p2iQuery().Timer);
				document.getElementById("page2images_popup").style.display = 'none';
				document.getElementById("page2images_img").src = '';
			};
		},
		preload_all_a_link_tags: function() {
			var all_alinks = document.getElementsByTagName("a");
			var preload_count = 0;
			for (var i=0;i<all_alinks.length;i++) {
				if (this.verified_href(all_alinks[i].href)) {
					this.setupmouseoverout(all_alinks[i]);
					if (this.preload && preload_count < 5) {
						preload_count ++;
						var elem = document.createElement("img");
						elem.src = this.get_img_api_url(all_alinks[i].href);
						elem.style = "display:none;";
						document.body.insertBefore(elem, document.body.childNodes[0]);
					}
				}
			}
		},
	};
	window.p2iQuery = p2iQuery;
})();

(function ( $ ) {
    $.fn.p2iQueryRun = function() {
        p2iQuery().run("Free", true, true);
    };
}( jQuery ));
