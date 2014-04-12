/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	04/04/2014.
 * @package		tmpl.tmpl.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*lng.js
 */

(function($, undefined) {

	$.extend( {
	
		tmpl: {
			
			/*
			 * Funct setup. 0.5
			 */
			setup: function() {
				
				// Load model.
				$.model.load('tmpl', function() {
					
					// Load tmpl.
					$.tmpl.load('tmpl', function() {
						
						// Event template start.
						$('#'+$.model.html.event).trigger($.model.event.setup);
						
						// Init valide form.
						$.tmpl.setupValidatorForm();
					});
				});
			},
			
			/*
			 * spinOn. add spinner.
			 * @param e div conteneur balise i. 0.5
			 * @param i name icon.
			 */
			spinOn: function(e, i) {
				
				// add in tmpl.
				$('#'+e+' i').removeClass(i).addClass($.model.tmpl.html.spinClass);
			},
			
			/*
			 * spinOff. close spinner. 0.5
			 * @param e div conteneur.
			 * @param i name icone add.
			 */
			spinOff: function(e, i) {
			
				// remove icone.
				$('#'+e+' i').removeClass($.model.tmpl.html.spinClass).addClass(i);
			},
			
			/*
			 * Funct error. 0.5
			 * @param e Message erreur.
			 */
			error: function(e) {
				
				// boucle error.
				$.each($.model.tmpl.error.blackList, function(key, val) {
					
					// if critique erreur.
					if (e==val) {
						
						// clean.
						$.tmpl.clean();
						
						// Add message.
						$.model.tmpl.error.label = val;
						
						// add tmpl. Form Login.
						$('#'+$.model.html.event).empty().mustache('erreur', $.model);
						
						// Break boucle.
						return false;
					}
				});
				
				// render erreur.
				$.jGrowl($.lng.tr(e, true)+' ', { 
					position: $.model.tmpl.error.position,
					closeTemplate: $.model.tmpl.error.closeIcon
				});
				
				// Play sound after 500ms.
				setTimeout(function() { $.voix.play($.model.tmpl.sound.error); }, 500);
			},
			
			/*
			 * modal. 0.5.
			 * @param e div of modal.
			 */
			modal: function(e) {
				
				// Clean windows.
				$('.popover').remove();
				$('.tooltip').remove();
				
				// If modal in dom. Play sound.
				if($('.modal-backdrop').length > 0) $.voix.play($.model.tmpl.sound.closeWin);
				
				// Play sound.
				else $.voix.play($.model.tmpl.sound.openWin);
				
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
				
				// if modal, remove modal.
				$('.modal-backdrop').remove();
				$('.modal-scrollable').remove();
				
				// Boucle for destroy anim.
				$('#'+$.model.html.content+' div').each(function() {
					
					// resets element and removes animation.
					$(this).destroy();
				});
			},
			
			/*
			 * niceNumber. 0.5. ex: '12 345 542'
			 * @param e The number.
			 * Return string number nice.
			 */
			niceNumber: function(e) {
				
				// return.
				return e.toString().replace(/(\d)(?=(?:\d{3})+(?:$))/g, '$1 ');
			},
			
			/*
			 * anim. animation.css. 0.5
			 * @param e Element.
			 * @param effect The number.
			 * @param r remove class after.
			 * @param callback execut end function.
			 */
			anim: function(e, effect, r, callback) {
				
				// Add animation.
				e.addClass('animated '+ effect);
				
				// Event end animation.
				e.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					
					// if remove anim.
					if(r) e.removeClass('animated '+ effect);
					
					// If call back.
					if(callback) callback(e);
				});
			},
			
			/*
			 * scroll. 0.5.
			 * @param e tag for if.
			 */
			scroll: function(e) {
					
				// If top.
				if(e=='up') {
				    
				    // Scroll up.
				    $('html,body').animate({scrollTop: 0}, 'slow');
				    
				    // Play sound.
				    $.voix.play($.model.tmpl.sound.scroll);
				}
				
				// If b.
				if(e=='down') { 
				    
				    // Scroll down.
				    $('html,body').animate({scrollTop: $(document).height() - $(window).height()}, 'slow');
				    
				    // Play sound.
				    $.voix.play($.model.tmpl.sound.scroll);
				}
			},
			
			/*
			 * tagScroll. 0.5.
			 * @param e id div.
			 */
			tagScroll: function(e) {
				
				// mouse enter btn.
				$('#'+e).html(
					
					// Btn scroll top. mouse enter.
					$($.model.tmpl.html.scrollBtn).mouseenter(function() {
						
						// Anim icon & color text with class.
						$(this).switchClass( $.model.tmpl.html.scrollBtnCl1, $.model.tmpl.html.scrollBtnCl2, 500, "easeOutQuint" );
						
						// Add animation. @param 1-element 2-effect 3-remove anim class after 'default=false' 4-callBack
						$.tmpl.anim($(this), 'pulse', true);
						
						// Play sound.
						$.voix.play($.model.tmpl.sound.click);
					
					// 	mouse leave
					}).mouseleave(function() {
						
						// Anim icon & color text with class.
						$(this).switchClass( $.model.tmpl.html.scrollBtnCl2, $.model.tmpl.html.scrollBtnCl1, 500, "easeOutQuint" );
					})
				);
			},
			
			/*
			 * Funct load. 0.5
			 * @param e file name.
			 * @param callback.
			 */
			load: function(e, callback) {
				
				// Load tmpl.
				$.Mustache.load($.model.plug.url+e+'/'+e+'.htm').done(function () {
				
					// If call back.
					if(callback) callback();
				});
			},
			
			/*
			 * Funct setupValidatorForm. validator form. 0.5
			 */
			setupValidatorForm : function() {
				
				// Param validation input.
				jQuery.validator.setDefaults( { 
					
					// regle input.
					rules: $.model.tmpl.rules,
					
					// Message.
					messages: $.model.tmpl.messages,
					
					// class erreur
					errorClass: "help-block",
					errorElement: "small",
					
					// div render.
					errorPlacement: function(error, e) {
						
						// div erreur.
						error.appendTo($(e).parents(".form-group"));
					},
					
					// invalidHandler.
					showErrors: function(errorMap, errorList) {
						
						// boucle error.
						$.each(errorList, function(key, val) {
							
							//translate error.
							val.message = $.lng.tr(val.message, true);
						});
						
						// Print error.
						this.defaultShowErrors();
					},
					
					// if input good.
					highlight:function(e, errorClass, validClass) {
						
						// add class erreur.
						$(e).parents('.form-group').addClass('has-error');
						// if success.
						$(e).parents('.form-group').removeClass('has-success'); 
					},
					
					// If bad input.
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
		}
	});
	
})(jQuery);