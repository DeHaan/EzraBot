/***********************************************************
 *          Title: 	trannybot
 *             By:	CLEWIS_
 *
 *         Author: 	'clewis_'
 *       Originally based on acrazyguy's "Kati3Bot."
 * 
 *  	  Version: 	1.1.0 (2019.05.23)
 *  GitHub branch:	Stable ("master") branch
 *     Build type:      Stable (CB live site)
 **********************************************************/

/********** App Data **********/
var app =
{
	name	  : "'TrannyBot'",		/* Script name						*/
	type	  : 'Bot',			/* Script type: bot|app					*/
	version	  : '1.1.0',			/* Internal: Script version number			*/ 
//	revision  : 'broadcaster control panel',			/* Internal: Script revision				*/
	buildtype : 'stable',	 		/* Internal: Script build type (stable or dev)		*/
  	builddate : 'May 23, 2015',  	  	/* Internal: Script build date				*/
  	buildtime : '02:45:00 BRT (GMT-0300)', 	/* Internal: Script build time				*/
	dhn	  : 'clewis_', 			/* Developer						*/
	ez	  : 'ericka',			/* Broadcaster						*/
	CD	  : 'dump'			/* Debug: quick overview. Only accessible by the dev	*/
};


/***** App colors *****/
var COLOR =
{
	DEVELOPER	: '#D9F7D9',	/* Very light green; used as highlight		  */
	NOTICE		: '#6900CC',	/* Chat notice color - Blue-purple		  */
	RED 		: '#FF1407',
	MRED		: '#D80A00',
	HIGHLIGHT	: '#EEE5FF',	/* Ticket holder Highlight color - Pastel purple  */
	SYNTAX 		: '#995B00',	/* Usage notice color - Brownish		  */
	AMBER		: '#E56B00',	/* Amber					  */
	MOD		: '#DC0000',	/* Moderator red				  */
	HVTEXT 		: '#D80A00',	/* Text color for hi-vis notices - Red		  */
	HVBACK 		: '#FFFFBF',	/* Background color for hi-vis notices - Yellow	  */
	HELP 		: '#144D8C',	/* Text color for help - Blue gray		  */
	INFO 		: '#144D8C',	/* neutral notice - Blue gray			  */
	MAG		: '#E509E5',	/* Magenta					  */
	BLUE		: '#000099',
	PPINK		: '#FFE0EA',
	DHN_TEXT	: '#16493B',	/* dark green; custom text color for me 	  */
	EZ_HL		: '#FFDDF4'	/* light pink; special highlight		  */
};


/***** App commands *****/
var COMMAND =
{
	CN	: 'cn', 		/* Send general notice to the public.				 */
	CNH	: 'cnh',		/* Same as above, but with highlighting.			 */
	CND	: 'cnd',		/* Same as /cn, but with divider lines.				 */
	CNDH	: 'cndh',		/* Same as /cnd, but with highlighting.				 */
	BC	: 'bc', 		/* Send private notice to the broadcaster (mods only).		 */
	TM	: 'tm', 		/* Send private notice to mods as a group.			 */
	TV	: 'tv',			/* Send private notice to a viewer.				 */
	EBHELP	: 'ebhelp', 		/* Send command list to mod/broadcaster.			 */
	TOPT	: 'topt',		/* Send torture tip options to viewer.				 */
	TPRICE	: 'tprice',		/* Assign ticket price.						 */
//	ADD 	: 'add',		/* Add one or more viewers to ticket list. UNUSED COMMAND.	 */
//	AU 	: 'au',			/* Add user(s) alias. UNUSED COMMAND.				 */
//	DEL 	: 'del',		/* Delete a user. UNUSED COMMAND.				 */
//	DU	: 'du',			/* Delete alias. UNUSED COMMAND.				 */
	TLIST 	: 'tlist',		/* Lists users who paid for a ticket.				 */
//	EMAIL	: 'email',		/* Detect email in tip note. UNUSED COMMAND.			 */
//	EMLIST	: 'emlist',		/* List recorded emails. UNUSED COMMAND.			 */
	SIL	: 'sil',		/* Silence a certain user.					 */
	UNSIL	: 'unsil',		/* Unsilence a certain user.					 */
	SLIST	: 'slist',		/* Show the list of silenced users.				 */
	TON	: 'ton',		/* Enable torture notices.					 */
	TOFF	: 'toff',		/* Disable torture notices.					 */
//	EXPORT	: 'export',		/* Export ticket data. UNUSED COMMAND.				 */
	MON	: 'mon',		/* Enables monitoring for each mod.				 */
	ABOUT	: 'about',		/* Shows version info.						 */
	CLEANUP : 'cleanup',		/* Cleans up the chat;	"hidden" command                         */
        EBHID   : 'ebhidden'   		/* Shows "hidden" commands which work if invoked by the dev only */
};


/********** Variables **********/
var FLAG =
{
	price	: false,
	advance	: false,
	torture	: false,
	insta	: false,
	denial	: false,
	email	: false,
	dev	: false // keep this flag off in stable builds
};

var ticketsSold 	= 0;
var tipTot		= 0;

var startTime 		= new Date();

var MODS		= 'red';
var ONLY_MODS 		= "* This command is only available to moderators.";
var ONLY_DEV		= "* This command is only available to the developer.";
var warnMsg		= "* 'EzraBot': Your message has broken room rules and has been removed from the chat.";
var tOptions		= "Type /topt for more tip options.";

var roomHost		= cb.room_slug;

var dashLine		= "------------------------------------------------------------";


/***** Arrays *****/
var ticketList 	= [];
var silList	= [];
var devList	= [];
var monList	= [];

var emList = 
{
	name	: [],
	email	: []
};

/************************/
/***** API Functions ****/
/************************/


cb.settings_choices =
[
{
	name: 'advance',
	type: 'choice',
		choice1: 'Yes',
		choice2: 'No',
	defaultValue: 'No',
	label: "Use 'trannyBot' to sell advance tickets for a future 'CrazyTicket' show?"
},
{
	name: 'buyin',
	type: 'int',
	//minValue: 1,
	//defaultValue: 25,
	label: "Enter ticket price ONLY if used for advance ticket sales OR 'CrazyTicket' backup.",
	required: false
},
{
	name: 'mutefeet',
	type: 'choice',
		choice1: 'Yes',
		choice2: 'No',
	defaultValue: 'No',
	label: "Mute 'feet' messages?"
},
{
	name: 'warnviewer',
	type: 'choice',
		choice1: 'Yes',
		choice2: 'No',
	defaultValue: 'No',
	label: "Send a warning message to offending gray users?"
},

/*
{
	name: 'enabletorture',
	type: 'choice',
		choice1: 'Yes',
		choice2: 'No',
	defaultValue: 'No',
	label: "Enable vibrator/Sybian torture?"
},
*/

{
	name: 'tortstart',
	type: 'int',
	minValue: 1,
	defaultValue: 50,
	label: "Tokens to start torture."
},
{
	name: 'tortstop',
	type: 'int',
	minValue: 1,
	defaultValue: 100,
	label: "Tokens to stop torture."
},
{
	name: 'powerup',
	type: 'int',
	minValue: 1,
	defaultValue: 60,
	label: "Tokens to increase power/speed."
},
{
	name: 'powerdown',
	type: 'int',
	minValue: 1,
	defaultValue: 70,
	label: "Tokens to decrease power/speed."
},
{
	name: 'muteamt',
	type: 'int',
	minValue: 1,
	defaultValue: 250,
	label: "Tokens to mute."
},
{
	name: 'unmuteamt',
	type: 'int',
	minValue: 1,
	defaultValue: 200,
	label: "Tokens to unmute."
},
{
	name: 'instacum',
	type: 'int',
	minValue: 1,
	defaultValue: 2000,
	label: "Tokens to toggle instacum."
},
{
	name: 'denial',
	type: 'int',
	minValue: 1,
	defaultValue: 6969,
	label: "Tokens to toggle cum denial."
}

/*
{
	name: 'email',
	type: 'choice',
		choice1: 'Yes',
		choice2: 'No',
	defaultValue: 'No',
	label: "Record ticket buyer's email address if including a bonus in ticket price?"
}
*/
];


var ticketPrice	= parseInt(cb.settings.buyin,10);
if (cb.settings.advance === 'Yes')	FLAG.advance = true;
if (cb.settings.buyin)			FLAG.price = true;
//if (cb.settings.email === 'Yes')	FLAG.email = true;

/* Uncomment this if needed
cb.onEnter(function(viewer)
{
	cb.sendNotice(dashLine+"\n* (Insert message here) *\n"+dashLine,viewer.user,COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');

}); */


cb.onTip(function(tip)
{
	var viewer		= tip['from_user'];
	var tMsg		= tip['message'];
	var tipAmount 		= parseInt(tip['amount'],10);
	var address		= "";
	var idx			= 0;

	tipTot += tipAmount;
/*
	if (FLAG.email) {
		address = tMsg.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i) || "";
		idx = emList.name.indexOf(viewer);
		if (idx > -1 && !emList.email[idx]) {
			emList.email[idx] = address;
			cb.sendNotice(dashLine+"\n* Missing email address for '"+viewer+"' recorded.\n"+dashLine,roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');
		}
	}
*/
	if ((tipAmount >= ticketPrice) && FLAG.price) {
		if (!cbjs.arrayContains(ticketList,viewer)) {
			user('add',viewer,false);
			if (FLAG.advance) cb.sendNotice(dashLine+"\n* Advance ticket sold to '" + viewer + "'\n"+dashLine,'','',COLOR.NOTICE,'bold');

			if (FLAG.email) {
				address = tMsg.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i) || "";
				emList.name.push(viewer);
				emList.email.push(address);
				if (!address) {
					cb.sendNotice("* You may have forgotten your email address in the tip note.",viewer,'',COLOR.RED,'bold');
					cb.sendNotice("* Viewer '" +viewer+ "' may have forgotten their email address in the tip note.",roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');
					cb.sendNotice("* Viewer '" +viewer+ "' may have forgotten their email address in the tip note.",'','',COLOR.MOD,'bold','red');
				} else {
					cb.sendNotice(dashLine+"\n* Email address recorded.\n"+dashLine,roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');
				}
			} // End if FLAG.email
		}
	}
	
	if (FLAG.torture) {
	
		switch (tipAmount) {
		
			case cb.settings.tortstart:
				cb.sendNotice(dashLine+"\n Torture has been S T A R T E D ! \n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
			break;
			
			case cb.settings.tortstop:
				cb.sendNotice(dashLine+"\n Torture has been S T O P P E D ! \n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
			break;
			
			case cb.settings.powerup:
				cb.sendNotice(dashLine+"\n* F A S T E R !\n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
			break;
			
			case cb.settings.powerdown:
				cb.sendNotice(dashLine+"\n* S L O W E R !\n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
			break;
			
			case cb.settings.muteamt:
				cb.sendNotice(dashLine+"\n* M U T E D !\n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
			break;

			case cb.settings.unmuteamt:
				cb.sendNotice(dashLine+"\n* U N M U T E D !\n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
			break;
	
			case cb.settings.instacum:
				cb.sendNotice(dashLine+"\n* "+(FLAG.insta ? "I N S T A C U M CANCELLED! \n" : "I N S T A C U M ! \n ")+dashLine+"\n* Tip "+cb.settings.instacum+" tokens to "+(FLAG.insta ? "ENABLE INSTACUM." : " CANCEL INSTACUM.")+"\n* "+tOptions+"\n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
				FLAG.insta ? FLAG.insta = false : FLAG.insta = true;
			break;
			
			case cb.settings.denial:
				cb.sendNotice(dashLine+"\n* "+(FLAG.denial ? "C U M  D E N I A L CANCELLED! \n" : "C U M  D E N I A L ! \n")+dashLine+"\n* Tip "+cb.settings.denial+" tokens to "+(FLAG.denial ? "ENABLE CUM DENIAL." : " CANCEL CUM DENIAL.")+"\n* "+tOptions+"\n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
				FLAG.denial ? FLAG.denial = false : FLAG.denial = true;
			break;

		}  // End switch()
	}
});


cb.onMessage(function (msg)
{
	var regexCommandSplit	= '^' + '/' + '(\\S+)(?:\\b\\s*)(.*)?';
	var regexListSplit		= /[,\s]+/;
	var reCmdSplit = new RegExp(regexCommandSplit);
	var cmdSplit = msg['m'].match(reCmdSplit);
	var cmd;
	var cmdval;
	var cmdValArray; 
	if ( cmdSplit ) {
		cmd = cmdSplit[1];
		cmdval = cmdSplit[2];
		if ( cmdval != null ) {
			cmdval = cmdval.replace(/^\s+|\s+$/g,'');
		}
		if ( cmdval != null ) {
			cmdValArray = cmdval.split(regexListSplit);
		} else {
			cmdValArray = '';
		}
	}

	// for convenience
	var m 			= msg['m'];
	var u 			= msg['user'];
	var isMod		= msg['is_mod'];
	var isRoomHost		= (u === roomHost);
	var isDHN		= (u === app.dhn);
	var isEzra		= (u === app.ez);
	var viewer, toViewer;

	if (/^(\?|!)/.test(m)) {
		msg['X-Spam'] = true;
		return cb.sendNotice("* " +app.name+ ": Incorrect command prefix.",u,'',COLOR.MOD,'bold');
	}

	if (cbjs.arrayContains(silList,u) && !isMod) {
		msg['X-Spam'] = true;
		return;
	}


	/***** Ok, let's start processing commands *****/
	switch (cmd) {
	
		//***** Public Notice *****
		case COMMAND.CN:
			if (isMod || isRoomHost || (isDHN && FLAG.dev)) {
				if (cmdval) {
					cb.sendNotice("* " + cmdval.substr(0,1).toUpperCase()+cmdval.substr(1),'','',COLOR.NOTICE,'bold');
				} else {
					cb.sendNotice("* Syntax: /cn <message>",u,'',COLOR.SYNTAX,'bold');
				}
			} else {
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
			}
		break;


		case COMMAND.CNH:
			if (isMod || isRoomHost || (isDHN && FLAG.dev)) {
				if (cmdval) {
					cb.sendNotice("* " + cmdval.substr(0,1).toUpperCase()+cmdval.substr(1),'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
				} else {
					cb.sendNotice("* Syntax: /cnh <message>",u,'',COLOR.SYNTAX,'bold');
				}
			} else {
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
			}
		break;


		case COMMAND.CND:
			if (isMod || isRoomHost || (isDHN && FLAG.dev)) {
				if (cmdval) {
					cb.sendNotice(dashLine+"\n* " + cmdval.substr(0,1).toUpperCase()+cmdval.substr(1)+"\n"+dashLine,'','',COLOR.NOTICE,'bold');
				} else {
					cb.sendNotice("* Syntax: /cnd <message>",u,'',COLOR.SYNTAX,'bold');
				}
			} else {
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
			}
		break;


		case COMMAND.CNDH:
			if (isMod || isRoomHost || (isDHN && FLAG.dev)) {
				if (cmdval) {
					cb.sendNotice(dashLine+"\n* " + cmdval.substr(0,1).toUpperCase()+cmdval.substr(1)+"\n"+dashLine,'',COLOR.HIGHLIGHT,COLOR.NOTICE,'bold');
				} else {
					cb.sendNotice("* Syntax: /cndh <message>",u,'',COLOR.SYNTAX,'bold');
				}
			} else {
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
			}
		break;


		//***** Message to Broadcaster *****
		case COMMAND.BC:
		if (isMod || (isDHN && FLAG.dev)) {
			if (cmdval) {
				cb.sendNotice("* "+ (isMod ? u.toUpperCase() + ": " : "--- EzraBot App Support --- *\n* ") + cmdval,roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');
				cb.sendNotice("* "+ (isMod ? u.toUpperCase() + ": " : "--- EzraBot App Support --- *\n* ") + cmdval,u,COLOR.HVBACK,COLOR.HVTEXT,'bold');
			} else {
				cb.sendNotice("* Syntax: /bc <message>",u,'',COLOR.SYNTAX,'bold');
			}
		} else { 
			cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
		}
		break;


		//***** Message to Mods *****
		case COMMAND.TM:
			if (isMod || isRoomHost) {
				if (cmdval) {
					cb.sendNotice("* "+ u.toUpperCase() + ": " + cmdval,'',COLOR.HVBACK,COLOR.HVTEXT,'bold','red');
				} else {
					cb.sendNotice("* Syntax: /tm <message>",u,'',COLOR.SYNTAX,'bold');
				}
			} else { 
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
			} 
		break;


		//***** Message to Viewer *****
		case COMMAND.TV:
			viewer = cmdValArray[0];
			cbjs.arrayRemove(cmdValArray,cmdValArray[0]);
			toViewer = cbjs.arrayJoin(cmdValArray," ");
			if (isMod || isRoomHost || ((isDHN || isEDHN) && FLAG.dev)) {
				if (cmdval) {
					cb.sendNotice("*EzraBot* " + toViewer,viewer,'',COLOR.RED,'bold');
				} else {
					cb.sendNotice("* Syntax: /tv viewername message",u,'',COLOR.SYNTAX,'bold');
				}
			} else {
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
			}
		break;


		//***** Ticket Price *****
		case COMMAND.TPRICE:
			if (isMod || isRoomHost || (isDHN && FLAG.dev)) {
				if(cmdval) {
					if (parseInt(cmdval,10)) {
						ticketPrice = cmdval;
						cb.sendNotice("* Ticket price set at " + cmdval + " tokens.",u,'',COLOR.NOTICE,'bold');
						FLAG.price = true;
					} else {
						cb.sendNotice("* '" + cmdval + "' not a valid argument.",u,'',COLOR.NOTICE,'bold');
					}
				} else {
					cb.sendNotice("* Syntax: " + '/' + COMMAND.TPRICE + " <price>",u,'',COLOR.SYNTAX,'bold');
				}
			} else {
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
			}
		break;


		case COMMAND.TOPT:
			tipOptStr  = "---------- TORTURE TIP OPTIONS ----------";
			tipOptStr += "\n* Start: "+cb.settings.tortstart;
			tipOptStr += "\n* Stop: "+cb.settings.tortstop;
			tipOptStr += "\n* Faster: "+cb.settings.powerup;
			tipOptStr += "\n* Slower: "+cb.settings.powerdown;
			tipOptStr += "\n* Mute: "+cb.settings.muteamt;
			tipOptStr += "\n* Unmute: "+cb.settings.unmuteamt;
			tipOptStr += "\n* Instacum toggle: "+cb.settings.instacum;
			tipOptStr += "\n* Cum denial toggle: "+cb.settings.denial;
			tipOptStr += "\n"+dashLine;
			cb.sendNotice(tipOptStr,u,'',COLOR.INFO,'bold');
		break;


		//***** Help *****
		case COMMAND.EBHELP:
			if (isMod || isRoomHost)
				cb.sendNotice(getCommandList(),u,'',COLOR.HELP,'bold');
			else 
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
		break;

/*
		//***** Add user(s) *****
		case COMMAND.ADD:
		case COMMAND.AU:
			if (isMod || isRoomHost) {
				if (cmdval) {
					if (cmdValArray.length > 1) {
						for (var i=0; i<cmdValArray.length; i++) {
							if ( !user('check',cmdValArray[i]) ) {
								user('add',cmdValArray[i],false);
							}
						} // end for
					} else {
						user('add',cmdval,false);
					} // end if cmdValArray.length
				} else { 
					if ( !user('check',msg['user']) ) {
						user('add',msg['user'],false);
					}
				} // end if cmdval
			}
		break;


		//***** Delete user *****
		case COMMAND.DEL:
		case COMMAND.DU:
			if (isMod || isRoomHost) {
				if (cmdval) {
					if (user('check',cmdval)) {
						user('del',cmdval);
					}
				}
			}
		break;
*/

		//***** Show ticket list *****
		case COMMAND.TLIST:
			cb.sendNotice(dashLine+"\nTicket holders: " + ticketList.length + "\n" + dashLine + "\n" + (ticketList.length < 1 == true ? "No tickets sold!" : cbjs.arrayJoin(ticketList,", ")) + "\n"+dashLine,u,'',COLOR.NOTICE,'bold');
		break;


		case COMMAND.SIL:
			if (isMod || isRoomHost) {
				if (cmdval) {
					if (!cbjs.arrayContains(silList,cmdval)) {
						silList.push(cmdval);
					}
				}
			}
		break;


		case COMMAND.UNSIL:
			if (isMod || isRoomHost) {
				if (cmdval) {
					cbjs.arrayRemove(silList,cmdval);
				}
			}
		break;


		case COMMAND.SLIST:
			if (isMod || isRoomHost || (isDHN && FLAG.dev))
				cb.sendNotice(dashLine+"\n* "+app.name+" Silenced: "+silList.length+"\n"+dashLine+"\n"+ (silList.length < 1 == true ? "* Empty." : cbjs.arrayJoin(silList,", "))+"\n"+dashLine,u,'',COLOR.NOTICE,'bold');
		break;

/*
		case COMMAND.EXPORT:
			if (isMod || isRoomHost) {
				msg['m'] = "/add " + cbjs.arrayJoin(ticketList,", ");
			}	
		break;


		case COMMAND.EMAIL:
			if (isMod || isRoomHost) {

				FLAG.email ? FLAG.email = false	: FLAG.email = true;
				
				cb.sendNotice("* Detection of email in tip note is now " + (FLAG.email == true ? "ON." : "OFF."),'','',COLOR.NOTICE,'bold','red');
				cb.sendNotice("* Detection of email in tip note is now " + (FLAG.email == true ? "ON." : "OFF."),roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');
				
			}
		break;


		case COMMAND.EMLIST:
			if (isMod || isRoomHost || isDHN) {
				var outStr = '';
				for (i=0; i<emList.name.length; i++)
					outStr += emList.name[i] + " - " + emList.email[i]+"\n";
				cb.sendNotice(dashLine+"\n* List of email addresses this session: "+emList.name.length+"\n"+dashLine+"\n"+outStr+dashLine,u,'',COLOR.NOTICE,'bold');
			}
		break;
*/

		case COMMAND.MON:
			if (isMod || isRoomHost || isDHN) {
				if (!cbjs.arrayContains(monList,u)) monList.push(u);
				else cbjs.arrayRemove(monList,u);
				cb.sendNotice("* Monitoring of muted messages is now "+(cbjs.arrayContains(monList,u) ? "ON." : "OFF."),u,'',COLOR.INFO,'bold');
			}
		break;
		
		
		case COMMAND.TON:
			if (isMod || isRoomHost) {
				FLAG.torture = true;
				if (isMod) {
					cb.sendNotice(dashLine+"\n* Torture Notices are ENABLED.\n"+dashLine,'','',COLOR.INFO,'bold',MODS);
				}
				cb.sendNotice(dashLine+"\n* Torture Notices are ENABLED.\n"+dashLine,roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');
			}
		break;
		
		
		case COMMAND.TOFF:
			if (isMod || isRoomHost) {
				FLAG.torture = false;
				if (isMod) {
					cb.sendNotice(dashLine+"\n* Torture Notices are DISABLED.\n"+dashLine,'','',COLOR.INFO,'bold',MODS);
				}
				cb.sendNotice(dashLine+"\n* Torture Notices are DISABLED.\n"+dashLine,roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');
			}
		break;

		// ***** Show version info
		case COMMAND.ABOUT:
			if (isMod || isRoomHost)
				cb.sendNotice(showVersionInfo(),u,'',COLOR.HELP,'bold');
			else 
				cb.sendNotice(ONLY_MODS,u,'',COLOR.NOTICE,'bold');
		break;
		
		// ***** Hidden 'cleanup' command
		case COMMAND.CLEANUP:
			if (isDHN)
				cb.sendNotice(cleanUpChat(),'','',COLOR.INFO,'bold');
			else
				cb.sendNotice(ONLY_DEV,u,'',COLOR.NOTICE,'bold');
		break;
			
		// Show hidden commands
		case COMMAND.EBHID:
			if (isDHN)
				cb.sendNotice(getHiddenCommandList(),u,'',COLOR.HELP,'bold');
			else
				cb.sendNotice(ONLY_DEV,u,'',COLOR.NOTICE,'bold');
			break;
			
/*		
		case 'bli':
			if (u===app.bli)
				FLAG.bli ? FLAG.bli = false : FLAG.bli = true;
		break;
*/		
	} // switch

	/* Dev Dump */
	// Internal command for debugging purposes
	if (cmd==app.CD) {
		if (isDHN) {
			var date = new Date();
			if(cmdval=='dev'){if(!cbjs.arrayContains(devList,u)){devList.push(u);FLAG.dev=true;}else{cbjs.arrayRemove(devList,u);FLAG.dev=false;}}else{
			cb.sendNotice("* App info: (Name: "+app.name+"), (Type: "+app.type+"), (Version: "+app.version+", Build type: "+app.buildtype+")\n* (Time started: "+startTime+")\n* (Time now: "+date+")\n* (Total tipped: " +tipTot+ ")\n* Flags: (FLAG.price: "+FLAG.price+"), (FLAG.advance: "+FLAG.advance+"), (FLAG.email: "+FLAG.email+"), (FLAG.dev: "+FLAG.dev+")",u,'',COLOR.INFO,'');
			}
		} // end if u||u||u
	} // end if cmd=app.CD
	
	// Special highlight for app.bli and app.bf
	// if (u===app.bli && FLAG.bli) msg['background'] = COLOR.BLI;

	// little hack for me - includes highlight & text color
	if (isDHN) {
	msg['background'] = COLOR.DEVELOPER;		
	msg['c'] = COLOR.DHN_TEXT;
	}
	
	// highlight for Ezra
	if (isEzra) { 
		msg['background'] = COLOR.EZ_HL;
	}
	
	if (m[0] === '/') msg['X-Spam'] = true; // Suppress all command echoing in chat.
	checkmsg(msg);	
	return msg;
	
}); // onMessage()


/********** Functions **********/
getCommandList = function() {
	
	var cmdlist = "\n----- EzraBot Commands List -----\n\n";
	cmdlist += '/'+COMMAND.CN + " <message> - Sends a one time public notice.\n\n";
	cmdlist += '/'+COMMAND.CND + " <message> - Sends a one time public notice with divider lines.\n\n";
	cmdlist += '/'+COMMAND.CNH + " <message> - Sends a one time public notice with highlighting.\n\n";
	cmdlist += '/'+COMMAND.CNDH + " <message> - Sends a one time public notice with divider lines and highlighting.\n\n";
	cmdlist += '/'+COMMAND.BC + " <message> - Sends a private message to the broadcaster.\n\n";
	cmdlist += '/'+COMMAND.TM + " <message> - Sends a private message to the moderators as a group.\n\n";
	cmdlist += '/'+COMMAND.TV + " <viewer> <message> - Sends a private message to a viewer.\n\n";
	cmdlist += '/'+COMMAND.TPRICE + " <price> - Tells EzraBot the ticket price for advance ticket sales or for CrazyTicket backup.\n\n";
	cmdlist += '/'+COMMAND.TLIST + " - Sends a list of ticket holders to the chat.\n\n";
	/* Unused commands
	cmdlist += '/'+COMMAND.EMAIL + " - Tells the bot to look for and record email addresses in tip notes.\n\n";
	cmdlist += '/'+COMMAND.EMLIST + " - Sends a list of ticket holders email addresses to the chat.\n";
	*/
	cmdlist += '/'+COMMAND.MON + " - Toggles monitoring of gray message muting.\n\n";
	cmdlist += '/'+COMMAND.TON + " - Enables torture notices.\n\n";
	cmdlist += '/'+COMMAND.TOFF + " - Disables torture notices.\n\n";
	cmdlist += '/'+COMMAND.ABOUT + " - Shows EzraBot's version info.\n\n"+dashLine;
	return cmdlist;
}

getHiddenCommandList = function() {
	
	var hiddencmdlist = "\n----- EzraBot Dev-only Commands List -----\n\n";
	hiddencmdlist += '/'+app.CD + " - Quick overview for debugging.\n\n";
	hiddencmdlist += '/'+COMMAND.CLEANUP + " - 'Cleans up' the chat.\n\n"+dashLine;
	return hiddencmdlist;
}

showVersionInfo = function() {

	var versioninfo = "\n* ----- Version info -----";
	versioninfo += "\n* App name: "+app.name;
	versioninfo += "\n* Author: "+app.dhn;
	versioninfo += "\n* Version: "+app.version+" - Date: "+app.builddate+" / Build type: "+app.buildtype;
	versioninfo += "\n* Originally based on acrazyguy's 'Kati3Bot' and his other apps/bots.";
	return versioninfo;
	
}

cleanUpChat = function() {
	
	var chatcleanup = "------------------------------------------------------------";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n* Cleaning up chat...";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n* Cleaning up chat...";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n* Cleaning up chat...";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n* Cleaning up chat...";
	chatcleanup += "\n*";
	chatcleanup += "\n*";
	chatcleanup += "\n* Chat cleaned up.\n"+dashLine;
	return chatcleanup;
}

user = function(command,user,sendpass)
{
	if ((command == 'add') && (!cbjs.arrayContains(ticketList,user)))
		ticketList.push(user);

	if ((command == 'del') && (cbjs.arrayContains(ticketList,user)))
		cbjs.arrayRemove(ticketList,user);

} // end function user


/*
function printObject(o)
{ 
	var out="";
	for (var p in o) { 
		out += "* "+p+": "+o[p]+"\n";
	}
	return out;
}
*/


checkmsg = function(msg)  
{
	var u = msg['user'];
	var tmpmsg = msg['m'];

	var re = /(?=.*\b(rape|fuck|flash|finger|eat|get|show|play|zoom|flash|open|see|touch|suck|rub|eat|lick|spread|smell)\b)(?=.*\b(body|ass|anal|asshole|pussy|cunt|clit|cock|boobs?|bobs?|tits?|armpits?|vagina|nipples?|breasts?|bust|naked|nude|shit|out|me|dog|self)\b)/i;

	var re2 = /\b(pm|c2c|private|pv|pvt|prvt)\b/i;

	var re3 = /((?=.*bitch)|(?=.*slut)|(?=.*whore)|(?=.*cunt)|(?=.*cock)|(?=.*ugly)|(?=.*fat)|(?=.*pee)|(?=.*piss)|(?=.*poo)|(?=.*peeing)|(?=.*fist)|(?=.*faggot)|(?=.*fuck))/i;

	var re4 = /((?=.*ass)|(?=.*pussy)|(?=.*boobs?)|(?=.*bobs?)|(?=.*tits?)|(?=.*vagina)|(?=.*cunt)|(?=.*cock)|(?=.*nipples?)|(?=.*breasts?)|(?=.*anal))((?=.*plz)|(?=.*pls)|(?=.*please))/i;

	var re5 = /((^ass.?.?$)|(^boobs?.?.?$)|(^pussy.?.?$)|(^doggy.?.?$)|(^anal.?.?$)|(^zoom.?.?$)|(^show.?.?$)|(^tits?.?.?$)|(?=.*stand up.?.?)|(?=.*watch my cam.?.?))/i;

	var mutemsg = false;
	var temp;

	if ((!msg['has_tokens']) && (!msg['is_mod']) && (!msg['in_fanclub']) && (msg['user'] != cb['room_slug'])) {

	if (re.test(tmpmsg) || re4.test(tmpmsg)) {
		mutemsg = true;
		temp = 1;
	}

	if (re5.test(tmpmsg)) {
		mutemsg = true;
		temp = 2;
	}

	if (re2.test(tmpmsg)) {
		mutemsg = true;
		temp = 3;
	}

	if (/((?=.*18fcam)|(?=.*streamingnaked)|(?=.*premiumcheat)|(?=.*amecam)|(?=.*18female)|(?=.*erotimo)|(?=.*freesecurecams)|(?=.*xhot)|(?=.*shot)|(?=.*srkype)|(?=.*skrype)|(?=.*ellagocam))/i.test(tmpmsg)) {
		mutemsg = true;
		temp = 4;
	}

	if (re3.test(tmpmsg)) {
		mutemsg = true;
		temp = 5;
	}

	if (/\b(bb|bby|babe|baby|bae|daddy|daughter)\b/i.test(tmpmsg)) {
		mutemsg = true;
		temp = 6;
	}

	if (cb.settings.mutefeet === 'Yes') {
		if (/\b(feet|foot|soles|toes)\b/i.test(tmpmsg)) {
			mutemsg = true;
			temp = 7;
		}
	}

	if (/:\w+[^D|P]/i.test(tmpmsg)) {
		mutemsg = true;
		temp = 8;
	}

	if (/(([:]*)[^\s]*([^\s])\3{3,})/ig.test(tmpmsg)) {
		mutemsg = true;
		temp = 9;
	}

	if (tmpmsg === tmpmsg.toUpperCase() && tmpmsg !== "XD") {
		mutemsg = true;
		temp = 10;
	}

	if (/[^\x00-\x7F]+/.test(tmpmsg)) {
		mutemsg = true;
		temp = 11;
	}

	if (mutemsg) {
		msg['X-Spam'] = true;
		if (cb.settings.warnviewer === 'Yes') cb.sendNotice(warnMsg,u,'',COLOR.INFO,'bold');
		if (monList.length > 0) {
			for (var i=0; i<monList.length; i++)
				cb.sendNotice(temp+" - *CrazyMod* "+msg['user']+": "+tmpmsg,monList[i],'',COLOR.INFO,'bold');
		}
	}
	}
}


init = function()
{
	//user('add',roomHost,false); // add broadcaster to the ticketlist
	
	var appInfo = dashLine+"\n* "+app.name+" by '"+app.dhn+"' has started.";
	appInfo += "\n* Version: "+app.version+" / "+app.buildtype+" build";
	appInfo += "\n* Build date and time: "+app.builddate+" @ "+app.buildtime;
	appInfo += "\n* Type /ebhelp for a list of available commands.\n"+dashLine;
	
	cb.sendNotice(appInfo,roomHost,'',COLOR.INFO,'bold');

	var setupStr = "";
//	if (FLAG.price)
//		setupStr += "\n* Backup mode for 'CrazyTicket' is enabled.";
	if (FLAG.advance)
		setupStr += "\n* Advance ticket sales are enabled.";
	if (FLAG.email)
		setupStr += "\n* Email address recording is enabled.";
	if (setupStr)
		cb.sendNotice(dashLine+setupStr+"\n"+dashLine,roomHost,COLOR.HVBACK,COLOR.HVTEXT,'bold');

	cb.sendNotice(app.name+" Version "+app.version+" / "+app.buildtype+" build ("+app.builddate+") has started.",'','',COLOR.INFO,'bold');

	cb.sendNotice(dashLine+"\n* Broadcaster '" + roomHost + "' is running "+app.name+".\n\n* Type /ebhelp for a list of available commands.\n"+dashLine,'','',COLOR.NOTICE,'bold',MODS);
	
}


/***** Fire this beauty up. *****/
init();
