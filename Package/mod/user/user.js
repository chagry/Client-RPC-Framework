/*
 * @version		0.5
 * @date Crea	11/09/2013.
 * @date Modif	07/03/2014.
 * @package		mod.user.user.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*lng.js home.js
 */

(function($, undefined) {
	
	$.extend( {
		
		user: {
			
			/*
			 * obj data. 0.4
			 */
			data: {},
			
			/*
			 * Funct setup. 0.4
			 */
			setup: function() {
				
				// event. Tmpl mod.
				$('#event').one('startTmpl', $.user.defautHtml);
			},
			
			/*
			 * Funct setup. 0.5
			 */
			session: function() {
				
				// if session exist.
				if($.user.data.log==1) {
					return $.user.data.session;
				}
				// else ruturn false.
				else return false;
			},
			
			/*
			 * Funct login. 0.4
			 */
			login: function() {
				
				// If not connexion.
				if($.user.data.log!=1) {
					
					// delete modal login after 500ms.
					$('.modal-backdrop').remove();
					$('.modal-scrollable').remove();
					$('#loginModal').remove();
					
					// delete menu user.
					$('#mUser').remove();
					$('.tooltip').remove();
					
					// Data for html template.
					$.user.data.titre = $.lng.tr('DEF-PROFIL', true);
					$.user.data.titreHtml = $.lng.tr('DEF-PROFIL');
					$.user.data.titreTr = 'DEF-PROFIL';
					$.user.data.profilClick = '$.user.profil()';
					$.user.data.modalFunc = '$.tmpl.modal(\'profilModal\')';
					
					// add menu profil.
					$('#menu').mustache('mProfil', $.user.data, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mProfil button').tooltip();
					
					// add modal profil.
					$('#event').mustache('profilModal', $.user.data);
					
					// Loger connexion.
					$.user.data.log=1;
					
					// Open spinner.
					$.tmpl.spinOn('profilSpin', 'fa fa-user');
					
					// connexion serveur.
					$.jsonRPC.request('login_historique_'+$.user.data.session, {
						
						// Param send.
						params : [$.crp.crypte('control', $.user.data.password)],
						
						// succees.
						success : function(data) {
							
							// return result.
							$.user.data.result = {};
							$.user.data.result.historique = data.result.historique;
							$.user.data.result.chart = data.result.chart;
							
							// Setup html profil.
							$.user.profil();
							
							// New Cookie mail.
							$.cookie('user', $.base64.encode($.user.data.info.email));
							
							// Close spinner.
							$.tmpl.spinOff('profilSpin', 'fa fa-user');
							
							// event. Tmpl mod.
							$('#event').trigger('login');
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
			 * Funct logout. 0.4
			 */
			logout: function() {
				
				// If connexion.
				if($.user.data.log==1) {
					
					// Loger deconnexion.
					$.user.data={};
					
					// delet modal login.
					$('#profilModal').modal('hide');
					$('#profilModal').remove();
					// delet menu user.
					$('#mProfil').remove();
					
					// Data for html template.
					$.user.data.titre = $.lng.tr('DEF-LOGIN', true);
					$.user.data.titreHtml = $.lng.tr('DEF-LOGIN');
					$.user.data.titreTr = 'DEF-LOGIN';
					$.user.data.closeHtml = $.lng.tr('DEF-CLOSE');
					$.user.data.modalFunc = '$.tmpl.modal(\'loginModal\')';
					
					// add menu Login.
					$('#menu').mustache('mUser', $.user.data, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mUser button').tooltip();
					
					// add modal Login.
					$('#event').mustache('loginModal', $.user.data);
					
					// formulaire login.
					$.user.formLoginHtml();
					
					// Setup home.
					$.home.accueil();
					
					// event. Tmpl mod.
					$('#event').trigger('logout');
				}
			},
			
			/*
			 * Funct editMail. 0.4
			 *	@param a edit mail param.
			 */
			editMail: function(a) {
				
				// Open spinner.
				$.tmpl.spinOn('profilSpin', 'fa fa-user');
				
				// Data
				$.user.data.edit = {};
				$.user.data.edit.id = 'formEdit'+Math.round(Math.random()*32000);
				$.user.data.edit.config = a;
				$.user.data.edit.titre = $.lng.tr('DEF-MODIFICATION');
				$.user.data.edit.labelInput = $.lng.tr('USER-NEW-MAIL');
				$.user.data.edit.enregistrement = $.lng.tr('DEF-SAVE');
				$.user.data.edit.inputMail = $.lng.tr('DEF-EMAIL', true);
				$.user.data.edit.descModif = $.lng.tr('USER-BEFORE-SAVE-MAIL');
				
				switch (a)
				{
					case "principal":
						$.user.data.edit.mailTitre = $.lng.tr('USER-MAIL-FIRST-LABEL');
						$.user.data.edit.mailDesc = $.lng.tr('USER-MAIL-FIRST-DESC');
						break;
					case "security":
						$.user.data.edit.mailTitre = $.lng.tr('USER-MAIL-SECU-LABEL');
						$.user.data.edit.mailDesc = $.lng.tr('USER-MAIL-SECU-DESC');
						break;
				}
				
				// Animation stop.
				$('#profil').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#profil').empty().mustache('editForm', $.user.data.edit);
					
					// Animation strop.
					$('#profil').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.user.data.edit.id).validate();
						
						// event. Form login.
						$('#'+$.user.data.edit.id).on($.user.data.edit.id, $.user.editConfirm);
						
						// Close spinner.
						$.tmpl.spinOff('profilSpin', 'fa fa-user');
						
						// modal.
						$.tmpl.modal('profilModal');
					});
				});
			},
			
			/*
			 * Funct formEditConfirm. 0.4
			 */
			editConfirm: function() {
				
				// if new mail != mail actu.
				if($.user.data.info.email!=$('#'+$.user.data.edit.id+' #email').val()) {
					
					// stop envent.
					$('#'+$.user.data.edit.id).off($.user.data.edit.id);
					
					// save local mail.
					$.user.data.edit.email=$('#'+$.user.data.edit.id+' #email').val();
					$.user.data.edit.pinId = 'formEditPin'+Math.round(Math.random()*32000);
					$.user.data.edit.trCancel = $.lng.tr('DEF-CANCEL');
					$.user.data.edit.backFunc = '$(\'#profilModal\').modal(\'hide\')';
					$.user.data.edit.yourCodePin = $.lng.tr('DEF-CODE-PIN-LABEL');
					$.user.data.edit.codePin = $.lng.tr('DEF-CODE-PIN', true);
					$.user.data.edit.btnConect = $.lng.tr('DEF-SEND');
					
					// Animation stop.
					$('#profil').slideUp(500, function() {
								
						// add tmpl. Form Login code pin.
						$('#profil').empty().mustache('pin', $.user.data.edit);
								
						// Animation stop.
						$('#profil').slideDown(500, function() {
								
							// Valid Form.
							$('#'+$.user.data.edit.pinId).validate();
							
							// event. Form login.
							$('#'+$.user.data.edit.pinId).on($.user.data.edit.pinId, $.user.editFunc);
						});
					});
				}
				
				else {
					
					// erreur.
					$.tmpl.error('USER-MAIL-NOT-CHANGE');
				}
			},
			
			/*
			 * Funct editFunc. 0.4
			 */
			editFunc: function() {
				
				// if new mail != mail actu.
				if($.user.data.password==$.sha1($('#'+$.user.data.edit.pinId+' #password').val())) {
					
					// event.
					$('#'+$.user.data.edit.pinId).off($.user.data.edit.pinId);
					
					// open spinner.
					$.tmpl.spinOn('profilSpinMod', 'fa fa-user');
					
					// Animation stop.
					$('#profil').slideUp(500, function() {
						
						// connexion serveur.
						$.jsonRPC.request('login_editMail_'+$.user.data.session, {
							
							// Param send.
							params : [$.crp.crypte($.user.data.edit.email, $.user.data.password), $.crp.crypte($.user.data.edit.config, $.user.data.password)],
							
							// succees.
							success : function(data) {
								
								// Close modal profil.
								$('#profilModal').modal('hide');
								
								switch (data.result.config)
								{
									case "principal":
										$.user.data.info.email=data.result.email;
									break;
									case "security":
										$.user.data.info.verif=data.result.email;
									break;
								}
								
								// add historique.
								$.user.data.result.historique.push({
									date:	data.result.date,
									action:	data.result.action,
									usip:	data.result.usip
								});
								
								// Setup html profil.
								$.user.profil();
								
								// var zero.
								$.user.data.edit = {};
								
								// Close spinner.
								$.tmpl.spinOff('profilSpinMod', 'fa fa-user');
							},
							
							// erreur serveur.
							error : function(data) {
								
								// erreur.
								$.tmpl.error(data.error);
								
								// close spinner.
								$.tmpl.spinOff('profilSpinMod', 'fa fa-user');
								
								// Close modal profil.
								$('#profilModal').modal('hide');
							}
						});
					});
				}
				
				else {
					
					// erreur.
					$.tmpl.error('DEF-CODE-PIN-INVALID');
				}
			},
			
			/*
			 * profil. 0.5
			 */
			profil: function() {
				
				// array for vue.
				$.user.data.historique=new Array();
				$.user.data.chart=new Array();
				
				// Boucle result historique.
				$.each($.user.data.result.historique, function(key, value) {
					
					// add historique.
					$.user.data.historique.push({
						date:	moment(value.date, 'X').format('ll'),
						heur:	moment(value.date, 'X').format('HH:mm'),
						ip:		(value.usip=='system')? '<span class="badge">'+value.usip+'</span>' : '<span class="text-success"><small>'+value.usip+'</small></span>',
						divT:	(value.usip=='system')? 'warning' : 'good',
						action:	$.lng.tr(value.action),
						temps:	moment(value.date, 'X').fromNow()
					});
				});
				
				// Boucle result chart.
				$.each($.user.data.result.chart, function(key, value) {
					
					// add result chart.
					$.user.data.chart.push({
						x:		$.lng.tr(key, true),
						y:		value
					});
				});
				
				// Data for html.
				$.user.data.logoutClick = '$.user.logout()';
				$.user.data.logoutBtn = $.lng.tr('DEF-LOGOUT');
				$.user.data.gravatarMD5 = $.md5($.trim($.user.data.info.email.toString().toLowerCase()));
				$.user.data.firstMailTitre = $.lng.tr('USER-MAIL-FIRST-LABEL');
				$.user.data.firstMailDesc = $.lng.tr('USER-MAIL-FIRST-DESC');
				$.user.data.secuMailTitre = $.lng.tr('USER-MAIL-SECU-LABEL');
				$.user.data.secuMailDesc = $.lng.tr('USER-MAIL-SECU-DESC');
				$.user.data.signDate = $.lng.tr('USER-SIGNUP-DATE');
				$.user.data.histLastAct = $.lng.tr('USER-HISTORY-LABEL');
				$.user.data.actionLabel = $.lng.tr('DEF-ACTIONS');
				$.user.data.ipLabel = $.lng.tr('DEF-IP');
				$.user.data.dateLabel = $.lng.tr('DEF-DATE');
				$.user.data.tempsLabel = $.lng.tr('DEF-TIME');
				$.user.data.gravatarLabel = $.lng.tr('USER-GRAVATAR-LABEL');
				$.user.data.firstMail = $.user.data.info.email;
				$.user.data.secuMail = $.user.data.info.verif;
				$.user.data.registerdate = moment($.user.data.info.registerdate, 'X').format('LL');
				$.user.data.mailPrincipalBtnClic = '$.user.editMail(\'principal\')';
				$.user.data.mailSecurityBtnClic = '$.user.editMail(\'security\')';
				$.user.data.clBtnMailSecu = ($.user.data.info.email==$.user.data.info.verif)? 'btn-danger' : 'btn-success';
				
				// Clean windows.
				$.tmpl.clean();
				
				// Animation stop.
				$('#conten').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#conten').empty().mustache('user', $.user.data);
					
					// clock design.
					var clock = $('.clock').FlipClock(Math.floor($.now() / 1000)-$.user.data.info.registerdate, {
						clockFace: 'DailyCounter',
						//showSeconds: false,
						language: $.lng.get()
					});
					
					// table data.
					$('#historyTab').dataTable({
						"sPaginationType": "bs_four_button",
						"iDisplayLength": 10,
						"bInfo": true,
						"bPaginate": true,
						"bFilter": true,
						"bLengthChange" : true,
						"bSort": true,
					}).fnSort([[0,'desc']]);
					
					// Boucle table data.
					$('#historyTab').each(function(){
						var datatable = $(this);
						// SEARCH - Add the placeholder for Search and Turn this into in-line form control
						var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
						search_input.attr('placeholder', $.lng.tr('DEF-SEARCH', true));
						search_input.addClass('form-control input-sm');
						// LENGTH - Inline-Form control
						var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
						length_sel.addClass('form-control input-sm');
					});
										
					// Animation stop.
					$('#conten').slideDown(500, function() {
						
						// Var for chart.
						var dataVar = {
							"xScale": "ordinal",
							"yScale": "linear",
							"main": [{
								"className": ".action",
								"data": $.user.data.chart
							}]
						};
						
						// Option chart.
						var opts = {
							"axisPaddingTop": 5,
							"paddingLeft":0,
							"mouseover": function (d, i) {
								$(this).tooltip({
									"title": d.x+' '+d.y,
									"container":"body"
								}).tooltip('show');
							},
							
							"mouseout": function (x) {
								$(this).tooltip('hide');
							}
						};
						
						// Charts historique
						var myChart = new xChart('bar', dataVar, '#userChart', opts);
					});
				});
			},
			
			/*
			 * html defaut. 0.4
			 */
			defautHtml: function() {
				
				// Data for html template.
				$.user.data.titre = $.lng.tr('DEF-LOGIN', true);
				$.user.data.titreHtml = $.lng.tr('DEF-LOGIN');
				$.user.data.titreTr = 'DEF-LOGIN';
				$.user.data.closeHtml = $.lng.tr('DEF-CLOSE');
				$.user.data.modalFunc = '$.tmpl.modal(\'loginModal\')';
				
				// Load tmpl.
				$.Mustache.load('mod/user/defaut.htm').done(function () {
					
					// add menu Login.
					$('#menu').mustache('mUser', $.user.data, {method:'prepend'});
					
					// Init popup sur les lien.
					$('#mUser button').tooltip();
					
					// add modal Login.
					$('#event').mustache('loginModal', $.user.data);
					
					// Setup form login.
					$.user.formLoginHtml();
				});
			},
			
			/*
			 * html formLogin. Formulaire login. 0.4
			 */
			formLoginHtml: function() {
				
				// Data for html.
				$.user.data.formLogin = {};
				$.user.data.formLogin.email = null;
				$.user.data.formLogin.id = 'formLogin'+Math.round(Math.random()*32000);
				$.user.data.formLogin.btnSignup = '$.user.signupHtml()';
				$.user.data.formLogin.btnSecuPin = '$.user.secuPinHtml()';
				$.user.data.formLogin.backFunc = '$.user.formLoginHtml()';
				$.user.data.formLogin.titreLogin = $.lng.tr('USER-YOUR-MAIL');
				$.user.data.formLogin.inputMail = $.lng.tr('DEF-EMAIL', true);
				$.user.data.formLogin.btnConect = $.lng.tr('DEF-LOGIN');
				$.user.data.formLogin.trCancel = $.lng.tr('DEF-CANCEL');
				$.user.data.formLogin.newCompte = $.lng.tr('USER-NEW-SIGNUP-LABEL');
				$.user.data.formLogin.secuSenter = $.lng.tr('USER-SECURIT-CENTER');
				$.user.data.formLogin.yourCodePin = $.lng.tr('DEF-CODE-PIN-LABEL');
				$.user.data.formLogin.codePin = $.lng.tr('DEF-CODE-PIN', true);
				
				// Mail cookie.
				var userCookie = $.cookie('user');
				// if cookie.
				if(userCookie!=undefined) {
					
					// Decrypt id session.
					var userMail = $.base64.decode(userCookie);
					// preg_match mail.
					var reg =/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,5}$/;
					// if code md5.
					if(reg.test(userMail)) {
						// Data for html.
						$.user.data.formLogin.cookmail = userMail;
					}
				}
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('login', $.user.data.formLogin);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.user.data.formLogin.id).validate();
						
						// event. Form login.
						$('#'+$.user.data.formLogin.id).on($.user.data.formLogin.id, $.user.formLoginPinHtml);
					});
				});
			},
			
			/*
			 * html formLoginPin. Formulaire login code pin. 0.4
			 */
			formLoginPinHtml: function() {
				
				// event.
				$('#'+$.user.data.formLogin.id).off($.user.data.formLogin.id);
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa fa-user');
				
				// add local mail.
				$.user.data.formLogin.SessionCrp = null;
				$.user.data.formLogin.email=$('#'+$.user.data.formLogin.id+' #email').val();
				$.user.data.formLogin.btnForgot = '$.user.forgotHtml()';
				$.user.data.formLogin.pinId = 'formLoginPin'+Math.round(Math.random()*32000);
				$.user.data.formLogin.forgot = $.lng.tr('USER-RESET-DESC');
				$.user.data.formLogin.newCodePin = $.lng.tr('DEF-CODE-PIN-NEW');
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// connexion serveur.
					$.jsonRPC.request('login_identification', {
						
						// Param send.
						params : [$.base64.encode($.user.data.formLogin.email)],
						
						// succees.
						success : function(data) {
							
							// add local id session crypter.
							$.user.data.formLogin.SessionCrp = data.result.session;
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('pin', $.user.data.formLogin).mustache('pinParam', $.user.data.formLogin);
							
							// Animation stop.
							$('#login').slideDown(500, function() {
								
								// Valid Form.
								$('#'+$.user.data.formLogin.pinId).validate();
								
								// event. Form login.
								$('#'+$.user.data.formLogin.pinId).on($.user.data.formLogin.pinId, $.user.loginFunc);
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa fa-user');
							});
						},
						
						// erreur serveur.
						error : function(data) {
							
							// erreur.
							$.tmpl.error(data.error);
							
							// formulaire login.
							$.user.formLoginHtml();
							
							// close spinner.
							$.tmpl.spinOff('loginSpin', 'fa fa-user');
						}
					});
				});
			},
			
			/*
			 * html loginFunc. fonction de connexion. 0.4
			 */
			loginFunc: function() {
				
				// event.
				$('#'+$.user.data.formLogin.pinId).off($.user.data.formLogin.pinId);
				$.user.data.formLogin.password=null;
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa fa-user');
				
				// add local mail.
				$.user.data.formLogin.password=$.sha1($('#'+$.user.data.formLogin.pinId+' #password').val());
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// Decrypt id session.
					var tmpPin = $.crp.decrypte($.user.data.formLogin.SessionCrp, $.user.data.formLogin.password);
					
					// preg_match.
					var reg =/^[a-f0-9]{32}$/;
					
					// if code md5.
					if(reg.test(tmpPin)) {
					
						// connexion serveur.
						$.jsonRPC.request('login_connexion', {
								 
							// Param send.
							params : [tmpPin, 
								$.crp.crypte($.user.data.formLogin.email, $.user.data.formLogin.password),
								$.crp.crypte($.lng.get(), $.user.data.formLogin.password)
							],
							
							// succees.
							success : function(data) {
								
								// add id session.
								$.user.data.password =  $.user.data.formLogin.password;
								$.user.data.session =	 $.crp.decrypte(data.result.session, $.user.data.password);
								// Decode info user.
								$.user.data.info = JSON.parse($.crp.decrypte(data.result.user, $.user.data.password));
								
								// empty var formLogin.
								$.user.data.formLogin = {};
								
								// empty div login.
								$('#login').empty();
									
								// Close spinner.
								$.tmpl.spinOff('loginSpin', 'fa fa-user');
								
								// Event login.
								$.user.login();
							},
							
							// erreur serveur.
							error : function(data) {
								
								// erreur.
								$.tmpl.error(data.error);
								
								// formulaire login.
								$.user.formLoginHtml();
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa fa-user');
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
						$.tmpl.spinOff('loginSpin', 'fa fa-user');
					}
				});
			},
			
			/*
			 * html signupHtml. Formulaire signup. 0.4
			 */
			signupHtml: function() {
				
				// Data for html.
				$.user.data.formLogin.signupId = 'formSignup'+Math.round(Math.random()*32000);
				$.user.data.formLogin.mailAdEnter = $.lng.tr('USER-ENTER-YOUR-MAIL');
				$.user.data.formLogin.enregistrement = $.lng.tr('DEF-SAVE');
				$.user.data.formLogin.accept = $.lng.tr('USER-ACCEPT-CONDITION');
				$.user.data.formLogin.wathYourMail = $.lng.tr('USER-WATH-MAIL-DESC');
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('signup', $.user.data.formLogin);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.user.data.formLogin.signupId).validate();
						
						// event. Form login.
						$('#'+$.user.data.formLogin.signupId).on($.user.data.formLogin.signupId, $.user.signupFunc);
					});
				});
			},
			
			/*
			 * html signupFunc. 0.4
			 */
			signupFunc: function() {
				
				// event.
				$('#'+$.user.data.formLogin.signupId).off($.user.data.formLogin.signupId);
				
				// open spinner.
				$.tmpl.spinOn('loginSpin', 'fa fa-user');
				
				// Data for html template.
				$.user.data.formLogin.signupEmail=$('#'+$.user.data.formLogin.signupId+' #email').val();
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// connextion serveur.
					$.jsonRPC.request('login_inscription', {
						
						// Param send.
						params : [$.base64.encode($.user.data.formLogin.signupEmail), $.base64.encode($.lng.get())],
						
						// succees.
						success : function(data) {
							
							// Data for html.
							$.user.data.formLogin.felicitations = $.lng.tr('DEF-BRAVO-LABEL');
							$.user.data.formLogin.ConfirmSign = $.lng.tr('USER-CONFIRM-SIGNUP');
							$.user.data.formLogin.firstMail = $.lng.tr('USER-MAIL1-SEND-DESC');
							$.user.data.formLogin.secondMail = $.lng.tr('USER-MAIL2-SEND-DESC');
							
							// add tmpl. Form Login code pin.
							$('#login').empty().mustache('signupConfirm', $.user.data.formLogin);
							
							// Animation stop.
							$('#login').slideDown(500, function() {
															
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa fa-user');
							});
						},
						
						// erreur serveur.
						error : function(data) {
							
							// erreur.
							$.tmpl.error(data.error);
							
							// form login.
							$('#login').slideDown(500, function() {
								
								// event. Form login.
								$('#'+$.user.data.formLogin.signupId).on($.user.data.formLogin.signupId, $.user.signupFunc);
								
								// close spinner.
								$.tmpl.spinOff('loginSpin', 'fa fa-user');
							});
						}
					});
				});
			},
			
			/*
			 * html secuPinHtml. Formulaire pour decrypt code pin. 0.4
			 */
			secuPinHtml: function() {
				
				// Data for html template.
				$.user.data.formLogin.secuId = 'formSecu'+Math.round(Math.random()*32000);
				$.user.data.formLogin.decryptage = $.lng.tr('DEF-DECRYPT');
				$.user.data.formLogin.codePinCrypt = $.lng.tr('DEF-CODE-PIN-CRYPT', true);
				$.user.data.formLogin.labelCodePin = $.lng.tr('DEF-CODE-PIN-CRYPT-LABEL');
				$.user.data.formLogin.labelKey = $.lng.tr('USER-KEY-SEND-LABEL');
				$.user.data.formLogin.keyCryptInput = $.lng.tr('USER-KEY-SEND', true);
				$.user.data.formLogin.DescCenterSecu = $.lng.tr('USER-WELCOM-SECURITI-CENTER');
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('secu', $.user.data.formLogin);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
						// Valid Form.
						$('#'+$.user.data.formLogin.secuId).validate();
						
						// event. Form login.
						$('#'+$.user.data.formLogin.secuId).on($.user.data.formLogin.secuId, $.user.secuFunc);
					});
				});
			},
			
			/*
			 * html secuFunc. Decrypt code pin. 0.4
			 */
			secuFunc: function() {
				
				// event.
				$('#'+$.user.data.formLogin.secuId).off($.user.data.formLogin.secuId);
				
				try {
					var mess=$('#'+$.user.data.formLogin.secuId+' #pin').val();
					var cles=$('#'+$.user.data.formLogin.secuId+' #cles').val();
					var tmps=$.crp.decrypte(mess, cles);
					
					// if code lengyh 6.
					if(tmps.length==6) {
					
						// Data for html.
						$.user.data.formLogin.pinDecryptTmp = tmps;
						$.user.data.formLogin.deleteMailTr = $.lng.tr('USER-DELETE-MAIL');
						
						// Animation complete.
						$('#login').slideUp(500, function() {
							
							// Ajout tmpl. Form Login.
							$('#login').empty().mustache('secuDecrypte', $.user.data.formLogin);
							
							// Animation complete.
							$('#login').slideDown(500, function() {
							
							});
						});
					}
					
					// if pin invalide.
					else {
						
						// erreur.
						$.tmpl.error('DEF-CODE-PIN-INVALID');
						
						// event. Form login.
						$('#'+$.user.data.formLogin.secuId).on($.user.data.formLogin.secuId, $.user.secuFunc);
					}
				}
				
				catch(er){
				
					// erreur.
					$.tmpl.error('DEF-CODE-PIN-INVALID');
					
					// event. Form login.
					$('#'+$.user.data.formLogin.secuId).on($.user.data.formLogin.secuId, $.user.secuFunc);
				}
			},
			
			/*
			 * html forgotHtml. Form forgot code pin. 0.4
			 */
			forgotHtml: function() {
				
				// Data for html.
				$.user.data.formLogin.forgotCodePinQ = $.lng.tr('USER-RESET-LABEL');
				$.user.data.formLogin.canGenerNew = $.lng.tr('USER-RESET-CUSTOM');
				$.user.data.formLogin.avertissement = $.lng.tr('DEF-WARNING');
				$.user.data.formLogin.pinActuFinich = $.lng.tr('USER-RESET-WARNING');
				$.user.data.formLogin.sendTowMail = $.lng.tr('USER-RESET-SEND-2EMAIL');
				$.user.data.formLogin.forgoFunc = '$.user.forgotFunc()';
				$.user.data.formLogin.forgoSetup = 0;
				
				// Animation stop.
				$('#login').slideUp(500, function() {
					
					// add tmpl. Form Login.
					$('#login').empty().mustache('forgot', $.user.data.formLogin);
										
					// Animation stop.
					$('#login').slideDown(500, function() {
						
					});
				});
			},
			
			/*
			 * html forgotFunc. reset code pin. 0.4
			 */
			forgotFunc: function() {
				
				// If not strart.
				if($.user.data.formLogin.forgoSetup == 0) {
					
					// Starting forgot
					$.user.data.formLogin.forgoSetup = 1;
					
					// open spinner.
					$.tmpl.spinOn('loginSpin', 'fa fa-user');
					
					// Animation stop.
					$('#login').slideUp(500, function() {
						
						// connexion serveur.
						$.jsonRPC.request('login_forgotCodePin', {
							
							// Param send.
							params : [$.base64.encode($.user.data.formLogin.email)],
							
							// succees.
							success : function(data) {
							
								// Data for html.
								$.user.data.formLogin.felicitations = $.lng.tr('DEF-CODE-PIN-VALIDATION');
								$.user.data.formLogin.ConfirmSign = $.lng.tr('USER-RESET-SEND-VALIDATION');
								$.user.data.formLogin.firstMail = $.lng.tr('USER-MAIL1-SEND-DESC');
								$.user.data.formLogin.secondMail = $.lng.tr('USER-MAIL2-SEND-DESC');
							
								// add tmpl. Form Login code pin.
								$('#login').empty().mustache('signupConfirm', $.user.data.formLogin);
							
								// Animation stop.
								$('#login').slideDown(500, function() {
															
									// close spinner.
									$.tmpl.spinOff('loginSpin', 'fa fa-user');
									
									// Stop forgot
									$.user.data.formLogin.forgoSetup = 0;
								});
							},
							
							// erreur serveur.
							error : function(data) {
								
								// erreur.
								$.tmpl.error(data.error);
								
								// form login.
								$('#login').slideDown(500, function() {
									
									// Stop forgot
									$.user.data.formLogin.forgoSetup = 0;
								
									// close spinner.
									$.tmpl.spinOff('loginSpin', 'fa fa-user');
								});
							}
						});
					});
				}
				
				// If no 2 clic.
				else {
					
					// erreur.
					$.tmpl.error('DEF-2-CLIC-INVALID');
				}
			},
		}
	});
	
})(jQuery);