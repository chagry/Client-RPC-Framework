/*
 * @version		0.4
 * @date Crea	11/09/2013.
 * @date Modif	10/12/2013.
 * @package		boot.js
 * @contact		chagry.fr - git@chagry.fr
 * @Dependence	*All
 */

$(function() {
	
	// Init le JSON RPC url & NameSpace.
	$.jsonRPC.setup({ endPoint : 'http://domain.com/beta/api/', namespace : '' });
	
	// Langue dispo.
	$.lng.setList(['en', 'fr', 'de', 'ru']);
	
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