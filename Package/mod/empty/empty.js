/*
 * @version 0.7.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	home.home.js
 */

(function($, undefined) {
	
	$.extend( {
		
		empty: {
			
			/*
			 * Funct setup. Init mod home.
			 */
			setup: function() {
				
			},
			
			/*
			 * Funct emptyPage.
			 */
			emptyPage: function() {
				
				// Clean windows.
				$.tmpl.clean();
					
				// add tmpl homePage.
				$('#'+$.m.div.page).empty().mustache('emptyPage', $.m);
			},
		}
	});
	
})(jQuery);