/*
 * @version		0.5
 * @date Crea	15/04/2014.
 * @date Modif	19/04/2014.
 * @package		mod.doc.doc.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*tmpl.js
 */

(function($, undefined) {
	
	$.extend( {
		
		doc: {
			
			/*
			 * Funct setup. Init mod home. 0.5
			 */
			setup: function() {
				
				// Load model.
				$.m.load('doc');
				
				// Event. Tmpl mod.
				$('#'+$.m.div.event).one($.m.event.setup, $.doc.defautHtml);
			},
			
			/*
			 * Funct defautHtml. Menu in dock. 0.5
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('doc', function () {
					
					// add tmpl.
					$('#'+$.m.div.menu).mustache('mDoc', $.m, {method:'prepend'});
					
					// Tooltip.
					$('#mDoc button').tooltip();
				});
			},
			
			/*
			 * Funct docHtml. 0.5
			 */
			sommaire: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// Anim complete.
				$('#'+$.m.div.content).slideUp(500, function() {
					
					// add tmpl. DOC.
					$('#'+$.m.div.content).empty().mustache('sommaire', $.m);
					
					// Anim complete.
					$('#'+$.m.div.content).slideDown(500, function() {
						
						// Add btn scroll top. 1-id div
						$.tmpl.tagScroll('scrollTopBtn');
					});
				}); 
			},
			
			/*
			 * Funct pageHtml. 0.5
			 * @param e -> string client/server.
			 */
			pageHtml: function(e) {
				
				// Clean windows.
				$.tmpl.clean();
				
				// var content id div doc md and menu.
				$.m.doc.v.divIdDocMD = Math.floor(Math.random()*469)+123;
				$.m.doc.v.divIdMenu = Math.floor(Math.random()*2469)+123;
				
				// Delete menu.
				$('#main-menu').navgoco('destroy');
				
				// Anim complete.
				$('#'+$.m.div.content).slideUp(500, function() {
					
					// add tmpl. DOC.
					$('#'+$.m.div.content).empty().mustache('docHtml', $.m);
					
					// Init md pars.
					var converter = new Showdown.converter({extensions: ['table', 'github']});
					
					// Recup funt pars.
					markdownToHtml = converter.makeHtml;
					
					// Load md file.
					$.get($.m.doc.page.url+e+$.m.doc.page.ext).success(function (data) {
						
						// Add md file in html.
						$("#"+$.m.doc.v.divIdDocMD).html(markdownToHtml(data));
								
						// Anim complete.
						$('#'+$.m.div.content).slideDown(500, function() {
						
							// Color code.
							$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
							
							// Construct menu item.
							$('#'+$.m.doc.v.divIdDocMD).anchorific({
								navigation	: '.'+$.m.doc.v.divIdMenu
							});
							
							// Construct menu design.
							$('#main-menu').navgoco({
								accordion	: true,
								save		: false,
							});
							
							// If not mobil.
							if($(window).width() > 768) {
								
								// Add affix in menu.
								$('.'+$.m.doc.v.divIdMenu).affix({
									offset: {
										top: 100,
										bottom: 285
									}
								// Add width for menu.
								}).width($('#menuRightDoc').width());
								
								// If resize.
								$(window).resize(function() {
									
									// if resize. // resize menu.
									if($(window).width() > 768) $('.'+$.m.doc.v.divIdMenu).width($('#menuRightDoc').width());
									
									// if mobil resize.
									else {
										
										// resize menu.
										$('.'+$.m.doc.v.divIdMenu).width($('#menuRightDoc').width()-40);
										// Off affix.
										$(window).off('.affix');
									}
								});
							}
							
							// Add btn scroll top. 1-id div
							$.tmpl.tagScroll('scrollTopBtn');
						});
					});
				});
			},
		}
	});
	
})(jQuery);