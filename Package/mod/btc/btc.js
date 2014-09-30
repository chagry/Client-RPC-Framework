/*
 * @version 0.5.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	btc.btc.js
 */

(function($, undefined) {
	
	$.extend( {
		
		btc: {
			
			/**
			 * Funct setup.
			 */
			setup: function() {
				
				// Load model.
				$.m.load('btc');
				
				// event. setup listen.
				$('#'+$.m.div.event).one($.m.event.setup, $.btc.defautHtml);
			},
			
			/**
			 * html defaut.
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('btc', function () {
					
					// Upload infos btc.
					$.btc.uploadInfos();
					
					// Extend model : Func date return price chose.
					$.m.btc.PRIX = function() { 
						return function(text, render) {
							
							var tmp = '<span class="btcPrice" data-prix="'+Number(render(text)).toFixed(8)+'"></span>';
							if($.m.btc.v.price) tmp = '<span class="btcPrice" data-prix="'+Number(render(text)).toFixed(8)+'">'+(Number(render(text)).toFixed(8)*$.m.btc.v.price).toFixed(2)+'</span>';
							
							// Return result.
							return tmp;
						}
					};
					
					// Extend model : Func date return price vtc.
					$.m.btc.STHBTC = function() { 
						return function(text, render) {
							
							// Return result.
							return (Number(render(text))/100000000).toFixed(8);
						}
					};
					
					// Extend model : Func STHPRIX return price chose in satishi.
					$.m.btc.STHPRIX = function() { 
						return function(text, render) {
							
							var tmp = '<span class="btcPrice" data-prix="'+(Number(render(text))/100000000).toFixed(8)+'"></span>';
							if($.m.btc.v.price) tmp = '<span class="btcPrice" data-prix="'+(Number(render(text))/100000000).toFixed(8)+'">'+(Number(render(text)/100000000).toFixed(8)*$.m.btc.v.price).toFixed(2)+'</span>';
							
							// Return result.
							return tmp;
						}
					};
					
					// Extend model : Func date return devise + code. CODE ICO NAME
					$.m.btc.DEVISE = function() { 
						return function(text, render) {
							
							var tmp = '';
							
							if(render(text)=='CODE') {
								
								var tmp = '<span class="codePrice"></span>';
								if($.m.btc.v.devise) tmp = '<span class="codePrice">'+$.m.btc.v.devise+'</span>';
							}
							
							if(render(text)=='ICO') {
								
								tmp = '<span class="icoPrice"></span>';
								if($.m.btc.v.devise) tmp = '<span class="icoPrice"><img src="img/val/'+$.m.btc.v.devise+'.gif" alt="'+$.m.btc.v.devise+'"></span>';
							}
							
							if(render(text)=='NAME') {
								
								tmp = '<span class="namePrice"></span>';
								if($.m.btc.v.devise) tmp = '<span class="namePrice">'+$.lng.tr($.m.btc.v.devise, true)+'</span>';
							}
							
							// Return result.
							return tmp;
						}
					};
				});
			},
			
			/**
			 * html uploadInfos.
			 */
			uploadInfos: function() {
				
				// connexion serveur.
				$.jsonRPC.request('btc_infos', {
					
					// Param send.
					params : [],
					
					// succees.
					success : function(data) {
						
						// add the infos.
						$.m.btc.v.prices = data.result.prices;
						$.m.btc.v.history = data.result.history;
						$.m.btc.v.menu = Array();
						
						// Creat array menu devise code.
						$.each($.m.btc.v.prices, function(key, val) {
							
							// add result tab log.
							$.m.btc.v.menu.push(key);
						});
						
						// Cookie devise.
						var btcCookie = $.cookie('devise');
						
						// if cookie.
						if(btcCookie!=undefined) {
							
							// if code cookie in array.
							if($.inArray(btcCookie, $.m.btc.v.menu) > -1) $.m.btc.v.devise=btcCookie;
							
							// if not code in array.
							else {
								
								// first code in array.
								$.m.btc.v.devise=$.m.btc.v.menu[0];
								
								// New cookie.
								$.cookie($.m.lng.cookie, $.m.btc.v.devise);
							}
						}
						
						// if not cookie.
						else {
							
							// if not code in array. first.
							$.m.btc.v.devise=$.m.btc.v.menu[0];
							
							// New cookie.
							$.cookie('devise', $.m.btc.v.devise);
						}
						
						// Price actu for devise.
						$.m.btc.v.price = $.m.btc.v.prices[$.m.btc.v.devise].last;
						
						// Begin news price interval.
						setInterval($.btc.newPrice,300000);
						
						// Edit html devise
						$.btc.editDevise();
						
						// Edit html Price
						$.btc.editPrice();
						
						// add menu btc.
						$('#'+$.m.div.menu).mustache('mBtc', $.m, {method:'prepend'});
						
						// Init popup sur les lien.
						$('#mBtc button').tooltip();
					},
					
					// erreur serveur.
					error : function(data) {
						
						// erreur.
						$.tmpl.error(data.error);
						
						// Upload infos btc. after 5s
						setTimeout($.btc.uploadInfos, 5000);
					}
				});
			},
			
			/**
			 * html newPrice.
			 */
			newPrice: function() {
				
				// connexion serveur.
				$.jsonRPC.request('btc_news', {
					
					// Param send.
					params : [],
					
					// succees.
					success : function(data) {
						
						// add the infos.
						$.m.btc.v.prices = data.result;
						
						// Price actu for devise.
						$.m.btc.v.price = $.m.btc.v.prices[$.m.btc.v.devise].last;
						
						// Edit html Price
						$.btc.editPrice();
					},
					
					// erreur serveur.
					error : function(data) {
						
						// erreur.
						$.tmpl.error(data.error);
					}
				});
			},
			
			/**
			 * Function changePrices.
			 * @param   string $param code devise "USD".
			 * @access  public
			 */
			changePrices: function(param) {
				
				// if code in array devise dispo.
				if($.inArray(param, $.m.btc.v.menu) > -1) {
					
					// if devise != devise actu.
					if($.m.btc.v.devise!=param) {
						
						// Modif devise in objet.
						$.m.btc.v.devise=param;
						
						// New cookie.
						$.cookie('devise', $.m.btc.v.devise);
						
						// Price actu for devise.
						$.m.btc.v.price = $.m.btc.v.prices[$.m.btc.v.devise].last;
						
						// Edit html devise
						$.btc.editDevise();
						
						// Edit html Price
						$.btc.editPrice();
					}
				}
			},
			
			/**
			 * Funct editDevise.
			 */
			editDevise: function() {
				
				// edit code price in page.
				$('.codePrice').each(function() {
					
					// Animation complete.
					$(this).fadeOut(400, function() {
					
						// code texte.
						$(this).text($.m.btc.v.devise);
						
						// add contenue.
						$(this).fadeIn(400);
					});
				});
				
				// edit icon price in page.
				$('.icoPrice').each(function() {
					
					// Animation complete.
					$(this).fadeOut(400, function() {
					
						// img devise.
						$(this).html('<img src="img/val/'+$.m.btc.v.devise+'.gif" alt="'+$.m.btc.v.devise+'">');
						
						// add contenue.
						$(this).fadeIn(400);
					});
				});
				
				// edit name price in page.
				$('.namePrice').each(function() {
					
					// Animation complete.
					$(this).fadeOut(400, function() {
					
						// name html.
						$(this).html($.lng.tr($.m.btc.v.devise, true));
						
						// add contenue.
						$(this).fadeIn(400);
					});
				});
			},
			
			/**
			 * Funct editPrice.
			 */
			editPrice: function() {
				
				// edit code price in page.
				$('.btcPrice').each(function() {
					
					// If price html > new price
					if((Number($(this).data('prix'))*$.m.btc.v.price).toFixed(2)<(Number($(this).text()))) {
					
						// Animation complete.
						$(this).fadeOut(400, function() {
								
							// code texte.
							$(this).text((Number($(this).data('prix'))*$.m.btc.v.price).toFixed(2)).addClass('text-danger');
							
							// Sign menu btc.
							$('#menuBtcSign').removeClass().addClass('text-danger');
							$('#menuBtcSign i').removeClass().addClass('fa fa-arrow-down');
							
							// add contenue.
							$(this).fadeIn(400);
						});
					}
					
					// If price html < new price
					if((Number($(this).data('prix'))*$.m.btc.v.price).toFixed(2)>(Number($(this).text()))) {
					
						// Animation complete.
						$(this).fadeOut(400, function() {
							
							// code texte.
							$(this).text((Number($(this).data('prix'))*$.m.btc.v.price).toFixed(2)).addClass('text-success');
							
							// Sign menu btc.
							$('#menuBtcSign').removeClass().addClass('text-success');
							$('#menuBtcSign i').removeClass().addClass('fa fa-arrow-up');
							
							// add contenue.
							$(this).fadeIn(400);
						});
					}
				});
				
				// Remove class after 4s.
				setTimeout(function () { 
					$('.btcPrice').removeClass('text-success text-danger');
				}, 4000);
			},
			
			/**
			 * html home.
			 */
			home: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation complete.
				$('#'+$.m.div.content).slideUp(500, function() {
					
					// Declar var for html.
					$.m.btc.v.history.max=0;
					$.m.btc.v.history.min=10000;
					$.m.btc.v.history.now=$.m.btc.v.prices.USD.last.toFixed(2);
					
					// data for chart history btc usd.
					var data = {
						labels: [],
						datasets: 
						[{
							label: "Bitcoin",
							fillColor: "rgba(238, 162, 54, 1)",
							strokeColor: "rgba(238, 162, 54, 1)",
							data: []
						}]
					};
					
					// Boucle result cards.
					$.each($.m.btc.v.history.values, function(key, value) {
					
						// Add name of adm for label chart.
						data.labels.push(value.x);
						
						// Add nb for chart.
						data.datasets[0].data.push(value.y);
						
						// If new max price.
						if(value.y>$.m.btc.v.history.max) $.m.btc.v.history.max=value.y;
						
						// If new min price.
						if(value.y<$.m.btc.v.history.min) $.m.btc.v.history.min=value.y;
					});
					
					// add tmpl. home.
					$('#'+$.m.div.content).empty().mustache('btcHome', $.m);
					
					// Animation complete.
					$('#'+$.m.div.content).slideDown(500, function() {
						
						// Add video bitcoin.
						$('#videoBtc').tubeplayer({
							initialVideo	: $.lng.tx($.m.btc.vid),
							protocol		: $.m.protocol
						});
						
						// Option chart.
						var opts = {
							scaleBeginAtZero : false,
							scaleShowGridLines : false,
							scaleGridLineWidth : 0,
							pointDot: false,
							showTooltips: false,
							scaleOverride: true,
							scaleSteps: 200,
							scaleStepWidth: $.m.btc.v.history.max/200,
							scaleStartValue: $.m.btc.v.history.min
						};
						
						// Defaut seting chart.
						Chart.defaults.global.responsive = true;
						Chart.defaults.global.showScale = false;
						Chart.defaults.global.maintainAspectRatio = false;
						
						// start chart bar for cards.
						var btcHistChart = new Chart($('#btcHistoryChart').get(0).getContext('2d')).Line(data, opts);
					});
				});
			},
		}
	});
	
})(jQuery);