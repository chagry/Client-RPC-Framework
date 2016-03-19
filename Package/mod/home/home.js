/*
 * @version 0.7.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	home.home.js
 */

(function($, undefined) {
	
	$.extend( {
		
		home: {
			
			/*
			 * Funct setup. Init mod home.
			 */
			setup: function() {
				
				// free coin var.
				$.m.home.free = {};
				// Obs var.
				$.m.home.obs = {};
				
				// Setup html home.
				$.home.homePage();
			},
			
			/*
			 * Funct homePage.
			 */
			homePage: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// if not menu right, add in dom.
				if(!$('#sidebarHome').length) $('#'+$.m.div.mRight).empty().mustache('sidebarHome', $.m);
				
				// Boucle btn body.
				$('#'+$.m.div.mRight+' .sub-menu').each(function() {
					
					// hover btn
					$(this).mouseenter(function() {
						
						// Play sound.
						$.voix.play($.m.voix.sound.btnOver);
					});
				});
					
				// add tmpl homePage.
				$('#'+$.m.div.page).empty().mustache('homePage', $.m);
			},
			
			/*
			 * Funct paperWalletPage. print paper wallet.
			 */
			paperWalletPage: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// add tmpl. DOC.
				$('#'+$.m.div.page).empty().mustache('paperWalletPage', $.m);
				
				// Valid Form.
				$('#formPaperWallet').validate();
				
				// event. Form send. listen.
				$('#formPaperWallet').on('formPaperWallet', $.home.paperWalletFunc);
				
				// Controle pass phrase for complexity.
				$('#formPaperWallet #passPhrase').keyup($.home.passPhraseControl);
			},
			
			/*
			 * Funct paperWalletFunc. print paper wallet.
			 */
			paperWalletFunc: function() {
				
				// disabled btn sync.
				$('.btnInitPaperWallet').attr("disabled", "disabled");
				
				// Spin icon.
				$.tmpl.spinOn("btnInitPaperWalletIcone","fa-magic");
				
				// Function pour afficher un text par lettre.
				function wrapText(context, text, x, y, maxWidth, lineHeight) {
					var words = text.split('');
					var line = '';
					// Boucle sur le tableau du text.
					for(var n = 0; n < words.length; n++) {
						var testLine = line + words[n];
						var metrics = context.measureText(testLine);
						var testWidth = metrics.width;
						if (testWidth > maxWidth && n > 0) {
							context.fillText(line, x, y);
							line = words[n];
							y += lineHeight;
						}
						else {
							line = testLine;
						}
					}
					// Dessiner le text dans le canvas.
					context.fillText(line, x, y);
				}
				
				// Cree hash of pass phrase.
				var hash = Crypto.SHA256($('#formPaperWallet #passPhrase').val(), { asBytes: true });
				
				// Private Key+Address
				var sec = new Bitcoin.ECKey(hash);
				
				// Add address bitcoin.
				var addr = ''+sec.getBitcoinAddress();
				
				// Add privat key.
				var key = ''+sec.getExportedPrivateKey();
				
				// Creat canvas.
				var canvas = document.createElement("canvas");
				canvas.width = 2480;
				canvas.height = 3508;
				var context = canvas.getContext('2d');
				
				// Var qrAddrObj contien le src du qrcode addr btc.
				var qrAddrObj = new Image();
				// add img src code.
				qrAddrObj.src = $.home.qrCodeInit('bitcoin:'+addr);
				
				// Var qrAddrObj contien le src du qrcode key.
				var qrKeyObj = new Image();
				// add img src code.
				qrKeyObj.src = $.home.qrCodeInit(key);
				
				// Var qrAddrObj contien le src du qrcode key.
				var qrPassObj = new Image();
				// add img src code.
				qrPassObj.src = $.home.qrCodeInit($('#formPaperWallet #passPhrase').val());
				
				// Init paper wallet img.
				var imgFond = new Image();
				
				// A la fin de l'importation de l'image de fond pour le paper wallet.
				imgFond.onload = function() {
					
					// Dessiner le fond.
					context.drawImage(imgFond, 0, 0);
	
					// Dessiner dans les canvas le qrCode.
					context.drawImage(qrAddrObj, 545, 795);
					context.drawImage(qrPassObj, 630, 3050);
					context.drawImage(qrKeyObj, 2035, 3050);
					
					// Dessiner le text info.
					context.font = '19pt Arial';
					context.fillStyle = '#333333';
					
					// Dessiner le text addr.
					context.fillText(addr, 20, 1160);
					
					// Dessiner la clé privée.
					wrapText(context, key, 1550, 3125, 320, 30);
					
					// Dessiner la phrase secrete.
					wrapText(context, $('#formPaperWallet #passPhrase').val(), 1110, 3125, 320, 30);
					
					// rotate around that point, converting our 
					// angle from degrees to radians
					context.translate(2480, 3508);
					context.rotate(180 * (Math.PI/180));
					
					// Dessiner dans les canvas le qrCode.
					context.drawImage(qrAddrObj, 545, 795);
					context.drawImage(qrPassObj, 630, 3050);
					context.drawImage(qrKeyObj, 2035, 3050);
					
					// Dessiner le text addr.
					context.fillText(addr, 20, 1160);
					
					// Dessiner la clé privée.
					wrapText(context, key, 1550, 3125, 320, 30);
					
					// Dessiner la phrase secrete.
					wrapText(context, $('#formPaperWallet #passPhrase').val(), 1110, 3125, 320, 30);
					
					// and restore the co-ords to how they were when we began
					context.restore(); 
					
					// save canvas image as data url (png format by default)
					var dataURL = canvas.toDataURL('image/jpeg', 0.9);
					
					// Generait l'image.
					var img='<a href="'+dataURL+'" download="PaperWallet.jpg" target="_blank"><img class="img-responsive img-thumbnail" src="'+dataURL+'" alt="Bitcoin Paper Wallet"></a>';
					
					// Ajouter l'image au dom.
					$('#imgWallet').empty().html(img);
					
					// remove atr disabled on btn sync
					$('.btnInitPaperWallet').removeAttr("disabled");
					
					// Spin icon.
					$.tmpl.spinOff("btnInitPaperWalletIcone","fa-magic");
				}
				
				// Look color paper wallet. L'image source pour le paper wallet blue.
				if($('#formPaperWallet #colorPaperWallet:checked').val() == 'blue') imgFond.src = "img/btc/paperWallet.jpg";
				else if($('#formPaperWallet #colorPaperWallet:checked').val() == 'orange') imgFond.src = "img/btc/paperWalletOrange.jpg";
				else if($('#formPaperWallet #colorPaperWallet:checked').val() == 'green') imgFond.src = "img/btc/paperWalletGreen.jpg";
				else if($('#formPaperWallet #colorPaperWallet:checked').val() == 'rose') imgFond.src = "img/btc/paperWalletRose.jpg";
				else imgFond.src = "img/btc/paperWallet.jpg";
			},
			
			/*
			 * Funct qrCodeInit. return img src code.
			 * @param e text for qr code.
			 */
			qrCodeInit: function(e) {
				
				// Content html
				var qrAddr = $('<div id="qrDiv"></div>');
				
				// qr code generate.
				qrAddr.qrcode({
					text		: e,
					render		: 'image',
					minVersion	: 2,
					maxVersion	: 20,
					ecLevel		: 'H',
					top			: 0,
					size		: 300,
					fill		: '#333333',
					background	: null,
					radius		: 0.5,
					mode		: 0
				});
				
				// Return reponse.
				return qrAddr[0].children[0].src;
			},
			
			/**
			 * Funct passPhraseControl.
			 */
			passPhraseControl: function() {
				
				// var expression reg control.
				var anUpperCase = /[A-ZÉÈÄËÏÖÜŸÃÑÊÕÀÁÂÎÃÔÒÓÇÝÛÚÙÆ]/;
				var aLowerCase = /[a-zéèçàôùúûîêäëïöüÿãñõœ]/;
				var aNumber = /[0-9]/;
				var aSpecial = /[ !@#$%^&*()\-\/_\'"§;.,:+\=]/;
				var Resultat = 0;
				
				// If empty, not message. Vide html div.
				if(!$('#formPaperWallet #passPhrase').val()) $('#messDangerPhrase').empty();
				
				// Else not vide.
				else {
				
					// Phrase.
					var p = $('#formPaperWallet #passPhrase').val();
					
					// var number of constante.
					var numUpper = 0;
					var numLower = 0;
					var numNums = 0;
					var numSpecials = 0;
					var numLongeur = p.length;
					var PassScore = 0
					
					// Each in prase
					for(var i=0; i<p.length; i++) {
						
						// Incremonte var of canstante.
						if(anUpperCase.test(p[i])) numUpper++;
						else if(aLowerCase.test(p[i])) numLower++;
						else if(aNumber.test(p[i])) numNums++;
						else if(aSpecial.test(p[i])) numSpecials++;
					}
					
					// If small phrase. bad result.
					if(numLongeur < 10) PassScore -= 3;
					// Esle edit pass var.
					else PassScore += Math.floor(numLongeur / 10);
					
					// If not specials caracter.
					if(numSpecials <1) PassScore -= 1;
					// else specials caracter.
					else PassScore += Math.floor(numSpecials /2);
					
					// caracter.
					if(numUpper * 10 < numLongeur) PassScore -= Math.floor(numLongeur / 20);
					else PassScore += Math.floor(numUpper /3);
					
					// Number.
					if(numNums * 10 < numLongeur) PassScore -= Math.floor(numLongeur / 20);
					else PassScore += Math.floor(numNums /3);
					
					// Maj
					if(numLower * 5 < numLongeur) PassScore -= Math.floor(numLongeur / 20);
					else PassScore += Math.floor(numLower /4);
					
					// Analize score. bad html div.
					if(PassScore <= 20) {
						
						// Add var to model.
						$.m.user.messPass = {"alert" : "danger", "icone" : "ban", "message" : "PHRASE_DANGER"};
						// Edit html dom.
						$('#messDangerPhrase').empty().mustache('messDangerPhraseHTML', $.m);
					}
					
					// warning html div.
					else if(PassScore <=40) {
						
						// Add var to model.
						$.m.user.messPass = {"alert" : "warning", "icone" : "exclamation-triangle", "message" : "PHRASE_WARNING"};
						// Edit html dom.
						$('#messDangerPhrase').empty().mustache('messDangerPhraseHTML', $.m);
					}
					
					// good html div.	
					else {
						
						// Add var to model.
						$.m.user.messPass = {"alert" : "success", "icone" : "check", "message" : "PHRASE_SUCCES"};
						// Edit html dom.
						$('#messDangerPhrase').empty().mustache('messDangerPhraseHTML', $.m);
					}
				}
			},
		}
	});
	
})(jQuery);