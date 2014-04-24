/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	19/04/2014.
 * @package		lng.lng.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*tmpl.js
 */

(function($, undefined) {
	
	$.extend( {
		
		lng: {
			
			/*
			 * Funct setup. Init mod langue. 0.5
			 */
			setup: function() {
				
				// event. Tmpl mod.
				$('#'+$.m.div.event).one($.m.event.setup, $.lng.defautHtml);
			},
			
			/*
			 * Funct defautHtml. Menu brique in dock. 0.5
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('lng', function() {
					
					// add tmpl.
					$('#'+$.m.div.menu).mustache('mLangue', $.m);
					
					// Tooltip.
					$('#mLangue button').tooltip();
				});
			},
			
			/*
			 * Funct get. Return code langue actuel. 0.5
			 * @return code langue actuel. ex: 'fr'
			 */
			get: function() {
				
				// Not langue.
				if(!$.m.lng.langue) {
					
					// Cookie langue.
					var lngCookie = $.cookie($.m.lng.cookie);
					
					// if cookie.
					if(lngCookie!=undefined) {
						
						// if code cookie in array.
						if($.inArray(lngCookie, $.m.lng.list) > -1) $.m.lng.langue=lngCookie;
						
						// if not code in array.
						else {
							
							// first code in array.
							$.m.lng.langue=$.m.lng.list[0];
							
							// New cookie.
							$.cookie($.m.lng.cookie, $.m.lng.langue);
						}
					}
					
					// if not cookie.
					else {
						
						// if code lingua in array.
						if($.inArray($.linguaGetLanguage(), $.m.lng.list) > -1) $.m.lng.langue=$.linguaGetLanguage();
						
						// if not code in array. first.
						else $.m.lng.langue=$.m.lng.list[0];
						
						// New cookie.
						$.cookie($.m.lng.cookie, $.m.lng.langue);
					}
				}
				
				// return langue.
				return $.m.lng.langue;
			},
			
			/*
			 * Funct tr. Traduction. 0.5
			 * @param e code string for translate.
			 * @param p if false, return juste string and not html. defaut : false.
			 * @return string.
			 */
			tr: function(e, p) {
				
				// Content.
				var transit = $.lingua(e);
				
				// If not translate.
				if(!transit) transit=e;
				
				// if not $p. Return html.
				if(p) return '<span class="langTr" data-langue="'+e+'">'+transit+'</span>';
				
				// if $p. Return juste string.
				else return transit;
			},
			
			/*
			 * Funct changeLangue. 0.5
			 * @param param code langue select user.
			 */
			changeLangue: function(param) {
				
				// if code in array langue dispo.
				if($.inArray(param, $.m.lng.list) > -1) {
					
					// if langue != langue actu.
					if($.m.lng.langue!=param) {
						
						// Modif langue in objet.
						$.m.lng.langue=param;
						
						// this will also update controls by ID
						$.linguaLoad($.m.lng.langue);
						
						// New cookie.
						$.cookie($.m.lng.cookie, $.m.lng.langue);
						
						// Lague of date
						moment.lang($.m.lng.langue);
						
						// translate text in page.
						$('.langTr').each(function() {
							
							// Animation complete.
							$(this).fadeOut(400, function() {
							
								// translate texte.
								$(this).text($.lng.tr($(this).data('langue')));
								
								// add contenue.
								$(this).fadeIn(400);
							});
						});
						
						// tooltip [data-tr|="tooltip"].
						$('[data-tr]').each(function() {
							
							// translate texte in tooltip.
							$(this).attr('data-original-title', $.lng.tr($(this).data('tr')));
						});
						
						// flag & title menu langue.
						$('#icoLangue').fadeOut(400, function() { 
							
							// flag img and title.
							$(this).attr({
								src: $.m.lng.root+$.m.lng.langue+$.m.lng.extension,
								alt: $.m.lng.langue
								// add new titre div parent de l'image flag.
							}).parent().attr("data-original-title", $.lng.tr($.m.lng.langue));
							
							// print flag.
							$(this).fadeIn(400);
						});
						
						// event. Tmpl mod.
						$('#'+$.m.div.event).trigger($.m.event.langue);
					}
				}
			},
		}
	});
	
})(jQuery);