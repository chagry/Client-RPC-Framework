/**
 * @version 0.7.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package user.user.js
 */

(function($, undefined) {
	
	$.extend( {
		
		user: {
			
			/**
			 * Funct setup. Init mod user.
			 */
			setup: function() {
				
				// Wallet var.
				$.m.user.wallet = {};
				
				// Image for qr code
				$.m.user.img = {};
				$.m.user.img.qr = new Image();
				$.m.user.img.qr.src = "img/css/qr.png";
				$.m.user.img.qrp = new Image();
				$.m.user.img.qrp.src = "img/css/qrp.png";
			},
			
			/**
			 * Funct homePage.
			 */
			homePage: function() {
					
				// Clean windows.
				$.tmpl.clean();
				
				// Verif si menu user prensant dans le dom.
				if(!$('#sidebarHome').length) $('#'+$.m.div.mRight).empty().mustache('sidebarHome', $.m);
				
				// Boucle btn body.
				$('#'+$.m.div.mRight+' .sub-menu').each(function() {
					
					// hover btn
					$(this).mouseenter(function() {
						
						// Play sound.
						$.voix.play($.m.voix.sound.btnOver);
					});
				});
				
				// If btc adress exist
				if($.m.user.wallet.adr) {
					
					// add tmpl. DOC.
					$('#'+$.m.div.page).empty().mustache('wallet', $.m);
					
					// qr code generate.
					$('#qrCodeAdr').qrcode({
						text		: 'bitcoin:'+$.m.user.wallet.adr,
						render		: 'canvas',
						minVersion	: 2,
						maxVersion	: 20,
						ecLevel		: 'H',
						top			: 0,
						size		: 250,
						fill		: '#333333',
						background	: null,
						radius		: 0.5,
						mode		: 4,
						mSize		: 0.2,
						mPosX		: 0.5,
						mPosY		: 0.5,
						image		: $.m.user.img.qr,
					});
				}
				
				// Else not btc adress
				else {
					
					// add tmpl. DOC.
					$('#'+$.m.div.page).empty().mustache('userHomePage', $.m);
						
					// Valid Form.
					$('#formLogin').validate();
					
					// event. Form send. listen.
					$('#formLogin').on('formLogin', $.user.sendLogin);
					
					// Controle pass phrase for complexity.
					$('#formLogin #passPhrase').keyup($.user.passPhraseControl);
					
					// Tooltip page.
					$('#'+$.m.div.page+' span').tooltip();
				}
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
				if(!$('#formLogin #passPhrase').val()) $('#messDangerPhrase').empty();
				
				// Else not vide.
				else {
				
					// Phrase.
					var p = $('#formLogin #passPhrase').val();
					
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
			
			/**
			 * Funct keyHTML.
			 */
			keyHTML: function() {
				
				// If btc adress exist
				if($.m.user.wallet.adr) {
					
					// Clean windows.
					$.tmpl.clean();
						
					// add tmpl. DOC.
					$('#'+$.m.div.page).empty().mustache('keyHTML', $.m);
						
					// Valid Form.
					$('#formKey').validate();
					
					// event. Form send. listen.
					$('#formKey').on('formKey', $.user.keyFUNC);
				}
				
				// If not btcAdr.
				else $.tmpl.error('WARNING_NOT_CONNECTED');
			},
			
			/**
			 * Funct keyFUNC.
			 */
			keyFUNC: function() {
				
				// If btc adress exist
				if($.m.user.wallet.adr) {
					
					// Cree hash of pass phrase.
					var hash = Crypto.util.hexToBytes($.crp.decrypte($.m.user.wallet.hash, $.sha1($('#formKey #password').val())));
					
					// Btc Address
					var sec = new Bitcoin.ECKey(hash);
					var adr = ''+sec.getBitcoinAddress();
					
					// If good adr bitcoin.
					if($.m.user.wallet.adr == adr) {
						
						// Private Key
						var key = ''+sec.getExportedPrivateKey();
						
						// Add key to html.
						$('#keyQrCode').empty().mustache('QrPrivatKeyPart', $.m);
						$('#keyText').html('<i class="fa fa-key"></i> '+key);
						
						// qr code generate.
						$('#qrKeyCodeAdr').qrcode({
							text		: key,
							render		: 'canvas',
							minVersion	: 5,
							maxVersion	: 20,
							ecLevel		: 'H',
							top			: 0,
							size		: 250,
							fill		: '#333333',
							background	: null,
							radius		: 0.5,
							mode		: 4,
							mSize		: 0.2,
							mPosX		: 0.5,
							mPosY		: 0.5,
							image		: $.m.user.img.qrp,
						});
						
						// Play sound.
						$.voix.play($.m.voix.sound.click);
						
						// Destruct var.
						sec = '';
						hash = '';
						key = '';
					}
					
					// If not btcAdr.
					else {
						
						// Error.
						$.tmpl.error('FORM_WARNING_ADDR_BTC_INVALID');
						
						// Setup html.
						$.user.homePage();
					}
				}
				
				// If not btcAdr.
				else $.tmpl.error('WARNING_NOT_CONNECTED');
			},
			
			/**
			 * Funct signHTML.
			 */
			signHTML: function() {
				
				// If btc adress exist
				if($.m.user.wallet.adr) {
					
					// Clean windows.
					$.tmpl.clean();
						
					// add tmpl. DOC.
					$('#'+$.m.div.page).empty().mustache('signHTML', $.m);
					
					// Valid Form.
					$('#formSignMess').validate();
					
					// event. Form send. listen.
					$('#formSignMess').on('formSignMess', $.user.signFUNC);
				}
				
				// If not btcAdr.
				else $.tmpl.error('WARNING_NOT_CONNECTED');
			},
			
			/**
			 * Funct signFUNC.
			 */
			signFUNC: function() {
				
				// If btc adress exist.
				if($.m.user.wallet.adr) {
					
					// Cree hash of pass phrase.
					var hash = Crypto.util.hexToBytes($.crp.decrypte($.m.user.wallet.hash, $.sha1($('#formSignMess #password').val())));
					
					// Private Key+Address
					var sec = new Bitcoin.ECKey(hash);
					var adr = ''+sec.getBitcoinAddress();
					var key = ''+sec.getExportedPrivateKey();
					var payload = Bitcoin.Base58.decode(key);
					var compressed = payload.length == 38;
					
					// If good adr bitcoin.
					if($.m.user.wallet.adr == adr) {
						
						// Message
						$.m.user.wallet.mess = $('#formSignMess #mess').val();
						
						// Signature of message
						$.m.user.wallet.sign = $.user.sign_message(sec, $.m.user.wallet.mess, compressed);
						
						// If good adr bitcoin.
						if($.m.user.wallet.sign) {
							
							// Add key to html.
							$('#signMess').empty().mustache('goodSignPart', $.m);
							
							// Play sound.
							$.voix.play($.m.voix.sound.click);
							
							// Destruct var.
							sec = '';
						}
						
						// Else not sign
						else {
							
							// Destruct var.
							sec = '';
							
							// Error.
							$.tmpl.error('WARNING_SIGN_MESS_ERR');
						}
					}
					
					// If not btcAdr.
					else $.tmpl.error('FORM_WARNING_ADDR_BTC_INVALID');
				}
				
				// If not btcAdr.
				else $.tmpl.error('WARNING_NOT_CONNECTED');
			},
			
			/**
			 * Funct verifHTML.
			 */
			verifHTML: function() {
					
				// Clean windows.
				$.tmpl.clean();
					
				// add tmpl. DOC.
				$('#'+$.m.div.page).empty().mustache('verifHTML', $.m);
					
				// Valid Form.
				$('#formVerif').validate();
				
				// event. Form send. listen.
				$('#formVerif').on('formVerif', $.user.verifFUNC);
				
				// Tooltip page.
				$('#'+$.m.div.page+' span').tooltip();
			},
			
			/**
			 * Funct verifFUNC.
			 */
			verifFUNC: function() {
						
				// If good adr bitcoin on sign.
				if($.user.verify_message($('#formVerif #sign').val(), $('#formVerif #mess').val())==$('#formVerif #btcadr').val()) {
					
					// login body for modal.
					$('#verifMess').empty().mustache('valideSignPart', $.m);
					
					// Play sound.
					$.voix.play($.m.voix.sound.click);
					
					// Print message 3s.
					setTimeout(function() {
						
						// html add defaut Partials.
						$('#verifMess').empty().mustache('verifDefautPart', $.m);
					}, 3000);
				}
				
				// If not btcAdr.
				else $.tmpl.error('WARNING_SIGN_INVALID');
			},
			
			/**
			 * Funct sendLogin.
			 */
			sendLogin: function() {
				
				// If btc adress exist.
				if(!$.m.user.wallet.adr) {
					
					// Cree hash of pass phrase.
					var hash = Crypto.SHA256($('#formLogin #passPhrase').val(), { asBytes: true });
					
					// Private Key+Address
					var sec = new Bitcoin.ECKey(hash);
					
					// Add address bitcoin.
					$.m.user.wallet.adr = ''+sec.getBitcoinAddress();
					
					// Hash pass phrase bitcoin.
					$.m.user.wallet.hash = $.crp.crypte(Crypto.util.bytesToHex(hash), $.sha1($('#formLogin #password').val()));
					
					// Destruct var.
					sec = '';
					
					// event. login. trigger.
					$('#'+$.m.div.event).trigger('login');
					
					// Delete menu right.
					$('#'+$.m.div.mRight).empty();
					
					// Setup html.
					$.user.homePage();
					
					// Play sound.
					$.voix.play($.m.voix.sound.click);
				}
				
				// If not btcAdr.
				else $.tmpl.error('WARNING_CONNECTED');
			},
			
			/**
			 * Funct sendLogout.
			 */
			sendLogout: function() {
				
				// If btc adress exist.
				if($.m.user.wallet.adr) {
					
					// Add address bitcoin.
					$.m.user.wallet = {};
					
					// Delete menu right.
					$('#'+$.m.div.mRight).empty();
					
					// Setup html.
					$.user.homePage();
					
					// event. login. trigger.
					$('#'+$.m.div.event).trigger('logout');
				}
				
				// If not btcAdr.
				else $.tmpl.error('WARNING_NOT_CONNECTED');
			},
			
			/**
			 * Function sign_message interne.
			 * @param   ...
			 */
			sign_message: function(private_key, message, compressed, addrtype) {
				
				function msg_numToVarInt(i) {
					if (i < 0xfd) {
						return [i];
					} else if (i <= 0xffff) {
						// can't use numToVarInt from bitcoinjs, BitcoinQT wants big endian here (!)
						return [0xfd, i & 255, i >>> 8];
					} else {
						throw ("message too large");
					}
				}
				
				function msg_bytes(message) {
					var b = Crypto.charenc.UTF8.stringToBytes(message);
					return msg_numToVarInt(b.length).concat(b);
				}

				function msg_digest(message) {
					var b = msg_bytes("Bitcoin Signed Message:\n").concat(msg_bytes(message));
					return Crypto.SHA256(Crypto.SHA256(b, {asBytes:true}), {asBytes:true});
				}
				
				if (!private_key) return false;
					
				var signature = private_key.sign(msg_digest(message));
				var address = new Bitcoin.Address(private_key.getPubKeyHash());
				address.version = addrtype ? addrtype : 0;
				
				//convert ASN.1-serialized signature to bitcoin-qt format
				var obj = Bitcoin.ECDSA.parseSig(signature);
				var sequence = [0];
				sequence = sequence.concat(obj.r.toByteArrayUnsigned());
				sequence = sequence.concat(obj.s.toByteArrayUnsigned());
				
				for (var i = 0; i < 4; i++) {
					var nV = 27 + i;
					if (compressed)
						nV += 4;
					sequence[0] = nV;
					var sig = Crypto.util.bytesToBase64(sequence);
					if ($.user.verify_message(sig, message, addrtype) == address) return sig;
				}
				return false;
			},
			
			/**
			 * Funct verify_message interne.
			 */
			verify_message: function(signature, message, addrtype) {
				
				function msg_numToVarInt(i) {
					if (i < 0xfd) {
						return [i];
					} else if (i <= 0xffff) {
						// can't use numToVarInt from bitcoinjs, BitcoinQT wants big endian here (!)
						return [0xfd, i & 255, i >>> 8];
					} else {
						throw ("message too large");
					}
				}
				
				function msg_bytes(message) {
					var b = Crypto.charenc.UTF8.stringToBytes(message);
					return msg_numToVarInt(b.length).concat(b);
				}
				
				function msg_digest(message) {
					var b = msg_bytes("Bitcoin Signed Message:\n").concat(msg_bytes(message));
					return Crypto.SHA256(Crypto.SHA256(b, {asBytes:true}), {asBytes:true});
				}
				
				try {
					var sig = Crypto.util.base64ToBytes(signature);
				} catch(err) {
					return false;
				}
				if (sig.length != 65) return false;
				// extract r,s from signature
				var r = BigInteger.fromByteArrayUnsigned(sig.slice(1,1+32));
				var s = BigInteger.fromByteArrayUnsigned(sig.slice(33,33+32));
				// get recid
				var compressed = false;
				var nV = sig[0];
				if (nV < 27 || nV >= 35) return false;
				if (nV >= 31) {
					compressed = true;
					nV -= 4;
				}
				var recid = BigInteger.valueOf(nV - 27);
				var ecparams = getSECCurveByName("secp256k1");
				var curve = ecparams.getCurve();
				var a = curve.getA().toBigInteger();
				var b = curve.getB().toBigInteger();
				var p = curve.getQ();
				var G = ecparams.getG();
				var order = ecparams.getN();
				var x = r.add(order.multiply(recid.divide(BigInteger.valueOf(2))));
				var alpha = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(p);
				var beta = alpha.modPow(p.add(BigInteger.ONE).divide(BigInteger.valueOf(4)), p);
				var y = beta.subtract(recid).isEven() ? beta : p.subtract(beta);
				var R = new ECPointFp(curve, curve.fromBigInteger(x), curve.fromBigInteger(y));
				var e = BigInteger.fromByteArrayUnsigned(msg_digest(message));
				var minus_e = e.negate().mod(order);
				var inv_r = r.modInverse(order);
				var Q = (R.multiply(s).add(G.multiply(minus_e))).multiply(inv_r);
				var public_key = Q.getEncoded(compressed);
				var addr = new Bitcoin.Address(Bitcoin.Util.sha256ripe160(public_key));
				addr.version = addrtype ? addrtype : 0;
				return addr.toString();
			},
		}
	});
	
})(jQuery);