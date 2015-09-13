/*
 * @version 0.6.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	home.home.js
 */

(function($, undefined) {
	
	$.extend( {
		
		home: {
			
			/*
			 * Funct setup. Init mod home.
			 */
			setup: function() {
				
				// Load model.
				$.m.load('home');
				
				// Event. Tmpl mod.
				$('#'+$.m.div.event).one($.m.event.setup, $.home.defautHtml);
			},
			
			
			/*
			 * Funct defautHtml. Menu brique in dock.
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('home', function () {
					
					// add tmpl.
					$('#'+$.m.div.menu).mustache('mHome', $.m, {method:'prepend'});
					
					// Tooltip.
					$('#mHome button').tooltip();
					
					// Setup html profil.
					$.home.accueil();
					
					// event. setup listen.
					$('#'+$.m.div.event).on($.m.event.langue, $.home.editeVideo);
				});
			},
			
			/*
			 * Funct accueil.
			 */
			accueil: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation complete.
				$('#'+$.m.div.content).fadeOut(300, function() {
					
					// add tmpl. home.
					$('#'+$.m.div.content).empty().mustache('home', $.m);
								
					// Animation complete.
					$('#'+$.m.div.content).fadeIn(300, function() {
						
						// Add video bitcoin.
						$('#videoChagry').tubeplayer({
							initialVideo	: $.lng.tx($.m.home.vid),
							protocol		: $.m.protocol
						});
					});
				}); 
			},
			
			/**
			 * html editeVideo.
			 */
			editeVideo: function() {
				
				// If video in dom.
				if($('#videoChagry').length) {
									
					// Add video bitcoin.
					$('#videoChagry').removeClass( "jquery-youtube-tubeplayer" ).empty();
					
					// Add new video in dom.
					$('#videoChagry').tubeplayer({
						initialVideo	: $.lng.tx($.m.home.vid),
						protocol		: $.m.protocol
					});
				}
			},
			
			/*
			 * Funct serveurHTML.
			 */
			serveurHTML: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation complete.
				$('#'+$.m.div.content).fadeOut(300, function() {
					
					// add tmpl. home.
					$('#'+$.m.div.content).empty().mustache('serveur', $.m);
								
					// Animation complete.
					$('#'+$.m.div.content).fadeIn(300, function() {
						
						// Caroussel.
						$("#owl-head").owlCarousel({
							items				: 4, //10 items above 1000px browser width
							itemsDesktop		: [1000,3], //5 items between 1000px and 901px
							itemsDesktopSmall	: [900,3], // betweem 900px and 601px
							itemsTablet			: [600,2], //2 items between 600 and 0
							itemsMobile			: false, // itemsMobile disabled - inherit from itemsTablet option
							autoPlay			: false
						});
						
						// Tooltip.
						$('.item').tooltip();
						
						// Add video bitcoin.
						$('#videoTuto').tubeplayer({
							initialVideo	: $.lng.tx($.m.home.serverVid[0].vid),
							protocol		: $.m.protocol
						});
					});
				}); 
			},
			
			/*
			 * Funct serverVideo.
			 */
			serverVideo: function(n) {
				
				// Creat array menu devise code.
				$.each($.m.home.serverVid, function(key, val) {
					
					// Si video trouver.
					if(n == val.nombre) {
						
						// Add video bitcoin.
						$('#videoTuto').removeClass( "jquery-youtube-tubeplayer" ).empty();
						
						// Add new video in dom.
						$('#videoTuto').tubeplayer({
							initialVideo	: $.lng.tx(val.vid),
							protocol		: $.m.protocol
						});
					}	
				});
			},
			
			/*
			 * Funct clientHTML.
			 */
			clientHTML: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation complete.
				$('#'+$.m.div.content).fadeOut(300, function() {
					
					// add tmpl. home.
					$('#'+$.m.div.content).empty().mustache('client', $.m);
								
					// Animation complete.
					$('#'+$.m.div.content).fadeIn(300, function() {
						
						// Caroussel.
						$("#owl-head").owlCarousel({
							items				: 4, //10 items above 1000px browser width
							itemsDesktop		: [1000,3], //5 items between 1000px and 901px
							itemsDesktopSmall	: [900,3], // betweem 900px and 601px
							itemsTablet			: [600,2], //2 items between 600 and 0
							itemsMobile			: false, // itemsMobile disabled - inherit from itemsTablet option
							autoPlay			: false
						});
						
						// Tooltip.
						$('.item').tooltip();
						
						// Add video bitcoin.
						$('#videoTuto').tubeplayer({
							initialVideo	: $.lng.tx($.m.home.clientVid[0].vid),
							protocol		: $.m.protocol
						});
					});
				}); 
			},
			
			/*
			 * Funct serverVideo.
			 */
			clientVideo: function(n) {
				
				// Creat array menu devise code.
				$.each($.m.home.clientVid, function(key, val) {
					
					// Si video trouver.
					if(n == val.nombre) {
						
						// Add video bitcoin.
						$('#videoTuto').removeClass( "jquery-youtube-tubeplayer" ).empty();
						
						// Add new video in dom.
						$('#videoTuto').tubeplayer({
							initialVideo	: $.lng.tx(val.vid),
							protocol		: $.m.protocol
						});
					}	
				});
			},
		}
	});
	
})(jQuery);