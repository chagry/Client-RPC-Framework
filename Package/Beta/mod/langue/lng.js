/*
 * @version		0.4
 * @date Crea	11/09/2013.
 * @date Modif	04/12/2013.
 * @package		mod.langue.lng.js
 * @contact		chagry.fr - git@chagry.fr
 * @Dependence	*tmpl.js
 */

(function($, undefined) {
	
	$.extend( {
		
		lng: {
			
			/*
			 * obj data. 0.4
			 */
			data: {},
			
			/*
			 * Funct setup. Init mod langue. 0.4
			 */
			setup: function() {
				
				// event. Tmpl mod.
				$('#event').one('startTmpl', $.lng.defautHtml);
			},
			
			/*
			 * Funct get. Return code langue actuel. 0.4
			 * @return code langue actuel. ex: 'fr'
			 */
			get: function() {
				
				// Not langue.
				if($.lng.data.langueActu==null) {
					
					// Cookie langue.
					var lngCookie = $.cookie('langueClient');
					
					// if cookie.
					if(lngCookie!=undefined) {
						
						// if code cookie in array.
						if($.inArray(lngCookie, $.lng.data.listeLangue) > -1) $.lng.data.langueActu=lngCookie;
						
						// if not code in array.
						else {
							
							// first code in array.
							$.lng.data.langueActu=$.lng.data.listeLangue[0];
							
							// New cookie.
							$.cookie('langueClient', $.lng.data.langueActu);
						}
					}
					
					// if not cookie.
					else {
						
						// if code lingua in array.
						if($.inArray($.linguaGetLanguage(), $.lng.data.listeLangue) > -1) $.lng.data.langueActu=$.linguaGetLanguage();
						
						// if not code in array. first.
						else $.lng.data.langueActu=$.lng.data.listeLangue[0];
						
						// New cookie.
						$.cookie('langueClient', $.lng.data.langueActu);
					}
				}
				
				// return langue.
				return $.lng.data.langueActu;
			},
			
			/*
			 * Funct setList. array of langue. 0.4
			 * @param e array langue dispo.
			 */
			setList: function(e) {
				
				$.lng.data.listeLangue=e;
			},
			
			/*
			 * Funct tr. Traduction. 0.4
			 * @param e code string for translate.
			 * @param p if true, return juste string and not html.
			 * @return string.
			 */
			tr: function(e, p) {
				
				// if not $p. Return html.
				if(!p) return '<span class="langTr" data-langue="'+e+'">'+$.lingua(e)+'</span>';
				
				// if $p. Return juste string.
				else return $.lingua(e);
			},
			
			/*
			 * Funct defautHtml. Menu brique in dock. 0.4
			 */
			defautHtml: function() {
				
				// array langue for vue.
				var lstLngVue=new Array();
				
				// Boucle langue dispo.
				for (var i=0, c=$.lng.data.listeLangue.length; i<c; i++) {
					
					// nom, event & code langue.
					lstLngVue.push({
						code:			$.lng.data.listeLangue[i],
						btnEventLng:	'$("#mLangue").trigger("eventLangue", "'+$.lng.data.listeLangue[i]+'");',
						name:			$.lingua($.lng.data.listeLangue[i])
					});
				}
				
				// Data for tmpl.
				$.lng.data.codeActu=$.lng.data.langueActu;
				$.lng.data.nameActu=$.lingua($.lng.data.langueActu);
				$.lng.data.lstVue=lstLngVue;
				
				// Load tmpl.
				$.Mustache.load('mod/langue/defaut.htm').done(function () {
					
					// add tmpl.
					$('#menu').mustache('mLangue', $.lng.data);
				
					// Event.
					$('#mLangue').on('eventLangue', $.lng.changeLangue);
					
					// Tooltip.
					$('#mLangue button').tooltip();
				});
			},
			
			/*
			 * Funct changeLangue. 0.4
			 * @param param code langue select user.
			 */
			changeLangue: function(event, param) {
				
				// if code in array langue dispo.
				if($.inArray(param, $.lng.data.listeLangue) > -1) {
					
					// if langue != langue actu.
					if($.lng.data.langueActu!=param) {
						
						// Modif langue in objet.
						$.lng.data.langueActu=param;
						
						// this will also update controls by ID
						$.linguaLoad($.lng.data.langueActu);
						
						// New cookie.
						$.cookie('langueClient', $.lng.data.langueActu);
						
						// Lague of date
						moment.lang($.lng.data.langueActu);
						
						// translate text in page.
						$('.langTr').each(function() {
							
							// Animation complete.
							$(this).fadeOut(400, function() {
							
								// translate texte.
								$(this).text($.lingua($(this).data('langue')));
								
								// add contenue.
								$(this).fadeIn(400);
							});
						});
						
						// tooltip [data-tr|="tooltip"].
						$('[data-tr]').each(function() {
							
							// translate texte in tooltip.
							$(this).attr('data-original-title', $.lingua($(this).data('tr')));
						});
						
						// flag & title menu langue.
						$('#icoLangue').fadeOut(400, function() { 
							
							// flag img and title.
							$(this).attr({
								src: 'img/flag/'+$.lng.data.langueActu+'.gif',
								alt: $.lng.data.langueActu
								// add new titre div parent de l'image flag.
							}).parent().attr("data-original-title", $.lingua($.lng.data.langueActu));
							
							// print flag.
							$(this).fadeIn(400);
						});
					}
				}
			},
		}
	});
	
})(jQuery);