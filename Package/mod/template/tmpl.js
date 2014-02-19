/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	18/02/2014.
 * @package		mod.template.tmpl.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*lng.js
 */

(function($, undefined) {

	$.extend( {
	
		tmpl: {
			 
			/*
			 * Funct setupValidatorForm. validator form. 0.4
			 */
			setupValidatorForm : function() {
				
				// Param validation input.
				jQuery.validator.setDefaults( { 
					
					// regle input.
					rules: {
						email:			{required:true, email: true},
						password:		{required:true, minlength: 4, number: true},
						accept:			{required:true},
						pin:			{required:true},
						cles:			{required:true},
						inputSecuCode:	{required:true, minlength: 32}
					},
					
					// Message.
					messages: {
						
						email: {
							required:		function() { return $.lng.tr('FORM-MESSAGE-EMAIL-REQUIRED'); },
							email:			function() { return $.lng.tr('FORM-MESSAGE-EMAIL-INVALID'); }
						},
						
						accept: {
							required:		function() { return $.lng.tr('FORM-MESSAGE-VALIDATION-FORM-FAILED'); }
						},
						
						pin: {
							required:		function() { return $.lng.tr('FORM-MESSAGE-PIN-REQUIRED'); }
						},
						
						cles: {
							required:		function() { return $.lng.tr('FORM-MESSAGE-KEY-REQUIRED'); }
						},
						
						password: {
							required:		function() { return $.lng.tr('FORM-MESSAGE-CODE-PIN-REQUIRED'); },
							minlength:		function() { return $.lng.tr('FORM-MESSAGE-CODE-PIN-MIN'); },
							number:			function() { return $.lng.tr('FORM-MESSAGE-CODE-PIN-INVALID'); }
						}
					},
					
					// class erreur
					errorClass:			"help-block",
					errorElement:		"small",
					
					// div render.
					errorPlacement: function(error, e) {
						
						// div erreur.
						error.appendTo($(e).parents(".form-group"));
					},
					
					// if input good.
					highlight:function(e, errorClass, validClass) {
						
						// add class erreur.
						$(e).parents('.form-group').addClass('has-error');
						// if success.
						$(e).parents('.form-group').removeClass('has-success'); 
					},
					
					// Si bad input.
					unhighlight: function(e, errorClass, validClass) {
						
						// if erreur.
						$(e).parents('.form-group').removeClass('has-error');
						// add class success.
						$(e).parents('.form-group').addClass('has-success');
					},
					
					// after valid.
					submitHandler: function(form) {
						
						// Event.
						$('#'+form.id).trigger(form.id);
					}
				});
			},
			
			/*
			 * Funct setup. 0.4
			 */
			setup: function() {
				
				// empty conten.
				$('#conten').empty().css("display", "none");
				
				// Load tmpl.
				$.Mustache.load('mod/template/defaut.htm').done(function () {
				
					// Event template start.
					$('#event').trigger('startTmpl');
					
					// Init valide form.
					$.tmpl.setupValidatorForm();
				});
			},
			
			/*
			 * spinOn. add spinner.
			 * @param e div conteneur balise i. 0.4.
			 * @param i name icon.
			 */
			spinOn: function(e, i) {
				
				// add in tmpl.
				$('#'+e+' i').removeClass(i).addClass('fa fa-spinner fa-spin');
			},
			
			/*
			 * spinOff. close spinner. 0.4
			 * @param e div conteneur.
			 * @param i name icone add.
			 */
			spinOff: function(e, i) {
			
				// remove icone.
				$('#'+e+' i').removeClass('fa fa-spinner fa-spin').addClass(i);
			},
			
			/*
			 * Funct error. 0.4
			 * @param e Message erreur.
			 */
			error: function(e) {
				
				// if critique erreur.
				if (e=='SERV-ERROR-SESSION-EXPIRE'||e=='SERV-ERROR-ACCESS-NO-CONNECT'||e=='SERV-ERROR-USER-BLACKLISTED'||e=='SERV-ERROR-OFFLINE-MESSAGE') {
					
					// Data for login form.
					var erreur = { 
							
						messageHtml:		$.lng.tr(e),
						BtnTitre:			$.lng.tr('CANCEL'),
						BtnReloadFunc:		'location.reload();'
					};
					
					// if modal, remove modal.
					$('.modal-backdrop').remove();
					$('.modal-scrollable').remove();
					
					// add tmpl. Form Login.
					$('#event').empty().mustache('erreur', erreur);
				}
				
				// else render notifi.
				else {
					// render erreur.
					$.jGrowl($.lng.tr(e)+' ', { 
						position: 'bottom-right',
						closeTemplate: ' <i class="fa fa-times"></i>'
					});
				}
			},
			
			/*
			 * obj data. 0.4
			 */
			data: {},
			
			/*
			 * modal. 0.4.
			 * @param e div of modal.
			 */
			modal: function(e) {
				
				// Remove tooltip.
				$('.tooltip').remove();
				
				// setup modal.
				$('#'+e).modal('toggle');
			},
			
			/*
			 * clean. Clean windows. 0.5
			 */
			clean: function() {
				
				// Clean windows.
				$('.popover').remove();
				$('.tooltip').remove();
			},
		}
	});
	
})(jQuery);