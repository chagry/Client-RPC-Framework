/*
 * @version 0.5.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	user.user.js
 */

(function($, undefined) {
	
	$.extend( {
		
		user: {
			
			/**
			 * Funct setup.
			 */
			setup: function() {
				
				// Load model.
				$.m.load('user');
				
				// event. setup listen.
				$('#'+$.m.div.event).one($.m.event.setup, $.user.defautHtml);
			},
			
			/**
			 * html defaut.
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('user', function () {
					
					// add menu Login.
					$('#'+$.m.div.menu).mustache('mUser', $.m, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mUser button').tooltip();
					
					// add modal Login.
					$('#'+$.m.div.event).mustache('loginModal', $.m);
					
					// Setup form login.
					$.user.formLoginHtml();
				});
			},
			
			/**
			 * html formLogin. Formulaire login.
			 */
			formLoginHtml: function() {
				
				// Data for html.
				$.m.user.vars = {};
				$.m.user.info = {};
				
				// Mail cookie.
				var userCookie = $.cookie($.m.user.cookie);
				// if cookie.
				if(userCookie!=undefined) {
					
					// Decrypt id session.
					var userMail = $.base64.decode(userCookie);
					// preg_match mail.
					var reg =/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,5}$/;
					// if code md5.
					if(reg.test(userMail)) {
						// Data for html.
						$.m.user.vars.cookieMail = userMail;
					}
				}
				
				// Anim Up.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('login', $.m);
					
					// Anim Down.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.m.user.form.login).validate();
						
						// event. Form login. listen.
						$('#'+$.m.user.form.login).on($.m.user.form.login, $.user.formLoginPinHtml);
					});
				});
			},
			
			/**
			 * html formLoginPin. Formulaire login code pin.
			 */
			formLoginPinHtml: function() {
				
				// event off.
				$('#'+$.m.user.form.login).off($.m.user.form.login);
				
				// open spinner. 1-div 2-icone name.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// add local mail for connexion.
				$.m.user.vars.mail = $('#'+$.m.user.form.login+' #email').val();
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// connexion serveur.
					$.jsonRPC.request('login_identification', {
						
						// Param send.
						params : [$.base64.encode($.m.user.vars.mail)],
						
						// succees.
						success : function(data) {
							
							// add local id session crypter.
							$.m.user.vars.session = data.result.session;
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('pin', $.m).mustache('pinParam', $.m);
							
							// Animation stop.
							$('#login').slideDown(500, function() {
								
								// Valid Form.
								$('#'+$.m.user.form.pin).validate();
								
								// event. Form login.
								$('#'+$.m.user.form.pin).on($.m.user.form.pin, $.user.loginFunc);
								
								// Boucle btn pin.
								$('#btnPin .btn').each(function() {
									
									// click btn
									$(this).click(function() {
										
										// Play sound.
										$.voix.play($.m.voix.sound.btnOver);
									});
								});
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
							});
						},
						
						// erreur serveur.
						error : function(data) {
							
							// erreur.
							$.tmpl.error(data.error);
							
							// formulaire login.
							$.user.formLoginHtml();
							
							// close spinner.
							$.tmpl.spinOff('loginSpin', 'fa-user');
						}
					});
				});
			},
			
			/**
			 * html loginFunc. fonction de connexion.
			 */
			loginFunc: function() {
				
				// event off.
				$('#'+$.m.user.form.pin).off($.m.user.form.pin);
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// add local mail.
				$.m.user.vars.password=$.sha1($('#'+$.m.user.form.pin+' #password').val());
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// Decrypt id session.
					var tmpPin = $.crp.decrypte($.m.user.vars.session, $.m.user.vars.password);
					
					// preg_match.
					var reg =/^[a-f0-9]{32}$/;
					
					// if code md5.
					if(reg.test(tmpPin)) {
					
						// connexion serveur.
						$.jsonRPC.request('login_connexion', {
								 
							// Param send. 1-session 2-mailCRP 3-langueCRP
							params : [tmpPin, 
								$.crp.crypte($.m.user.vars.mail, $.m.user.vars.password),
								$.crp.crypte($.lng.get(), $.m.user.vars.password)
							],
							
							// succees.
							success : function(data) {
								
								// add id session.
								$.m.user.vars.session =	 $.crp.decrypte(data.result.session, $.m.user.vars.password);
								
								// Decode info user.
								$.m.user.info = JSON.parse($.crp.decrypte(data.result.user, $.m.user.vars.password));
								
								// empty div login.
								$('#login').empty();
									
								// Close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
								
								// Func login.
								$.user.login();
							},
							
							// erreur serveur.
							error : function(data) {
								
								// erreur.
								$.tmpl.error(data.error);
								
								// formulaire login.
								$.user.formLoginHtml();
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
							}
						});
					}
					
					// if pin invalide.
					else {
						
						// erreur.
						$.tmpl.error('DEF-CODE-PIN-INVALID');
						
						// formulaire login.
						$.user.formLoginHtml();
						
						// close spinner.
						$.tmpl.spinOff('loginSpin', 'fa-user');
					}
				});
			},
			
			/**
			 * Funct login.
			 */
			login: function() {
				
				// If not connexion.
				if(!$.m.user.log) {
					
					// Clean windows.
					$.tmpl.clean();
					
					// delete modal login.
					$('#loginModal').remove();
					
					// delete menu user.
					$('#mUser').remove();
					
					// add menu profil.
					$('#'+$.m.div.menu).mustache('mProfil', $.m, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mProfil button').tooltip();
					
					// add modal profil.
					$('#'+$.m.div.event).mustache('profilModal', $.m);
					
					// Loger connexion.
					$.m.user.log=true;
					
					// Open spinner.
					$.tmpl.spinOn('profilSpin', 'fa-user');
					
					// connexion serveur.
					$.jsonRPC.request('login_historique_'+$.user.session(), {
						
						// Param send.
						params : [$.crp.crypte('control', $.user.password())],
						
						// succees.
						success : function(data) {
							
							// return result.
							$.m.user.vars.historique = data.result.historique;
							$.m.user.vars.chart = data.result.chart;
							$.m.user.vars.MD5mail = $.md5($.trim($.m.user.info.email.toString().toLowerCase()));
							
							// Setup html profil.
							$.user.profil();
							
							// New Cookie mail.
							$.cookie('user', $.base64.encode($.m.user.info.email));
							
							// Close spinner.
							$.tmpl.spinOff('profilSpin', 'fa-user');
							
							// event. login. trigger.
							$('#'+$.m.div.event).trigger('login');
						},
						
						// erreur serveur.
						error : function(data) {
							
							// init api.
							location.reload();
						}
					});
				}
			},
			
			/**
			 * Funct session.
			 */
			session: function() {
				
				// if session exist.
				if($.m.user.log) return $.m.user.vars.session;
				
				// else ruturn false.
				else return false;
			},
			
			/**
			 * Funct password.
			 */
			password: function() {
				
				// if session exist.
				if($.m.user.log) return $.m.user.vars.password;
				
				// else ruturn false.
				else return false;
			},
			
			/**
			 * profil.
			 */
			profil: function() {
				
				// Extend model user. function for see is mail secu existe.
				$.m.user.func.classSecurity = function(){ 
					return ($.m.user.info.email==$.m.user.info.verif)? 'btn-danger' : 'btn-success'
				};
				
				// Extend model user. function Ip client or System.
				$.m.user.func.classIpOrSys = function(){
					return (this.usip=='system')? 'warning' : 'good'
				};
				
				// Extend model user. function Ip client or System.
				$.m.user.func.spanIpOrSys = function(){ 
					return (this.usip=='system')? '<span class="badge">'+this.usip+'</span>' : '<span class="text-success"><small>'+this.usip+'</small></span>'
				};
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation stop.
				$('#'+$.m.div.content).slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#'+$.m.div.content).empty().mustache('user', $.m);
					
					// table data.
					$('#historyTab').dataTable({
						"sPaginationType"	: "bs_four_button",
						"iDisplayLength"	: 10,
						"bInfo"				: true,
						"bPaginate"			: true,
						"bFilter"			: true,
						"bLengthChange"		: true,
						"bSort"				: true,
					}).fnSort([[0,'desc']]);
					
					// Boucle table data.
					$('#historyTab').each(function(){
						var datatable = $(this);
						
						// SEARCH - Add the placeholder for Search and Turn this into in-line form control
						var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
						search_input.attr('placeholder', $.lng.tr('DEF-SEARCH'));
						search_input.addClass('form-control input-sm');
						
						// LENGTH - Inline-Form control
						var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
						length_sel.addClass('form-control input-sm');
					});
					
					// Animation stop.
					$('#'+$.m.div.content).slideDown(500, function() {
						
						// Content array chart.
						var arrChart = new Array();
						// Boucle result chart.
						$.each($.m.user.vars.chart, function(key, value) {
							
							// add result chart.
							arrChart.push({
								x	:	$.lng.tr(key),
								y	:	value
							});
						});
						
						// Var for chart.
						var dataVar = {
							"xScale"	: "ordinal",
							"yScale"	: "linear",
							"main"		: [{
								"className": ".action",
								"data": arrChart
							}]
						};
						
						// Option chart.
						var opts = {
							"axisPaddingTop"	: 5,
							"paddingLeft"		: 0,
							"tickFormatX"		: function (x) {
								return '...'+x.substring(x.length-6, x.length);
							},
							"mouseover"			: function (d, i) {
								$(this).tooltip({
									"title"		: d.x+' '+d.y,
									"container"	:"body"
								}).tooltip('show');
							},
							
							"mouseout": function (x) {
								$(this).tooltip('hide');
							}
						};
						
						// Charts historique
						var myChart = new xChart('bar', dataVar, '#userChart', opts);
						
						// Animation background img.
						$('.noir').pan({fps: 12, speed: 1, dir: 'left'});
						$('.noir').pan({fps: 12, speed: 1, dir: 'down'});
						
						// Add btn scroll top. 1-id div
						$.tmpl.tagScroll('scrollTopBtn');
					});
				});
			},
			
			/**
			 * Funct logout.
			 */
			logout: function() {
				
				// If connexion.
				if($.m.user.log) {
					
					// Clean windows.
					$.tmpl.clean();
					
					// delet modal login.
					$('#profilModal').remove();
					
					// delet menu user.
					$('#mProfil').remove();
					
					// Loger connexion.
					$.m.user.log=false;
					
					// add menu Login.
					$('#'+$.m.div.menu).mustache('mUser', $.m, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mUser button').tooltip();
					
					// add modal Login.
					$('#'+$.m.div.event).mustache('loginModal', $.m);
					
					// Setup form login.
					$.user.formLoginHtml();
					
					// Setup home.
					$.home.accueil();
					
					// event. logout. trigger.
					$('#'+$.m.div.event).trigger('logout');
				}
			},
			
			/**
			 * Funct editMail.
			 *	@param a -> edit mail param.
			 */
			editMail: function(a) {
				
				// Open spinner.
				$.tmpl.spinOn('profilSpin', 'fa-user');
				
				// modal.
				$.tmpl.modal('profilModal');
				
				// Data edit.
				$.m.user.vars.edit={};
				$.m.user.vars.edit.config = a;
				
				// See is mail first or security.
				switch (a)
				{
					case "principal":
						$.m.user.vars.edit.titre = 'USER-MAIL-FIRST-LABEL';
						$.m.user.vars.edit.desc = 'USER-MAIL-FIRST-DESC';
						$.m.user.vars.edit.mail = $.m.user.info.email;
					break;
					
					case "security":
						$.m.user.vars.edit.titre = 'USER-MAIL-SECU-LABEL';
						$.m.user.vars.edit.desc = 'USER-MAIL-SECU-DESC';
						$.m.user.vars.edit.mail = $.m.user.info.verif;
					break;
				}
				
				// add tmpl. Form Login.
				$('#profil').empty().mustache('editForm', $.m);
				
				// Valid Form.
				$('#'+$.m.user.form.edit).validate();
				
				// event. Form login.
				$('#'+$.m.user.form.edit).on($.m.user.form.edit, $.user.editConfirm);
				
				// Close spinner.
				$.tmpl.spinOff('profilSpin', 'fa-user');
			},
			
			/**
			 * Funct formEditConfirm.
			 */
			editConfirm: function() {
				
				// if new mail != mail actu.
				if($.m.user.info.email!=$('#'+$.m.user.form.edit+' #email').val()) {
					
					// stop envent.
					$('#'+$.m.user.form.edit).off($.m.user.form.edit);
					
					// save local mail.
					$.m.user.vars.edit.mail=$('#'+$.m.user.form.edit+' #email').val();
					
					// Anim stop.
					$('#profil').slideUp(500, function() {
								
						// add tmpl. Form edit confirm code pin.
						$('#profil').empty().mustache('codePin', $.m);
								
						// Anim play.
						$('#profil').slideDown(500, function() {
								
							// Valid Form.
							$('#'+$.m.user.form.editPin).validate();
							
							// event. edit confirm. listen.
							$('#'+$.m.user.form.editPin).on($.m.user.form.editPin, $.user.editFunc);
							
							// Boucle btn pin.
							$('#btnPin .btn').each(function() {
								
								// click btn
								$(this).click(function() {
									
									// Play sound.
									$.voix.play($.m.voix.sound.btnOver);
								});
							});
						});
					});
				}
				
				// If actu mail. erreur.
				else $.tmpl.error('USER-MAIL-NOT-CHANGE');
			},
			
			/**
			 * Funct editFunc.
			 */
			editFunc: function() {
				
				// if password.
				if($.m.user.vars.password==$.sha1($('#'+$.m.user.form.editPin+' #password').val())) {
					
					// event.
					$('#'+$.m.user.form.editPin).off($.m.user.form.editPin);
					
					// Close modal profil.
					$.tmpl.modal('profilModal');
					
					// open spinner.
					$.tmpl.spinOn('profilSpin', 'fa-user');
					
					// Anim stop.
					$('#profil').slideUp(800, function() {
						
						// connexion serveur.
						$.jsonRPC.request('login_editMail_'+$.user.session(), {
							
							// Param send.
							params : [
								$.crp.crypte($.m.user.vars.edit.mail, $.user.password()),
								$.crp.crypte($.m.user.vars.edit.config, $.user.password())
							],
							
							// succees.
							success : function(data) {
								
								// Switch reponse.
								switch (data.result.config) {
									
									// If edit mail first.
									case "principal":
										
										// Add new mail.
										$.m.user.info.email=data.result.email;
									break;
									
									// If edit mail security.
									case "security":
										
										// Add new mail.
										$.m.user.info.verif=data.result.email;
									break;
								}
								
								// add historique.
								$.m.user.vars.historique.push({
									date:	data.result.date,
									action:	data.result.action,
									usip:	data.result.usip
								});
								
								// var zero.
								$.m.user.vars.edit={};
								
								// Close spinner.
								$.tmpl.spinOff('profilSpin', 'fa-user');
									
								// Setup html profil.
								$.user.profil();
								
								// Anim play.
								$('#profil').slideDown(100);
							},
							
							// erreur serveur.
							error : function(data) {
								
								// erreur.
								$.tmpl.error(data.error);
								
								// close spinner.
								$.tmpl.spinOff('profilSpin', 'fa-user');
								
								// Anim play.
								$('#profil').slideDown(100);
							}
						});
					});
				}
				
				// if not password. erreur.
				else $.tmpl.error('DEF-CODE-PIN-INVALID');
			},
			
			/**
			 * html signupHtml. Formulaire signup.
			 */
			signupHtml: function() {
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('signup', $.m);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.m.user.form.signup).validate();
						
						// event. Form login.
						$('#'+$.m.user.form.signup).on($.m.user.form.signup, $.user.signupFunc);
					});
				});
			},
			
			/**
			 * html signupFunc.
			 */
			signupFunc: function() {
				
				// event. signup. off.
				$('#'+$.m.user.form.signup).off($.m.user.form.signup);
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// connextion serveur.
					$.jsonRPC.request('login_inscription', {
						
						// Param send.
						params : [$.base64.encode($('#'+$.m.user.form.signup+' #email').val()), $.base64.encode($.lng.get())],
						
						// succees.
						success : function(data) {
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('signupConfirm', $.m);
							
							// Animation stop.
							$('#login').slideDown(500, function() {
															
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
							});
						},
						
						// erreur serveur.
						error : function(data) {
							
							// erreur.
							$.tmpl.error(data.error);
							
							// form login.
							$('#login').slideDown(500, function() {
								
								// event. signup. listen.
								$('#'+$.m.user.form.signup).on($.m.user.form.signup, $.user.signupFunc);
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
							});
						}
					});
				});
			},
			
			/**
			 * html secuPinHtml. Formulaire pour decrypt code pin.
			 */
			secuPinHtml: function() {
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('secu', $.m);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.m.user.form.secu).validate();
						
						// event. Form login.
						$('#'+$.m.user.form.secu).on($.m.user.form.secu, $.user.secuFunc);
					});
				});
			},
			
			/**
			 * html secuFunc. Decrypt code pin.
			 */
			secuFunc: function() {
				
				// event.
				$('#'+$.m.user.form.secu).off($.m.user.form.secu);
				
				try {
					// decrypte inputs strings.
					var tmps=$.crp.decrypte($('#'+$.m.user.form.secu+' #pin').val(), $('#'+$.m.user.form.secu+' #cles').val());
					
					// if code lengyh 6.
					if(tmps.length==6) {
					
						// Data for html.
						$.m.user.vars.pinCode = tmps;
						
						// Animation complete.
						$('#login').slideUp(500, function() {
							
							// Ajout tmpl. Form Login.
							$('#login').empty().mustache('secuDecrypte', $.m);
							
							// Animation complete.
							$('#login').slideDown(500, function() {});
						});
					}
					
					// if pin invalide.
					else {
						
						// erreur.
						$.tmpl.error('DEF-CODE-PIN-INVALID');
						
						// event. Form login.
						$('#'+$.m.user.form.secu).on($.m.user.form.secu, $.user.secuFunc);
					}
				}
				
				catch(er){
				
					// erreur.
					$.tmpl.error('DEF-CODE-PIN-INVALID');
					
					// event. Form login.
					$('#'+$.m.user.form.secu).on($.m.user.form.secu, $.user.secuFunc);
				}
			},
			
			/**
			 * html forgotHtml. Form forgot code pin.
			 */
			forgotHtml: function() {
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('forgot', $.m);
										
					// Animation stop.
					$('#login').slideDown(500, function() {});
				});
			},
			
			/**
			 * html forgotFunc. reset code pin.
			 */
			forgotFunc: function() {
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// Anim stop.
				$('#login').slideUp(500, function() {
					
					// connexion serveur.
					$.jsonRPC.request('login_forgotCodePin', {
						
						// Param send.
						params : [$.base64.encode($.m.user.vars.mail)],
						
						// succees.
						success : function(data) {
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('forgotConfirm', $.m);
							
							// Animation stop.
							$('#login').slideDown(500, function() {
														
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
							});
						},
						
						// erreur serveur.
						error : function(data) {
							
							// erreur.
							$.tmpl.error(data.error);
							
							// form login.
							$('#login').slideDown(500, function() {
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
							});
						}
					});
				});
			},
		}
	});
	
})(jQuery);