/*
 * @version		0.5
 * @date Crea	04/12/2013.
 * @date Modif	15/02/2014.
 * @package		mod.home.home.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*tmpl.js
 */

(function($, undefined) {
	
	$.extend( {
		
		home: {
			
			/*
			 * obj data. donnees for module. 0.4
			 */
			data: {},
			
			/*
			 * Funct setup. Init mod home. 0.4
			 */
			setup: function() {
				
				// Ecoute event. Tmpl mod.
				$('#event').one('startTmpl', $.home.defautHtml);
			},
			
			
			/*
			 * Funct defautHtml. Menu brique in dock. 0.4
			 */
			defautHtml: function() {
				
				// Data for tmpl.
				$.home.data.titre = $.lng.tr('HOME', true);
				$.home.data.titreTr = 'HOME';
				$.home.data.homeClick = '$.home.accueil()';
				
				// Load tmpl.
				$.Mustache.load('mod/home/defaut.htm').done(function () {
					
					// add tmpl.
					$('#menu').mustache('mHome', $.home.data, {method:'prepend'});
					
					// Tooltip.
					$('#mHome button').tooltip();
					
					// Setup html profil.
					$.home.accueil();
				});
			},
			
			/*
			 * Funct accueil. 0.4
			 */
			accueil: function() {
				
				// Data for html template.
				$.home.data.frameworkTitre = $.lng.tr('HOME-LABEL-TITRE');
				$.home.data.frameworkDesc = $.lng.tr('HOME-LABEL-DESC');
				$.home.data.ServeurLab = $.lng.tr('DEF-SERVER');
				$.home.data.frameworkLab = $.lng.tr('DEF-FRAMEWORK');
				$.home.data.ClientLab = $.lng.tr('DEF-CLIENT');
				$.home.data.connaissancesLab = $.lng.tr('HOME-PARTAGE-CONNAISS');
				$.home.data.frameworksTile = $.lng.tr('DEF-FRAMEWORKS');
				$.home.data.frameworksLab = $.lng.tr('HOME-FRAMEWORK-LABEL');
				$.home.data.flexiTitle = $.lng.tr('HOME-FLEXIBLE');
				$.home.data.flexiLab = $.lng.tr('HOME-FLEXI-LABEL');
				$.home.data.secuTitle = $.lng.tr('DEF-SECURITE');
				$.home.data.secuLab = $.lng.tr('HOME-SECU-LABEL');
				$.home.data.designTitle = $.lng.tr('DEF-DESIGN');
				$.home.data.designLab = $.lng.tr('HOME-DESIGN-LABEL');
				$.home.data.donneesTitle = $.lng.tr('DEF-DONNEES');
				$.home.data.donneesLab = $.lng.tr('HOME-DONNEE-LABEL');
				$.home.data.moduTitle = $.lng.tr('DEF-MODULAR');
				$.home.data.moduLab = $.lng.tr('HOME-MODUL-LABEL');
				$.home.data.tecTitle = $.lng.tr('DEF-TECHNOLOGIE');
				$.home.data.tecLab = $.lng.tr('HOME-TEC-LABEL');
				$.home.data.tecLab2 = $.lng.tr('HOME-TEC-LABEL2');
				$.home.data.serverButLab = $.lng.tr('HOME-SERVER-LABEL');
				$.home.data.clientButLab = $.lng.tr('HOME-CLIENT-LABEL');
				$.home.data.codeDispoLab = $.lng.tr('HOME-CODE-DISPO');
				$.home.data.helpTitle = $.lng.tr('HOME-HELP-TITLE');
				$.home.data.helpLab = $.lng.tr('HOME-HELP-LABEL');
				$.home.data.contactLab = $.lng.tr('HOME-CONTACT-LABEL');
				$.home.data.canvasWidth = ($('#event').width()<600)? $('#event').width()-25 : $('#event').width()/2-50;
				$.home.data.list = [{img:'font-awesome', lien:'http://fortawesome.github.io/Font-Awesome/'}, 
					{img:'crp', lien:'https://github.com/chagry/CRP-Crypt'},
					{img:'bootstrap', lien:'http://getbootstrap.com/'},
					{img:'jQuery', lien:'http://jquery.com/'},
					{img:'d3js', lien:'http://d3js.org/'},
					{img:'springy', lien:'http://getspringy.com/'},
					{img:'json', lien:'https://github.com/datagraph/jquery-jsonrpc'},
					{img:'validate', lien:'http://jqueryvalidation.org/'},
					{img:'jGrowl', lien:'https://github.com/stanlemon/jGrowl'},
					{img:'gmap', lien:'http://gmap3.net/en/'},
					{img:'carousel', lien:'http://owlgraphic.com/owlcarousel/'},
					{img:'flipFlok', lien:'http://flipclockjs.com/'},
					{img:'moment', lien:'http://momentjs.com/'},
					{img:'mustache', lien:'https://github.com/janl/mustache.js'},
					{img:'spark', lien:'http://omnipotent.net/jquery.sparkline'},
					{img:'dataTable', lien:'http://www.datatables.net/'},
					{img:'xChart', lien:'http://tenxer.github.io/xcharts/'}
				];
				
				// Remove tooltip.
				$('.tooltip').remove();
				
				// Animation complete.
				$('#conten').slideUp(500, function() {
					
					// add tmpl. home.
					$('#conten').empty().mustache('home', $.home.data);
						
					// If resize.
					$(window).resize(function() {
						
						// resize canvas.
						$('#viewport').width($('#viewportConten').width());
					});
					
					// Animation complete.
					$('#conten').slideDown(500, function() {
						
						// Setup Springy.
						var sys = new Springy.Graph();
						
						// Part Serveur.
						sys.addNodes(
							{label:'Json RPC', color:'b94a48'},
							{label:'RPC Server', color:'3a87ad'},
								{label:'Library', color:'468847'},
								{label:'Api', color:'468847'},
								{label:'Model', color:'468847'},
								{label:'Controller', color:'468847'}
						);
						
						// Part Client.
						sys.addNodes(
							{label:'RPC Client', color:'3a87ad'},
								{label:'D3', color:'468847'},
								{label:'Bootstrap', color:'468847'},
								{label:'Mustache', color:'468847'},
								{label:'jQuery', color:'468847'}
						);
						
						// add Edges
						sys.addEdges(
							['Json RPC', 'RPC Client'],
							['Json RPC', 'RPC Server'],
								['RPC Client', 'D3'],
								['RPC Client', 'Bootstrap'],
								['RPC Client', 'Mustache'],
								['RPC Client', 'jQuery'],
								['RPC Server', 'Library'],
								['RPC Server', 'Api'],
								['RPC Server', 'Model'],
								['RPC Server', 'Controller']
						);
						
						// Setup graph.
						var springy = $('#viewport').springy({
							graph: sys/*,
							nodeSelected: function(node){
								
								sys.addNodes(
									{label:node.data.label+'A', color:'ac2925'},
									{label:node.data.label+'B', color:'ac2925'}
								);
								
								sys.addEdges(
									[node.data.label, node.data.label+'A'],
									[node.data.label, node.data.label+'B']
								);
							}*/
						});
						
						// Caroussel.
						var owl = $("#owl-demo");
						owl.owlCarousel({
							items : 4, //10 items above 1000px browser width
							itemsDesktop : [1000,3], //5 items between 1000px and 901px
							itemsDesktopSmall : [900,3], // betweem 900px and 601px
							itemsTablet: [600,2], //2 items between 600 and 0
							itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
						});
					});
				}); 
			},
		}
	});
	
})(jQuery);