/*
 * @version		0.5
 * @date Crea	27/03/2014.
 * @date Modif	19/04/2014.
 * @package		mod.voix.voix.js
 * @contact		Chagry.com - git@chagry.com
 * @Dependence	*lng.js
 */

(function($, undefined) {

	$.extend( {
	
		voix: {
			
			/*
			 * Funct setup. 0.5
			 */
			setup: function() {
				
				// Load model.
				$.m.load('voix', function() {
					
					// event. login. listen
					$('#'+$.m.div.event).on($.m.event.login, function() {
						
						// if sound is on.
						if($.m.voix.is.sound) {
							
							// Play sound.
							$.voix.play($.m.voix.sound.setup);
							
							// Add hover event btn sound.
							setTimeout(function() { $.voix.btnSound(); }, 2000);
						}
						
						// if speak is on. // Synthèse speak.
						if($.m.voix.is.speak) $.voix.speak($.lng.tr('VOIX-LOGIN-LABEL'));
					});
					
					// event. logout. listen
					$('#'+$.m.div.event).on($.m.event.logout, function() {
						
						// if sound is on.
						if($.m.voix.is.sound) {
							
							// Add hover event btn sound.
							setTimeout(function() { $.voix.btnSound(); }, 2000);
						}
						
						// if speak is on. // Synthèse speak.
						if($.m.voix.is.speak) $.voix.speak($.lng.tr('VOIX-LOGOUT-LABEL'));
					});
				});
				
				// event. setup. listen one
				$('#'+$.m.div.event).one($.m.event.setup, $.voix.defautHtml);
				
				// event. langue. listen
				$('#'+$.m.div.event).on($.m.event.langue, $.voix.langueEdit);
			},
			
			/*
			 * Funct defautHtml. Menu brique in dock. 0.5
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('voix', function() {
					
					// boucle cookie is.
					$.each($.m.voix.is, function(key, val) {
						
						// look Cookie.
						var cook = $.cookie(key);
						
						// if cookie.
						if(cook!=undefined && cook==1) {
							
							// edit model.
							$.m.voix.is[key] = true;
						}
					});
					
					// If SpeechRecognition.true for html btn.
					if (annyang) $.m.voix.listen.speech = true;
					
					// Init plugin.
					$.voix.init(false);
					
					// Synthèse speak.
					setTimeout(function() { $.voix.speak($.lng.tr('VOIX-WELCOM-LABEL')); }, 3000);
					
					// Play sound.
					$.voix.play($.m.voix.sound.setup);
					
					// add tmpl.
					$('#'+$.m.div.menu).mustache('mVoix', $.m, {method:'prepend'});
					
					// Tooltip.
					$('#mVoix button').tooltip();
				});
			},
			
			/*
			 * Funct init. 0.5
			 * @param e -> string speak/sound/listen or false
			 */
			init: function(e) {
				
				// if sound is on.
				if($.m.voix.is.sound && !e || e == $.m.voix.sound.name) {
					
					// if not load sound.
					if(!$.m.voix.load.sound) {
						
						// Load sound for api.
						$.ionSound({
							sounds: $.m.voix.sound.list,
							path: $.m.voix.sound.url,
							multiPlay: true
						});
						
						// sound load on.
						$.m.voix.load.sound = true;
						
						// Add hover event btn sound.
						setTimeout(function() { $.voix.btnSound(); }, 3000);
					}
				}
				
				// if speak is on.
				if($.m.voix.is.speak && !e || e == $.m.voix.speak.name) {
					
					// if not load config.
					if(!meSpeak.isConfigLoaded()) meSpeak.loadConfig($.m.voix.speak.config);
					
					// if not load voice.
					if(!meSpeak.isVoiceLoaded($.lng.get())) meSpeak.loadVoice($.m.voix.speak.urlVoice+$.lng.get()+'.json');
				}
				
				// if listen is on.
				if($.m.voix.is.listen && !e || e == $.m.voix.listen.name) {
					
					// if not load listen.
					if(!$.m.voix.load.listen) {
						
						// If SpeechRecognition.
						if (annyang) {
							
							// Set a language for speech recognition (defaults to English)
							annyang.setLanguage($.lng.get());
							
							// Setup command.
							$.voix.addCommandsToList();
							
							// listen load on.
							$.m.voix.load.listen = true;
						}
					}
					
					// Start listening.
					annyang.start();
				}
			},
			
			/*
			 * Funct speak. 0.5
			 * @param str -> string for vocal syntese
			 */
			speak: function(str) {
				
				// if speak is on.
				if($.m.voix.is.speak) {
					
					// Voice random.
					var num =Math.floor(Math.random() * $.m.voix.speak.list.length);
					
					// Setup speak.
					meSpeak.speak(str, $.m.voix.speak.list[num]);
				}
			},
			
			/*
			 * Funct play. 0.5
			 * @param str -> sound name
			 */
			play: function(str) {
				
				// if sound is on.
				if($.m.voix.is.sound) {
					
					// Play sound.
					$.ionSound.play(str);
				}
			},
			
			/*
			 * Funct toggle. 0.5
			 * @param e -> string speak/sound/listen 
			 */
			toggle: function(e) {
				
				// Init request.
				switch(e) {
					
					// speak edit toggle
					case $.m.voix.speak.name:
						
						// if toggle is on.
						if($.m.voix.is.speak) {
							
							// Reset speak play.
							meSpeak.resetQueue();
							
							// off toogle.
							$.m.voix.is.speak=false;
							
							// New cookie.
							$.cookie($.m.voix.speak.name, 0);
							
							// Change btn color.
							$('#mSpeak').removeClass('btn-success').addClass('btn-danger');
						}
						
						// If off
						else {
							
							// on toogle.
							$.m.voix.is.speak=true;
							
							// Init plugin.
							$.voix.init($.m.voix.speak.name);
							
							// New cookie.
							$.cookie($.m.voix.speak.name, 1);
							
							// Synthèse speak.
							$.voix.speak($.lng.tr('VOIX-ON-LABEL'));
							
							// Change btn color.
							$('#mSpeak').removeClass('btn-danger').addClass('btn-success');
						}
					break;
					
					// sound edit toggle
					case $.m.voix.sound.name:
						
						// if toggle is on.
						if($.m.voix.is.sound) {
							
							// off toogle.
							$.m.voix.is.sound=false;
							
							// New cookie.
							$.cookie($.m.voix.sound.name, 0);
							
							// Change btn color.
							$('#mSound').removeClass('btn-success').addClass('btn-danger');
							
							// Change btn icon.
							$('#mSound i').removeClass('fa-volume-up').addClass('fa-volume-off');
						}
						
						// If off
						else {
							
							// on toogle.
							$.m.voix.is.sound=true;
							
							// Init plugin.
							$.voix.init($.m.voix.sound.name);
							
							// New cookie.
							$.cookie($.m.voix.sound.name, 1);
							
							// Play sound.
							$.voix.play($.m.voix.sound.setup);
							
							// Change btn color.
							$('#mSound').removeClass('btn-danger').addClass('btn-success');
							
							// Change btn icon.
							$('#mSound i').removeClass('fa-volume-off').addClass('fa-volume-up');
						}
					break;
					
					// listen edit toggle
					case $.m.voix.listen.name:
						
						// if toggle is on.
						if($.m.voix.is.listen) {
							
							// abort the listening session.
							annyang.abort();
							
							// off toogle.
							$.m.voix.is.listen=false;
							
							// New cookie.
							$.cookie($.m.voix.listen.name, 0);
							
							// Change btn color.
							$('#mListen').removeClass('btn-success').addClass('btn-danger');
							
							// Change btn icon.
							$('#mListen i').removeClass('fa-microphone').addClass('fa-microphone-slash');
						}
						
						// If off
						else {
							
							// on toogle.
							$.m.voix.is.listen=true;
							
							// Init plugin.
							$.voix.init($.m.voix.listen.name);
							
							// New cookie.
							$.cookie($.m.voix.listen.name, 1);
							
							// Change btn color.
							$('#mListen').removeClass('btn-danger').addClass('btn-success');
							
							// Change btn icon.
							$('#mListen i').removeClass('fa-microphone-slash').addClass('fa-microphone');
						}
					break;
				}
			},
			
			/*
			 * Funct langueEdit. 0.5
			 */
			langueEdit: function() {
				
				// if speak is on.
				if($.m.voix.is.speak) {
					
					// Reset speak play.
					meSpeak.resetQueue();
					
					// Edit langue in plugin.
					meSpeak.loadVoice($.m.voix.speak.urlVoice+$.lng.get()+'.json');
					
					// Init plugin.
					$.voix.init($.m.voix.speak.name);
					
					// Synthèse speak.
					setTimeout(function() { $.voix.speak($.lng.tr('VOIX-EDIT-LANGUE-LABEL')); }, 1000);
				}
				
				// if is listen.
				if($.m.voix.is.listen) {
				
					// If SpeechRecognition.
					if (annyang) {
					
						// abort the listening session.
						annyang.abort();
					
						// Set a language for speech recognition (defaults to English)
						annyang.setLanguage($.lng.get());
					
						// Setup command.
						$.voix.addCommandsToList();
						
						// off toogle.
						$.m.voix.is.listen=false;
						
						// New cookie.
						$.cookie($.m.voix.listen.name, 0);
						
						// Change btn color.
						$('#mListen').removeClass('btn-success').addClass('btn-danger');
						
						// Change btn icon.
						$('#mListen i').removeClass('fa-microphone').addClass('fa-microphone-slash');
					}
				}
			},
			
			/*
			 * Funct btnSound. 0.5
			 */
			btnSound: function() {
					
				// Boucle btn body.
				$('#'+$.m.div.menu+' .btn').each(function() {
					
					// hover btn
					$(this).mouseenter(function() {
						
						// Play sound.
						$.voix.play($.m.voix.sound.btnOver);
					});
				});
			},
			
			/*
			 * Funct addCommandsToList. 0.5
			 */
			addCommandsToList: function() {
				
				// Let's define a command.
				var commands = {};
				
				// boucle comande voice.
				$.each($.m.voix.listen.list, function(key, val) {
					
					// Increment var.
					commands[$.lng.tr(val.com)] = function() { 
						
						// Draft func. if param.
						if(val.param) $[val.plug][val.func](val.param);
						
						// If not param.
						else $[val.plug][val.func]();
					}
				});
				
				// Add our commands to annyang
				annyang.addCommands(commands);
			},
			
			/*
			 * Funct logCmd. 0.5
			 * @param e -> string for commande login/logout
			 */
			logCmd: function(str) {
				
				// Init request.
				switch(str) {
				
					case $.m.event.login:
						// If not connect.
						if(!$.user.session()) {
							
							// modal login.
							$.tmpl.modal('loginModal');
						}
						
						// If connect. print error.
						else $.tmpl.error('SERV-ERROR-INVALID-ACTION');
					break;
					
					case $.m.event.logout:
						// If not connect.
						if($.user.session()) {
							
							// logout.
							$.user.logout();
						}
						
						// If connect. print error.
						else $.tmpl.error('SERV-ERROR-INVALID-ACTION');
					break;
				}
			},
		}
	});
	
})(jQuery);