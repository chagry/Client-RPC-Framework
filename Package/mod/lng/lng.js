/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	04/04/2014.
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
				$('#'+$.model.html.event).one($.model.event.setup, $.lng.defautHtml);
			},
			
			/*
			 * Funct defautHtml. Menu brique in dock. 0.5
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('lng', function() {
					
					// add tmpl.
					$('#'+$.model.html.menu).mustache('mLangue', $.model);
					
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
				if(!$.model.lng.langue) {
					
					// Cookie langue.
					var lngCookie = $.cookie($.model.lng.cookie);
					
					// if cookie.
					if(lngCookie!=undefined) {
						
						// if code cookie in array.
						if($.inArray(lngCookie, $.model.lng.list) > -1) $.model.lng.langue=lngCookie;
						
						// if not code in array.
						else {
							
							// first code in array.
							$.model.lng.langue=$.model.lng.list[0];
							
							// New cookie.
							$.cookie($.model.lng.cookie, $.model.lng.langue);
						}
					}
					
					// if not cookie.
					else {
						
						// if code lingua in array.
						if($.inArray($.linguaGetLanguage(), $.model.lng.list) > -1) $.model.lng.langue=$.linguaGetLanguage();
						
						// if not code in array. first.
						else $.model.lng.langue=$.model.lng.list[0];
						
						// New cookie.
						$.cookie($.model.lng.cookie, $.model.lng.langue);
					}
				}
				
				// return langue.
				return $.model.lng.langue;
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
				if($.inArray(param, $.model.lng.list) > -1) {
					
					// if langue != langue actu.
					if($.model.lng.langue!=param) {
						
						// Modif langue in objet.
						$.model.lng.langue=param;
						
						// this will also update controls by ID
						$.linguaLoad($.model.lng.langue);
						
						// New cookie.
						$.cookie($.model.lng.cookie, $.model.lng.langue);
						
						// Lague of date
						moment.lang($.model.lng.langue);
						
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
								src: $.model.lng.root+$.model.lng.langue+$.model.lng.extension,
								alt: $.model.lng.langue
								// add new titre div parent de l'image flag.
							}).parent().attr("data-original-title", $.lng.tr($.model.lng.langue));
							
							// print flag.
							$(this).fadeIn(400);
						});
						
						// event. Tmpl mod.
						$('#'+$.model.html.event).trigger($.model.event.langue);
					}
				}
			},
		}
	});
	
})(jQuery);