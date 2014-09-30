/*
 * @version 0.5.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	home.home.js
 */

(function($, undefined) {
	
	$.extend( {
		
		home: {
			
			/*
			 * Funct setup. Init mod home. 0.5
			 */
			setup: function() {
				
				// Load model.
				$.m.load('home');
				
				// Event. Tmpl mod.
				$('#'+$.m.div.event).one($.m.event.setup, $.home.defautHtml);
			},
			
			
			/*
			 * Funct defautHtml. Menu brique in dock. 0.5
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
					
					// Add twitter sprite. + css attr. 
					$('#'+$.m.div.event).prepend($('<div id="twitter"></div>').width(150).height(150).css({
						background	: 'url("'+$.m.home.img.anim+'") 0 0 no-repeat',
						position	: 'absolute',
						cursor		: 'pointer'
					
						// Animation twitter. + Z index max.
						}).topZIndex().sprite({
							fps				: 8,
							no_of_frames	: 4
							
						// Position of anim twitter.
						}).spRandom({
							top		: 70,
							left	: 50,
							right	: $('#'+$.m.div.event).width()/2,
							bottom	: $('#'+$.m.div.event).height()-50,
							speed	: 2000,
							pause	: 4000
							
						// Move and Click client twitter.
						}).isDraggable().click(function() {
							
							// Strop anim sprite.
							$(this).spStop();
							
							// Add animation. @param 1-element 2-effect 3-remove anim class after 'default=false' 4-callBack
							$.tmpl.anim($(this), 'hinge', false, function(e){
								
								// Delete div twitter
								e.remove();
							});
							
							// Play sound.
							$.voix.play('top:0.1');
						
						// Start anim sprite.
						}).spStart()
					);
				});
			},
			
			/*
			 * Funct accueil. 0.5
			 */
			accueil: function() {
				
				// Data for owl.
				$.m.home.vars.lib = $.shuffle($.m.home.lib);
				
				// Canvas width for springy.
				$.m.home.vars.canvasWidth = ($('#event').width()<600)? $('#event').width()-25 : $('#event').width()/2-50;
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation complete.
				$('#'+$.m.div.content).slideUp(500, function() {
					
					// add tmpl. home.
					$('#'+$.m.div.content).empty().mustache('home', $.m);
						
					// If resize.
					$(window).resize(function() {
						
						// resize canvas.
						$('#viewport').width($('#viewportConten').width());
					});
								
					// Animation complete.
					$('#'+$.m.div.content).slideDown(500, function() {
						
						// Add video bitcoin.
						$('#videoChagry').tubeplayer({
							initialVideo	: $.lng.tx($.m.home.vid),
							protocol		: $.m.protocol
						});
						
						// Setup graph Springy.
						var sys = new Springy.Graph();
						
						// Setup Springy & add graph.
						var springy = $('#viewport').springy({
							graph : sys
						});
						
						// Boucle Nodes for Springy.
						$.each($.m.home.nodes, function(key, value) {
							
							// add nodes.
							sys.addNodes(value);
						});
						
						// Boucle Edges for Springy.
						$.each($.m.home.edges, function(key, value) {
							
							// add nodes.
							sys.addEdges(value);
						});
						
						// Caroussel.
						$("#owl-demo").owlCarousel({
							items				: 4, //10 items above 1000px browser width
							itemsDesktop		: [1000,3], //5 items between 1000px and 901px
							itemsDesktopSmall	: [900,3], // betweem 900px and 601px
							itemsTablet			: [600,2], //2 items between 600 and 0
							itemsMobile			: false // itemsMobile disabled - inherit from itemsTablet option
						});
						
						// Boucle caroussel class "item". +Anim & sound.
						$('#owl-demo .item').each(function() {
							
							// mouse enter btn.
							$(this).mouseenter(function() {
								
								// Add animation. @param 1-element 2-effect 3-remove anim class after 'default=false' 4-callBack
								$.tmpl.anim($(this), 'shake', true);
								
								// Anim opacity img.
								$(this).animate({ opacity: 0.3 }, 1000);
								
								// Play sound.
								$.voix.play('newPage:0.1');
								
							// mouse leave
							}).mouseleave(function() {
								
								// Anim opacity img.
								$(this).animate({ opacity: 1 }, 300);
							});
						});
						
						// popover donate bitcoin.
						$('#btcDonation').popover({
							html		: true,
							placement	: 'top',
							container	: 'body',
							content 	: '<div class="text-center text-muted"><small>'+
								$.m.home.don.btc+'</small><br><canvas id="qrCodeDonat" width="200" height="210"></canvas><br><a href="'+
								$.m.home.don.btcUrl+'"><img class="img-rounded" width="200" height="57" src="img/def/btcDon.jpg"></a></div>'
						});
						
						// img for qr code.
						heavyImage = new Image(); 
						heavyImage.src = "img/def/qr.jpg";
						
						// event shown popover. donate bitcoin.
						$('#btcDonation').on('shown.bs.popover', function () {
							// qr code generate.
							$('#qrCodeDonat').qrcode({
								text		: $.m.home.don.btcUrl,
								render		: 'canvas',
								minVersion	: 3,
								maxVersion	: 5,
								ecLevel		: 'M',
								top			: 10,
								size		: 200,
								fill		: '#3a87ad',
								background	: null,
								radius		: 0.5,
								quiet		: 0,
								mode		: 4,
								mSize		: 0.2,
								mPosX		: 0.5,
								mPosY		: 0.5,
								image		: heavyImage,
							});
						});
						
						// Animation background img.
						$('.noir').pan({fps: 12, speed: 1, dir: 'left'});
						$('.noir').pan({fps: 12, speed: 1, dir: 'down'});
						
						// Add btn scroll top. 1-id div
						$.tmpl.tagScroll('scrollTopBtn');
					});
				}); 
			},
		}
	});
	
})(jQuery);