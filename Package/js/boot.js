/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	18/02/2014.
 * @package		boot.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*All
 */

$(function() {
	
	// Init le JSON RPC url & NameSpace.
	$.jsonRPC.setup({ endPoint : 'http://domain.com/beta/api/', namespace : '' });
	
	// Langue dispo.
	$.lng.setList(['en', 'fr']);
	
	// initialization establishes path and the base translate.
	$.linguaInit('http://domain.com/beta/translate/', 'defaut');
	
	// try loading the default language.
	$.linguaLoad($.lng.get());
	
	//Gestion notification. not add buton if erreur.
	$.jGrowl.defaults.closerTemplate = '';
	
	// Langue actu for date
	moment.lang($.lng.get());
	
	// Setup module. !!! Respect order and dependance !!!
	$.tmpl.setup();
		$.lng.setup();
			$.home.setup();
			$.user.setup();
});