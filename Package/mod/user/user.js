/**
 * @version 0.6.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package user.user.js
 */

(function($, undefined) {
	
	$.extend( {
		
		user: {
			
			/**
			 * Funct setup. Init mod accueil.
			 */
			setup: function() {
				
				// Load model.
				$.m.load('user');
				
				// Event. Tmpl mod.
				$('#'+$.m.div.event).one($.m.event.setup, $.user.defautHtml);
			},
			
			/**
			 * Funct defautHtml. Menu in dock.
			 */
			defautHtml: function() {
				
				// Load tmpl.
				$.tmpl.load('user', function () {
					
					// Wallet var.
					$.m.user.wallet = {};
					
					// Image for qr code
					$.m.user.img = {};
					$.m.user.img.qr = new Image();
					$.m.user.img.qr.src = "img/css/qr.png";
					$.m.user.img.qrp = new Image();
					$.m.user.img.qrp.src = "img/css/qrp.png";
					
					// add tmpl.
					$('#'+$.m.div.menu).mustache('mUser', $.m, {method:'prepend'});
					
					// Tooltip.
					$('#mUser button').tooltip();
					
					// event. setup listen.
					$('#'+$.m.div.event).on($.m.event.langue, $.user.editeVideo);
				});
			},
			
			/**
			 * Funct accueil.
			 */
			accueil: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// Anim complete.
				$('#'+$.m.div.content).fadeOut(300, function() {
					
					// If btc adress exist
					if($.m.user.wallet.adr) {
						
						// add tmpl. DOC.
						$('#'+$.m.div.content).empty().mustache('wallet', $.m);
						
						// If tx exist. paginate Table.
						if($.m.user.wallet.tx) $('#myTxTab').paginateTable({ rowsPerPage: 3, pager: ".pagerMyTx" });
						
						// qr code generate.
						$('#qrCodeAdr').qrcode({
							text		: $.m.user.wallet.adr,
							render		: 'canvas',
							minVersion	: 2,
							maxVersion	: 20,
							ecLevel		: 'H',
							top			: 0,
							size		: 250,
							fill		: '#ffffff',
							background	: null,
							radius		: 0.5,
							mode		: 4,
							mSize		: 0.2,
							mPosX		: 0.5,
							mPosY		: 0.5,
							image		: $.m.user.img.qr,
						});
						
						// Anim complete.
						$('#'+$.m.div.content).fadeIn(300, function() {
							
							// Tooltip.
							$('#conten i').tooltip();
						});
					}
					
					// Else not btc adress
					else {
						
						// add tmpl. DOC.
						$('#'+$.m.div.content).empty().mustache('accueil', $.m);
						
						// Anim complete.
						$('#'+$.m.div.content).fadeIn(300, function() {
							
							// Add video bitcoin.
							$('#videoUser').tubeplayer({
								initialVideo	: $.lng.tx($.m.user.vid),
								protocol		: $.m.protocol
							});
							
							// Valid Form.
							$('#formLogin').validate();
							
							// event. Form send. listen.
							$('#formLogin').on('formLogin', $.user.sendLogin);
							
							// Tooltip.
							$('#conten i').tooltip();
						});
					}
				});
			},
			
			/**
			 * html editeVideo.
			 */
			editeVideo: function() {
				
				// If video in dom.
				if($('#videoUser').length) {
									
					// Add video bitcoin.
					$('#videoUser').removeClass( "jquery-youtube-tubeplayer" ).empty();
					
					// Add new video in dom.
					$('#videoUser').tubeplayer({
						initialVideo	: $.lng.tx($.m.user.vid),
						protocol		: $.m.protocol
					});
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
					
					// Anim complete.
					$('#'+$.m.div.content).fadeOut(300, function() {
						
						// add tmpl. DOC.
						$('#'+$.m.div.content).empty().mustache('keyHTML', $.m);
						
						// Anim complete.
						$('#'+$.m.div.content).fadeIn(300, function() {
							
							// Valid Form.
							$('#formKey').validate();
							
							// event. Form send. listen.
							$('#formKey').on('formKey', $.user.keyFUNC);
						});
					});
				}
				
				// If not btcAdr.
				else $.tmpl.error('USER-ALREADY-NOT-CONNECTED');
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
							fill		: '#ffffff',
							background	: null,
							radius		: 0.5,
							mode		: 4,
							mSize		: 0.2,
							mPosX		: 0.5,
							mPosY		: 0.5,
							image		: $.m.user.img.qrp,
						});
						
						// Play sound.
						$.voix.play($.m.tmpl.sound.click);
						
						// Destruct var.
						sec = '';
						hash = '';
						key = '';
					}
					
					// If not btcAdr.
					else {
						
						// Error.
						$.tmpl.error('FORM-MESSAGE-ADR-BTC-MIN');
						
						// Setup html.
						$.user.accueil();
					}
				}
				
				// If not btcAdr.
				else $.tmpl.error('USER-ALREADY-NOT-CONNECTED');
			},
			
			/**
			 * Funct signHTML.
			 */
			signHTML: function() {
				
				// If btc adress exist
				if($.m.user.wallet.adr) {
					
					// Clean windows.
					$.tmpl.clean();
					
					// Anim complete.
					$('#'+$.m.div.content).fadeOut(300, function() {
						
						// add tmpl. DOC.
						$('#'+$.m.div.content).empty().mustache('signHTML', $.m);
						
						// Anim complete.
						$('#'+$.m.div.content).fadeIn(300, function() {
							
							// Valid Form.
							$('#formSignMess').validate();
							
							// event. Form send. listen.
							$('#formSignMess').on('formSignMess', $.user.signFUNC);
						});
					});
				}
				
				// If not btcAdr.
				else $.tmpl.error('USER-ALREADY-NOT-CONNECTED');
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
							$.voix.play($.m.tmpl.sound.click);
							
							// Destruct var.
							sec = '';
						}
						
						// Else not sign
						else {
							
							// Destruct var.
							sec = '';
							
							// Error.
							$.tmpl.error('USER-SIGN-MESS-ERR');
						}
					}
					
					// If not btcAdr.
					else $.tmpl.error('FORM-MESSAGE-ADR-BTC-MIN');
				}
				
				// If not btcAdr.
				else $.tmpl.error('USER-ALREADY-NOT-CONNECTED');
			},
			
			/**
			 * Funct verifHTML.
			 */
			verifHTML: function() {
					
				// Clean windows.
				$.tmpl.clean();
				
				// Anim complete.
				$('#'+$.m.div.content).fadeOut(300, function() {
					
					// add tmpl. DOC.
					$('#'+$.m.div.content).empty().mustache('verifHTML', $.m);
					
					// Anim complete.
					$('#'+$.m.div.content).fadeIn(300, function() {
						
						// Valid Form.
						$('#formVerif').validate();
						
						// event. Form send. listen.
						$('#formVerif').on('formVerif', $.user.verifFUNC);
					});
				});
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
					$.voix.play($.m.tmpl.sound.click);
					
					setTimeout(function() {
						
						// html add defaut Partials.
						$('#verifMess').empty().mustache('verifDefautPart', $.m);
					}, 3000);
				}
				
				// If not btcAdr.
				else $.tmpl.error('USER-NOT-SIGN-VALIDE');
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
					
					// Setup html.
					$.user.accueil();
					
					// add btn logout to menu.
					$('#mUser').mustache('logoutBtnPart', $.m);
					
					// Tooltip.
					$('#mUser button').tooltip();
				}
				
				// If not btcAdr.
				else $.tmpl.error('USER-ALREADY-CONNECTED');
			},
			
			/**
			 * Funct sendLogout.
			 */
			sendLogout: function() {
				
				// If btc adress exist.
				if($.m.user.wallet.adr) {
					
					// Add address bitcoin.
					$.m.user.wallet = {};
					
					// Setup html.
					$.user.accueil();
					
					// event. login. trigger.
					$('#'+$.m.div.event).trigger('logout');
					
					// remove btn logout to menu.
					$('#mIbtcSignSpin, #mIbtcKeySpin, #mIbtcLogoutSpin').remove();
				}
				
				// If not btcAdr.
				else $.tmpl.error('USER-ALREADY-NOT-CONNECTED');
			},
			
			/**
			 * Function sign_message.
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
			 * Funct verify_message.
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