/*
 * @version		0.4
 * @date Crea	04/12/2013.
 * @date Modif	07/12/2013.
 * @package		mod.home.home.js
 * @contact		chagry.fr - git@chagry.fr
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
				$.home.data.canvasWidth = $('#event').width();
				
				// Remove tooltip.
				$('.tooltip').remove();
				
				// Animation complete.
				$('#conten').slideUp(500, function() {
					
					// add tmpl. home.
					$('#conten').empty().mustache('home', $.home.data);
						
					// If resize.
					$(window).resize(function() {
						
						// resize canvas.
						$('#viewport').width($('#conten').width());
					});
					
					// Animation complete.
					$('#conten').slideDown(500, function() {
						
						// Setup Springy.
						var sys = new Springy.Graph();
						
						// Protocole
						sys.addNodes(
							{label:'Http', color:'ac2925'},
							{label:'Json RPC', color:'ac2925'},
								{label:'Server', color:'47778F'},
								{label:'Client', color:'398439'},
								{label:'Content', color:'47778F'},
									{label:'Css', color:'5bc0de'},
									{label:'Html', color:'5bc0de'},
									{label:'Font', color:'5bc0de'},
									{label:'Images', color:'5bc0de'},
									{label:'Translate', color:'5bc0de'}
						);
						
						// Part Serveur.
						sys.addNodes(
							{label:'Php', color:'47778F'},
								{label:'Sql', color:'47778F'},
							{label:'RPC Server', color:'ed9c28'},
								{label:'Library', color:'ed9c28'},
								{label:'Sys', color:'ed9c28'},
									{label:'Acl', color:'ed9c28'},
									{label:'Archive', color:'ed9c28'},
									{label:'db', color:'ed9c28'},
									{label:'Email', color:'ed9c28'},
									{label:'Session', color:'ed9c28'},
									{label:'User', color:'ed9c28'},
								{label:'Model', color:'ed9c28'},
									{label:'Your codes', color:'88268D'},
								{label:'Controller', color:'ed9c28'}
						);
						
						// Part Client.
						sys.addNodes(
							{label:'Mac', color:'5cb85c'},
							{label:'Linux', color:'5cb85c'},
							{label:'Windows', color:'5cb85c'},
							{label:'Android', color:'5cb85c'},
							{label:'iPhone', color:'5cb85c'},
							{label:'Browser', color:'5cb85c'},
							{label:'PhoneGap', color:'adadad'},
								{label:'RPC Client', color:'ed9c28'},
									{label:'D3', color:'ed9c28'},
									{label:'Bootstrap', color:'ed9c28'},
									{label:'Mustache', color:'ed9c28'},
									{label:'jQuery', color:'ed9c28'},
										{label:'Widget', color:'ed9c28'},
										{label:'Module', color:'ed9c28'},
											{label:'Your render', color:'88268D'},
										{label:'Plug', color:'ed9c28'}
						);
						
						// add Edges
						sys.addEdges(
							['Json RPC', 'Server'],
							['Json RPC', 'Client'],
							['Content', 'Http'],
								['Content', 'Css'],
								['Content', 'Html'],
								['Content', 'Font'],
								['Content', 'Images'],
								['Content', 'Translate'],
							['Http', 'Client'],
								['Client', 'Mac'],
								['Client', 'Linux'],
								['Client', 'Windows'],
								['Client', 'Android'],
								['Client', 'iPhone'],
								['Client', 'Browser'],
								['PhoneGap', 'iPhone'],
								['PhoneGap', 'Android'],
								['PhoneGap', 'RPC Client'],
									['Browser', 'RPC Client'],
										['RPC Client', 'D3'],
										['RPC Client', 'Bootstrap'],
										['RPC Client', 'Mustache'],
										['RPC Client', 'jQuery'],
											['jQuery', 'Widget'],
											['jQuery', 'Module'],
												['Module', 'Your render'],
											['jQuery', 'Plug'],
							['Server', 'Php'],
								['Sql', 'Model'],
							['Php', 'RPC Server'],
								['RPC Server', 'Library'],
								['RPC Server', 'Sys'],
									['Sys', 'Acl'],
									['Sys', 'Archive'],
									['Sys', 'db'],
									['Sys', 'Email'],
									['Sys', 'Session'],
									['Sys', 'User'],
								['RPC Server', 'Model'],
									['Your codes', 'Model'],
									['Your codes', 'Controller'],
								['RPC Server', 'Controller']
						);
						
						// Setup graph.
						var springy = $('#viewport').springy({
							graph: sys/*,
							nodeSelected: function(node){
							
								// Protocole
								sys.addNodes(
									{label:node.data.label+'A', color:'ac2925'},
									{label:node.data.label+'B', color:'ac2925'}
								);
						
								// add Edges
								sys.addEdges(
									[node.data.label, node.data.label+'A'],
									[node.data.label, node.data.label+'B']
								);
								
								//Node selected: {"id":"Library","data":{"label":"Library","color":"ed9c28"},"_width":{"Library":61}}
								//console.log('Node selected: ' +JSON.stringify(node));
							}*/
						});
					});
				}); 
			},
		}
	});
	
})(jQuery);