/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	10/04/2014.
 * @package		user.user.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*lng.js home.js
 */

(function($, undefined) {
	
	$.extend( {
		
		user: {
			
			/*
			 * Funct setup. 0.5
			 */
			setup: function() {
				
				// Load model.
				$.model.load('user');
				
				// event. setup listen.
				$('#'+$.model.html.event).one($.model.event.setup, $.user.defautHtml);
			},
			
			/*
			 * html defaut. 0.5
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('user', function () {
					
					// add menu Login.
					$('#'+$.model.html.menu).mustache('mUser', $.model, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mUser button').tooltip();
					
					// add modal Login.
					$('#'+$.model.html.event).mustache('loginModal', $.model);
					
					// Setup form login.
					$.user.formLoginHtml();
				});
			},
			
			/*
			 * html formLogin. Formulaire login. 0.5
			 */
			formLoginHtml: function() {
				
				// Data for html.
				$.model.user.vars = {};
				$.model.user.info = {};
				
				// Mail cookie.
				var userCookie = $.cookie($.model.user.cookie);
				// if cookie.
				if(userCookie!=undefined) {
					
					// Decrypt id session.
					var userMail = $.base64.decode(userCookie);
					// preg_match mail.
					var reg =/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,5}$/;
					// if code md5.
					if(reg.test(userMail)) {
						// Data for html.
						$.model.user.vars.cookieMail = userMail;
					}
				}
				
				// Anim Up.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('login', $.model);
					
					// Anim Down.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.model.user.form.login).validate();
						
						// event. Form login. listen.
						$('#'+$.model.user.form.login).on($.model.user.form.login, $.user.formLoginPinHtml);
					});
				});
			},
			
			/*
			 * html formLoginPin. Formulaire login code pin. 0.5
			 */
			formLoginPinHtml: function() {
				
				// event off.
				$('#'+$.model.user.form.login).off($.model.user.form.login);
				
				// open spinner. 1-div 2-icone name.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// add local mail for connexion.
				$.model.user.vars.mail = $('#'+$.model.user.form.login+' #email').val();
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// connexion serveur.
					$.jsonRPC.request('login_identification', {
						
						// Param send.
						params : [$.base64.encode($.model.user.vars.mail)],
						
						// succees.
						success : function(data) {
							
							// add local id session crypter.
							$.model.user.vars.session = data.result.session;
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('pin', $.model).mustache('pinParam', $.model);
							
							// Animation stop.
							$('#login').slideDown(500, function() {
								
								// Valid Form.
								$('#'+$.model.user.form.pin).validate();
								
								// event. Form login.
								$('#'+$.model.user.form.pin).on($.model.user.form.pin, $.user.loginFunc);
								
								// Boucle btn pin.
								$('#btnPin .btn').each(function() {
									
									// click btn
									$(this).click(function() {
										
										// Play sound.
										$.voix.play($.model.voix.sound.btnOver);
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
			
			/*
			 * html loginFunc. fonction de connexion. 0.5
			 */
			loginFunc: function() {
				
				// event off.
				$('#'+$.model.user.form.pin).off($.model.user.form.pin);
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// add local mail.
				$.model.user.vars.password=$.sha1($('#'+$.model.user.form.pin+' #password').val());
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// Decrypt id session.
					var tmpPin = $.crp.decrypte($.model.user.vars.session, $.model.user.vars.password);
					
					// preg_match.
					var reg =/^[a-f0-9]{32}$/;
					
					// if code md5.
					if(reg.test(tmpPin)) {
					
						// connexion serveur.
						$.jsonRPC.request('login_connexion', {
								 
							// Param send. 1-session 2-mailCRP 3-langueCRP
							params : [tmpPin, 
								$.crp.crypte($.model.user.vars.mail, $.model.user.vars.password),
								$.crp.crypte($.lng.get(), $.model.user.vars.password)
							],
							
							// succees.
							success : function(data) {
								
								// add id session.
								$.model.user.vars.session =	 $.crp.decrypte(data.result.session, $.model.user.vars.password);
								
								// Decode info user.
								$.model.user.info = JSON.parse($.crp.decrypte(data.result.user, $.model.user.vars.password));
								
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
			
			/*
			 * Funct login. 0.5
			 */
			login: function() {
				
				// If not connexion.
				if(!$.model.user.log) {
					
					// Clean windows.
					$.tmpl.clean();
					
					// delete modal login.
					$('#loginModal').remove();
					
					// delete menu user.
					$('#mUser').remove();
					
					// add menu profil.
					$('#'+$.model.html.menu).mustache('mProfil', $.model, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mProfil button').tooltip();
					
					// add modal profil.
					$('#'+$.model.html.event).mustache('profilModal', $.model);
					
					// Loger connexion.
					$.model.user.log=true;
					
					// Open spinner.
					$.tmpl.spinOn('profilSpin', 'fa-user');
					
					// connexion serveur.
					$.jsonRPC.request('login_historique_'+$.user.session(), {
						
						// Param send.
						params : [$.crp.crypte('control', $.user.password())],
						
						// succees.
						success : function(data) {
							
							// return result.
							$.model.user.vars.historique = data.result.historique;
							$.model.user.vars.chart = data.result.chart;
							$.model.user.vars.MD5mail = $.md5($.trim($.model.user.info.email.toString().toLowerCase()));
							
							// Setup html profil.
							$.user.profil();
							
							// New Cookie mail.
							$.cookie('user', $.base64.encode($.model.user.info.email));
							
							// Close spinner.
							$.tmpl.spinOff('profilSpin', 'fa-user');
							
							// event. login. trigger.
							$('#'+$.model.html.event).trigger('login');
						},
						
						// erreur serveur.
						error : function(data) {
							
							// init api.
							location.reload();
						}
					});
				}
			},
			
			/*
			 * Funct session. 0.5
			 */
			session: function() {
				
				// if session exist.
				if($.model.user.log) return $.model.user.vars.session;
				
				// else ruturn false.
				else return false;
			},
			
			/*
			 * Funct password. 0.5
			 */
			password: function() {
				
				// if session exist.
				if($.model.user.log) return $.model.user.vars.password;
				
				// else ruturn false.
				else return false;
			},
			
			/*
			 * profil. 0.5
			 */
			profil: function() {
				
				// Extend model user. function for see is mail secu existe.
				$.model.user.func.classSecurity = function(){ 
					return ($.model.user.info.email==$.model.user.info.verif)? 'btn-danger' : 'btn-success'
				};
				
				// Extend model user. function Ip client or System.
				$.model.user.func.classIpOrSys = function(){
					return (this.usip=='system')? 'warning' : 'good'
				};
				
				// Extend model user. function Ip client or System.
				$.model.user.func.spanIpOrSys = function(){ 
					return (this.usip=='system')? '<span class="badge">'+this.usip+'</span>' : '<span class="text-success"><small>'+this.usip+'</small></span>'
				};
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation stop.
				$('#'+$.model.html.content).slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#'+$.model.html.content).empty().mustache('user', $.model);
					
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
					$('#'+$.model.html.content).slideDown(500, function() {
						
						// Content array chart.
						var arrChart = new Array();
						// Boucle result chart.
						$.each($.model.user.vars.chart, function(key, value) {
							
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
			
			/*
			 * Funct logout. 0.5
			 */
			logout: function() {
				
				// If connexion.
				if($.model.user.log) {
					
					// Clean windows.
					$.tmpl.clean();
					
					// delet modal login.
					$('#profilModal').remove();
					
					// delet menu user.
					$('#mProfil').remove();
					
					// Loger connexion.
					$.model.user.log=false;
					
					// add menu Login.
					$('#'+$.model.html.menu).mustache('mUser', $.model, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mUser button').tooltip();
					
					// add modal Login.
					$('#'+$.model.html.event).mustache('loginModal', $.model);
					
					// Setup form login.
					$.user.formLoginHtml();
					
					// Setup home.
					$.home.accueil();
					
					// event. logout. trigger.
					$('#'+$.model.html.event).trigger('logout');
				}
			},
			
			/*
			 * Funct editMail. 0.5
			 *	@param a -> edit mail param.
			 */
			editMail: function(a) {
				
				// Open spinner.
				$.tmpl.spinOn('profilSpin', 'fa-user');
				
				// modal.
				$.tmpl.modal('profilModal');
				
				// Data edit.
				$.model.user.vars.edit={};
				$.model.user.vars.edit.config = a;
				
				// See is mail first or security.
				switch (a)
				{
					case "principal":
						$.model.user.vars.edit.titre = 'USER-MAIL-FIRST-LABEL';
						$.model.user.vars.edit.desc = 'USER-MAIL-FIRST-DESC';
						$.model.user.vars.edit.mail = $.model.user.info.email;
					break;
					
					case "security":
						$.model.user.vars.edit.titre = 'USER-MAIL-SECU-LABEL';
						$.model.user.vars.edit.desc = 'USER-MAIL-SECU-DESC';
						$.model.user.vars.edit.mail = $.model.user.info.verif;
					break;
				}
				
				// add tmpl. Form Login.
				$('#profil').empty().mustache('editForm', $.model);
				
				// Valid Form.
				$('#'+$.model.user.form.edit).validate();
				
				// event. Form login.
				$('#'+$.model.user.form.edit).on($.model.user.form.edit, $.user.editConfirm);
				
				// Close spinner.
				$.tmpl.spinOff('profilSpin', 'fa-user');
			},
			
			/*
			 * Funct formEditConfirm. 0.5
			 */
			editConfirm: function() {
				
				// if new mail != mail actu.
				if($.model.user.info.email!=$('#'+$.model.user.form.edit+' #email').val()) {
					
					// stop envent.
					$('#'+$.model.user.form.edit).off($.model.user.form.edit);
					
					// save local mail.
					$.model.user.vars.edit.mail=$('#'+$.model.user.form.edit+' #email').val();
					
					// Anim stop.
					$('#profil').slideUp(500, function() {
								
						// add tmpl. Form edit confirm code pin.
						$('#profil').empty().mustache('codePin', $.model);
								
						// Anim play.
						$('#profil').slideDown(500, function() {
								
							// Valid Form.
							$('#'+$.model.user.form.editPin).validate();
							
							// event. edit confirm. listen.
							$('#'+$.model.user.form.editPin).on($.model.user.form.editPin, $.user.editFunc);
							
							// Boucle btn pin.
							$('#btnPin .btn').each(function() {
								
								// click btn
								$(this).click(function() {
									
									// Play sound.
									$.voix.play($.model.voix.sound.btnOver);
								});
							});
						});
					});
				}
				
				// If actu mail. erreur.
				else $.tmpl.error('USER-MAIL-NOT-CHANGE');
			},
			
			/*
			 * Funct editFunc. 0.5
			 */
			editFunc: function() {
				
				// if password.
				if($.model.user.vars.password==$.sha1($('#'+$.model.user.form.editPin+' #password').val())) {
					
					// event.
					$('#'+$.model.user.form.editPin).off($.model.user.form.editPin);
					
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
								$.crp.crypte($.model.user.vars.edit.mail, $.user.password()),
								$.crp.crypte($.model.user.vars.edit.config, $.user.password())
							],
							
							// succees.
							success : function(data) {
								
								// Switch reponse.
								switch (data.result.config) {
									
									// If edit mail first.
									case "principal":
										
										// Add new mail.
										$.model.user.info.email=data.result.email;
									break;
									
									// If edit mail security.
									case "security":
										
										// Add new mail.
										$.model.user.info.verif=data.result.email;
									break;
								}
								
								// add historique.
								$.model.user.vars.historique.push({
									date:	data.result.date,
									action:	data.result.action,
									usip:	data.result.usip
								});
								
								// var zero.
								$.model.user.vars.edit={};
								
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
			
			/*
			 * html signupHtml. Formulaire signup. 0.5
			 */
			signupHtml: function() {
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('signup', $.model);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.model.user.form.signup).validate();
						
						// event. Form login.
						$('#'+$.model.user.form.signup).on($.model.user.form.signup, $.user.signupFunc);
					});
				});
			},
			
			/*
			 * html signupFunc. 0.5
			 */
			signupFunc: function() {
				
				// event. signup. off.
				$('#'+$.model.user.form.signup).off($.model.user.form.signup);
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// connextion serveur.
					$.jsonRPC.request('login_inscription', {
						
						// Param send.
						params : [$.base64.encode($('#'+$.model.user.form.signup+' #email').val()), $.base64.encode($.lng.get())],
						
						// succees.
						success : function(data) {
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('signupConfirm', $.model);
							
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
								$('#'+$.model.user.form.signup).on($.model.user.form.signup, $.user.signupFunc);
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa-user');
							});
						}
					});
				});
			},
			
			/*
			 * html secuPinHtml. Formulaire pour decrypt code pin. 0.5
			 */
			secuPinHtml: function() {
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('secu', $.model);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.model.user.form.secu).validate();
						
						// event. Form login.
						$('#'+$.model.user.form.secu).on($.model.user.form.secu, $.user.secuFunc);
					});
				});
			},
			
			/*
			 * html secuFunc. Decrypt code pin. 0.5
			 */
			secuFunc: function() {
				
				// event.
				$('#'+$.model.user.form.secu).off($.model.user.form.secu);
				
				try {
					// decrypte inputs strings.
					var tmps=$.crp.decrypte($('#'+$.model.user.form.secu+' #pin').val(), $('#'+$.model.user.form.secu+' #cles').val());
					
					// if code lengyh 6.
					if(tmps.length==6) {
					
						// Data for html.
						$.model.user.vars.pinCode = tmps;
						
						// Animation complete.
						$('#login').slideUp(500, function() {
							
							// Ajout tmpl. Form Login.
							$('#login').empty().mustache('secuDecrypte', $.model);
							
							// Animation complete.
							$('#login').slideDown(500, function() {});
						});
					}
					
					// if pin invalide.
					else {
						
						// erreur.
						$.tmpl.error('DEF-CODE-PIN-INVALID');
						
						// event. Form login.
						$('#'+$.model.user.form.secu).on($.model.user.form.secu, $.user.secuFunc);
					}
				}
				
				catch(er){
				
					// erreur.
					$.tmpl.error('DEF-CODE-PIN-INVALID');
					
					// event. Form login.
					$('#'+$.model.user.form.secu).on($.model.user.form.secu, $.user.secuFunc);
				}
			},
			
			/*
			 * html forgotHtml. Form forgot code pin. 0.5
			 */
			forgotHtml: function() {
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('forgot', $.model);
										
					// Animation stop.
					$('#login').slideDown(500, function() {});
				});
			},
			
			/*
			 * html forgotFunc. reset code pin. 0.5
			 */
			forgotFunc: function() {
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa-user');
				
				// Anim stop.
				$('#login').slideUp(500, function() {
					
					// connexion serveur.
					$.jsonRPC.request('login_forgotCodePin', {
						
						// Param send.
						params : [$.base64.encode($.model.user.vars.mail)],
						
						// succees.
						success : function(data) {
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('forgotConfirm', $.model);
							
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