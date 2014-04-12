/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	04/04/2014.
 * @package		boot.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*All
 */

$(function() {
	
	// Load model.
	$.getJSON( "js/boot.json", function(e) {
		
		// Setup model.
		$.extend({model : e});
		
		// Init le JSON RPC url & NameSpace.
		$.jsonRPC.setup({ endPoint : $.model.api, namespace : '' });
		
		// initialization establishes path and the base translate.
		$.linguaInit($.model.lng.url, $.model.lng.file);
		
		// try loading the default language.
		$.linguaLoad($.lng.get());
		
		// Langue actu for date
		moment.lang($.lng.get());
		
		//Gestion notification. not add buton if erreur.
		$.jGrowl.defaults.closerTemplate = '';
		
		// New func load json. @param 1-name json file 2-callback function.
		$.model.load = function(e, callback) {
			
			// Load model.
			$.getJSON( $.model.plug.url+e+'/'+e+'.json', function(data) {
				
				// add loading model.
				$.model[e]=data;
				
				// If call back.
				if(callback) callback();
			});
		}
		
		// Extend model : Func translate return html.
		$.model.tr = function(){ return function(text, render){ return $.lng.tr(render(text), true)}};
		
		// Extend model : Func translate return text.
		$.model.trx = function(){ return function(text, render){ return $.lng.tr(render(text))}};
		
		// Extend model : Func date return from now.
		$.model.FROMNOW = function(){ return function(text, render){ return moment(render(text), 'X').fromNow()}};
		
		// Extend model : Func date return LLLL.
		$.model.LLLL = function(){ return function(text, render){ return moment(render(text), 'X').format('LLLL')}};
		
		// Extend model : Func date return YMD.
		$.model.YMD = function(){ return function(text, render){ return moment(render(text), 'X').format('YYYY/MM/DD')}};
		
		// Extend model : Func date return H.
		$.model.H = function(){ return function(text, render){ return moment(render(text), 'X').format('HH:mm')}};
		
		// Setup plugin.
		$.each($.model.plug.list, function(key, val) {
			
			//setup module.
			$[val].setup();
		});
	});
});