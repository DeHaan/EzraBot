/*****************************************************************************************************
 *          Title: 	EzraBot (Version 2)
 *             By:	DeHaan
 *
 *         Author: 	"dehaan__"
 *		Originally based on acrazyguy's "KatieBot" and on version 1 of my bot "EzraBot".
 *			Thumbs-up for concept & inspiration: "Ezra".
 * 
 *  	  Version: 	2.0.3r2 (2015.06.13)
 *
 *			-- Revision 1 fixes a few bugs (mostly undeclared variables).
 *			-- Revision 2 fixes a bug with the version type conditionals.
 *****************************************************************************************************/

/***** Main "class" (which is just an object) *****/
var App = {
	
	// main variables
	name			:	"\"EzraBot\"",									// internal: script name
	type			: 	"bot",											// internal: script type (app or bot)
	version			: 	"2.0.3r2",										// internal: script version number
//	version_extra	: 	"",												// internal: script version extra info (e.g. alpha1, beta2, preview, rc3, staging)
	version_type	: 	"stable",										// internal: script version type (alpha, beta, preview, release candidate, or staging)
	revision		: 	"Revision 2",									// internal: script revision (comment if none)
	rc_version		: 	"",												// internal: script RC version (only for RC builds)
	builddate		: 	"June 13, 2015",								// internal: script build date
	dehaan			: 	"dehaan__",										// developer
	ezra			: 	"ezra",											// broadcaster

	// other variables
	Misc : {
		
		ticketsSold		: 	0,
		tipTot			: 	0,
		startTime		: 	new Date(),
		mods			: 	"red",
		only_mods		: 	"* This command is only available to moderators.",
		only_dev		: 	"* This command is only available to the developer.",
		warnMsg			: 	"* \"EzraBot\": Your message has broken room rules and has been removed from the chat.",
		roomHost		: 	cb.room_slug,
		dashLine		: 	"------------------------------------------------------------",	
	
	},
	
	// arrays (lists)
	List : {
		
		silList			: 	[],							// users who were silenced
		ticketList		: 	[],							// users who bought an advance ticket
		tippers : {										// tipper list (name & total amount tipped)
			name	: 	[],
			tips	: 	[]
		}
	},

	// colors - HTML color codes
	Color : {
		
		developer		: 	"#d9f7d9",					// Very light green; used as highlight (unused at the moment)	 	 	  	
		notice			: 	"#6900cc",					// Chat notice color - blue-purple		  		  	
		rotatingnotice	:	"#9f000f",					// Color used for rotating notices
		red 			: 	"#ff1407",
		mred			: 	"#d80a00",					
		highlight		: 	"#eee5ff",					// Ticket holder highlight color - pastel purple  	
		syntax 			: 	"#995b00",					// Usage notice color - brownish		  			
		amber			: 	"#e56b00",					// Amber					  						
		mod				: 	"#dc0000",					// Moderator red				  					
		hvtext 			: 	"#d80a00",					// Text color for hi-vis notices - red		  		
		hvback 			: 	"#ffffbf",					// Background color for hi-vis notices - yellow	 
		tbm_back		:	"#e0eeff",
		tbm_text		:	"#12447a",
		help 			: 	"#144d8c",					// Text color for help - blue gray		  			
		info 			: 	"#144d8c",					// Neutral notice - blue gray			  			
		mag				: 	"#e509e5",					// Magenta					  						
		blue			: 	"#000099",
		ppink			: 	"#ffe0ea",
		dhn_text		: 	"#00704e",					// Dark green; custom text color for me 	  		
		ez_hl			: 	"#ffddf4"					// Pink "lace"; special highlight for Ezra   	
		
	},
	
	// commands
	Command : {
		
		cn				: 	"cn", 						// Send general notice to the public.				 				
		cnh				: 	"cnh",						// Same as above, but with highlighting.			 				
		cnd				: 	"cnd",						// Same as /cn, but with divider lines.				 				
		cndh			: 	"cndh",						// Same as /cnd, but with highlighting.				 				
		bc				: 	"bc", 						// Send private notice to the broadcaster (mods only).		 		
		tm				: 	"tm", 						// Send private notice to the mods as a group.			 			
		tbm				: 	"tbm", 						// Send private notice to the mods and to the broadcaster.	 		
		tv				: 	"tv",						// Send private notice to a viewer.				 					
		ebhelp			: 	'ebhelp', 					// Send command list to mod/broadcaster.			 				
		tprice			: 	"tprice",					// Assign ticket price.						 						
		tlist 			: 	"tlist",					// Lists users who paid for a ticket.				 				
		sil				: 	"sil",						// Silence a certain user.					 						
		unsil			: 	"unsil",					// Unsilence a certain user.					 					
		slist			: 	"slist",					// Show the list of silenced users.									
		mon				: 	"mon",						// Enables monitoring for each mod.				 				 	
		about			: 	"about",					// Shows version info.
		lb				: 	"lb",						// Show top 3 tippers.
		tips			: 	"tips",						// Show full sorted tipper list.
		ebadd 			: 	"ebadd",					// Add one or more viewers to ticket list.
		ebdel 			: 	"ebdel"						// Delete a user from this same list.

	},
	
	// developer-only commands
	DevCommand : {
				 				
		cleanup 		: 'cleanup',					// Cleans up the chat; "hidden" command                         	
		dump	    	: 'dump',						// Debug: quick overview; only accessible by the developer
		ebhidden   		: 'ebhidden'   					// Shows "hidden" commands which work if invoked by the dev only 	
		
	},
	
	// flags
	Flag : {
		
		advance	: false,
		price	: false
		
	},
	
	main : function() {
		
		var appInfo = this.Misc.dashLine + "\n* " + this.name + " by \"" + this.dehaan + "\" has started.";
		if (this.revision !== undefined) {
			appInfo += "\n* Version: " + this.version + " (" + this.revision + ")";
		} else if (this.version_type === ("rc" || "release_candidate")) {
			appInfo += "\n* Version: " + this.version + "-" + this.version_extra + " (" + this.rc_version + ")";
		} else if (this.version_type === "alpha" || this.version_type === "beta"
				|| this.version_type === "preview" || this.version_type === "staging" ) {
			appInfo += "\n* Version: " + this.version + "-" + this.version_extra;
		} else {
			appInfo += "\n* Version: " + this.version;
		}
		appInfo += "\n* Build date: " + this.builddate;
		appInfo += "\n* Type /" + this.Command.ebhelp + " for a list of available commands.\n" + this.Misc.dashLine;
		
		cb.sendNotice(appInfo, this.Misc.roomHost, "", this.Color.info, "bold");
		// don't declare variables for these warnings
		if (this.version_type === "preview") {
			cb.sendNotice(this.Misc.dashLine + "\n* WARNING: This is only a preview of what the next version of EzraBot will look like." +
							"\n* Most major functions are broken or not yet implemented. Proceed with care.\n" + this.Misc.dashLine,
							this.Misc.roomHost, this.Color.ez_hl, this.Color.mred, "bold");
		} else if (this.version_type === "staging") {
			cb.sendNotice(this.Misc.dashLine + "\n* WARNING: You're currently using a \"staging\" version of EzraBot." +
							"\n* Some functions may be partially or completely broken. Proceed with care.\n" + this.Misc.dashLine,
							this.Misc.roomHost, this.Color.ez_hl, this.Color.mred, "bold");
		} else if (this.version_type === "alpha") {
			cb.sendNotice(this.Misc.dashLine + "\n* WARNING: You're currently using an \"alpha\" version of EzraBot." +
							"\n* Some functions may be partially or completely broken. Proceed with care.\n" + this.Misc.dashLine,
							this.Misc.roomHost, this.Color.ez_hl, this.Color.mred, "bold");
		} else if (this.version_type === "beta") {
			cb.sendNotice(this.Misc.dashLine + "\n* Note: You're currently using a \"beta\" version of EzraBot." +
							"\n* Some functions may be partially broken. Proceed with care.\n" + this.Misc.dashLine,
							this.Misc.roomHost, this.Color.hvback, this.Color.hvtext, "bold");
		} else if (this.version_type === ("rc" || "release_candidate")) {
			cb.sendNotice(this.Misc.dashLine + "\n* Note: You're currently using a \"Release Candidate\" version of EzraBot." +
							"\n* Some minor bugs may be present and will be fixed in the final version.\n" + this.Misc.dashLine,
							this.Misc.roomHost, this.Color.hvback, this.Color.hvtext, "bold");
		}
		
		var setupStr = "";
		if (this.Flag.advance === true) {
			setupStr = "\n* Advance ticket sales are enabled.";
			cb.sendNotice(this.Misc.dashLine + setupStr + "\n" + this.Misc.dashLine, this.Misc.roomHost, this.Color.hvback, this.Color.hvtext, "bold");
		}
			
		if (this.revision !== undefined) {
			cb.sendNotice(this.name + " Version " + this.version + " (" + this.revision + ") (" + this.builddate + ") has started.", "", "", this.Color.info, "bold");
		} else if (this.version_type === ("rc" || "release_candidate")) {
			cb.sendNotice(this.name + " Version " + this.version + "-" + this.version_extra + " (" + this.rc_version + ") (" + this.builddate + ") has started.", "", "", this.Color.info, "bold");
		} else if (this.version_type === "alpha" || this.version_type === "beta"
				|| this.version_type === "preview" || this.version_type === "staging" ) {
			cb.sendNotice(this.name + " Version " + this.version + "-" + this.version_extra + " (" + this.builddate + ") has started.", "", "", this.Color.info, "bold");
		} else {
			cb.sendNotice(this.name + " Version " + this.version + " (" + this.builddate + ") has started.", "", "", this.Color.info, "bold");
		}
	
		cb.sendNotice(this.Misc.dashLine + "\n* Broadcaster \"" + this.Misc.roomHost + "\" is running " + this.name + ".\n" + 
						"\n* Type /" + this.Command.ebhelp + " for a list of available commands.\n" + this.Misc.dashLine, 
						"", "", this.Color.notice, "bold", this.Misc.mods);
	}

};

// Rotating notifier counter
var j = 1;

/***** String.prototype & Number.prototype functions *****/
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalizeAll = function() {
	return this.toUpperCase();
}

Number.prototype.getOrdinal = function() {
	
	switch (this % 100) {
		case 11:
		case 12:
		case 13:
			return this + "th";
	}
	
	switch (this % 10) {
		case 1:	
			return this + "st";
		case 2:
			return this + "nd";
		case 3:
			return this + "rd";
	}
	
	return this + "th";
}

/***** Chaturbate API functions *****/
cb.settings_choices = [
{	name: "advance_header",
	type: "choice",
		choice1: "",
		choice2: "",
	label: "============== Advance Tickets Settings ==============",
	required: false
},
{
	name: "advance",
	type: "choice",
		choice1: "Yes",
		choice2: "No",
	defaultValue: "No",
	label: "Use " + App.name + " to sell advance tickets for a future \"CrazyTicket\" show?"
},
{
	name: "buyin",
	type: "int",
	label: "Enter ticket price ONLY if used for advance ticket sales OR \"CrazyTicket\" backup.",
	required: false
},
{	
	name: "automod_header",
	type: "choice",
		choice1: "",
		choice2: "",
	label: "========= Auto-Moderator (CrazyMod) Settings =========",
	required: false
},
{
	name: "mutefeet",
	type: "choice",
		choice1: "Yes",
		choice2: "No",
	defaultValue: "Yes",
	label: "Mute \"feet\" messages?"
},
{
	name: "warnviewer",
	type: "choice",
		choice1: "Yes",
		choice2: "No",
	defaultValue: "Yes",
	label: "Send a warning message to offending gray users?"
},
{	
	name: "notifier_header",
	type: "choice",
		choice1: "",
		choice2: "",
	label: "============= Rotating Notifier Settings =============",
	required: false
},
{
	name: "message1",
	type: "str",
	label: "Message 1",
	required : false
}, 
{
	name: "message2",
	type: "str",
	label: "Message 2",
	required : false
}, 
{
	name: "message3",
	type: "str",
	label: "Message 3",
	required : false
},
{
	name: "message4",
	type: "str",
	label: "Message 4",
	required : false
},
{
	name: "message5",
	type: "str",
	label: "Message 5",
	required : false
},
{
	name: "message6",
	type: "str",
	label: "Message 6",
	required : false
},
{
	name: "message7",
	type: "str",
	label: "Message 7",
	required : false
},
{
	name: "msg1onentry",
	type: "choice",
		choice1: "Yes",
		choice2: "No",
	defaultValue: "Yes",
	label: "Display Message 1 privately on entry? (Turn this off for busy rooms.)"
},
{
	name: "messagecolor",
	type: "str",
	label: "Message color for rotating notices (default is dark red, HTML color code #9F000F).",
	defaultValue: "#9f000f"
},
{
	name: "messagetimeout",
	type: "int",
	label: "Delay between notices being displayed. (Minimum is 1 minute)",
	minValue: 1,
	maxValue: 999,
	defaultValue: 2
}
];

cb.onEnter(function (viewer) {
	
	var user = viewer.user;
	
	if (App.version_type === ("alpha" || "beta" || "preview" || ("rc" || "release_candidate") || "staging")) {
		EzraBot.preReleaseFotD(user);
	} else if (cb.settings.msg1onentry === 'Yes'){
		cb.sendNotice("* Welcome, \"" + user + "\"! \n * " + cb.settings.message1, user, "", App.Color.rotatingnotice, "bold");
	}
	
	// Add this user to silenced users list 
	if (user === "rscdj"){
		App.List.silList.push(user);
	}
	
});

cb.onTip(function (tip) {
	
	var viewer		= tip.from_user;
	var tMsg		= tip.message;
	var tipAmount 	= parseInt(tip.amount, 10);
	var address		= "";
	var idx			= 0;

	if (!cbjs.arrayContains(App.List.tippers.name, viewer)) {
		App.List.tippers.name.push(viewer);
		App.List.tippers.tips.push(tipAmount);
	} else {
		idx = App.List.tippers.name.indexOf(viewer);
		App.List.tippers.tips[idx] += tipAmount;		
	}
	
	App.Misc.tipTot += tipAmount;

	if ((tipAmount >= ticketPrice) && App.Flag.price === true) {
		if (!cbjs.arrayContains(App.List.ticketList, viewer)) {
			EzraBot.user("add", viewer, false);
			if (App.Flag.advance === true) {
				cb.sendNotice(App.Misc.dashLine + "\n* Advance ticket sold to \"" + viewer + "\"\n" + App.Misc.dashLine, "" , "", App.Color.notice, "bold");
			}
		}
	}
	
});

cb.onMessage(function (msg) {
	
	var regexCommandSplit	= '^' + '/' + '(\\S+)(?:\\b\\s*)(.*)?';
	var regexListSplit		= /[,\s]+/;
	var reCmdSplit = new RegExp(regexCommandSplit);
	var cmdSplit = msg["m"].match(reCmdSplit);
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
	var m 			= msg.m;
	var u 			= msg.user;
	var isMod		= msg.is_mod;
	var isRoomHost	= (u === App.Misc.roomHost);
	var isDHN		= (u === App.dehaan);
	var isEzra		= (u === App.ezra);
	var viewer, message;

	if (/^(\?|!)/.test(m)) {
		msg["X-Spam"] = true;
		return cb.sendNotice("* " + App.name + ": Incorrect command prefix.", u, "", App.Color.mod, "bold");
	}

	if (cbjs.arrayContains(App.List.silList, u) && !isMod) {
		msg["X-Spam"] = true;
		return;
	}
	
	// Mute a certain user that posts GIFs with graphic content in rooms
	if (u === "rscdj") {
		msg["X-Spam"] = true;
		return new function() {
			cb.sendNotice("* User \"rscdj\" was automatically silenced.", "", "", App.Color.mod, "bold", App.Misc.mods);
			cb.sendNotice("* User \"rscdj\" was automatically silenced.", App.Misc.roomHost, "", App.Color.mod, "bold");
		};
	}

	/********** Command processing switch. **********/
	switch (cmd) {
	
		// Public notice start
			// General
		case App.Command.cn:
			if (isMod || isRoomHost || (isDHN && App.Flag.dev === true)) {
				if (cmdval) {
					cb.sendNotice("* " + cmdval.capitalize(), "", "", App.Color.notice, "bold");
				} else {
					cb.sendNotice("* Syntax: /cn <message>", u, '', App.Color.syntax, "bold");
				}
			} else {
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			}
		break;

			// Hi-lighting
		case App.Command.cnh:
			if (isMod || isRoomHost || (isDHN && App.Flag.dev === true)) {
				if (cmdval) {
					cb.sendNotice("* " + cmdval.capitalize(), "", App.Color.highlight, App.Color.notice, "bold");
				} else {
					cb.sendNotice("* Syntax: /cnh <message>", u, '', App.Color.syntax, "bold");
				}
			} else {
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			}
		break;

			// Dividers
		case App.Command.cnd:
			if (isMod || isRoomHost || (isDHN && App.Flag.dev === true)) {
				if (cmdval) {
					cb.sendNotice(App.Misc.dashLine + "\n* " + cmdval.capitalize() + "\n" + App.Misc.dashLine, "", "", App.Color.notice, "bold");
				} else {
					cb.sendNotice("* Syntax: /cnd <message>", u, "", App.Color.syntax, "bold");
				}
			} else {
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			}
		break;

			// Dividers & hi-lighting
		case App.Command.cndh:
			if (isMod || isRoomHost || (isDHN && App.Flag.dev === true)) {
				if (cmdval) {
					cb.sendNotice(App.Misc.dashLine + "\n* " + cmdval.capitalize() + "\n" + App.Misc.dashLine, "", App.Color.highlight, App.Color.notice, "bold");
				} else {
					cb.sendNotice("* Syntax: /cndh <message>", u, "", App.Color.syntax, "bold");
				}
			} else {
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			}
		break; 
		// End public notice

		// Private message to broadcaster
		case App.Command.bc:
			if (isMod || (isDHN && App.Flag.dev === true)) {
				if (cmdval) {
					cb.sendNotice("* " + (isMod ? "\"" + u + "\": " : "--- EzraBot App Support --- *\n* ") + cmdval, App.Misc.roomHost, App.Color.hvback, App.Color.hvtext, "bold");
					cb.sendNotice("* " + (isMod ? "\"" + u + "\": " : "--- EzraBot App Support --- *\n* ") + cmdval, u, App.Color.hvback, App.Color.hvtext, "bold");
				} else {
					cb.sendNotice("* Syntax: /bc <message>", u, "", App.Color.syntax, "bold");
				}
			} else { 
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			}
		break;

		// Message to moderators
		case App.Command.tm:
			if (isMod || isRoomHost) {
				if (cmdval) {
					cb.sendNotice("* \"" + u + "\": " + cmdval, "", App.Color.hvback, App.Color.hvtext, "bold", App.Misc.mods);
				} else {
					cb.sendNotice("* Syntax: /tm <message>", u, "", App.Color.syntax, "bold");
				}
			} else { 
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			} 
		break;
		
		// Message to moderators & broadcaster -- ported from new CrazyNote build
		case App.Command.tbm:
			if (isMod || isRoomHost) {
				if (cmdval) {
					cb.sendNotice("* \"" + u + "\": " + cmdval, "", App.Color.tbm_back, App.Color.tbm_text, "bold", App.Misc.mods);
					cb.sendNotice("* \"" + u + "\": " + cmdval, App.Misc.roomHost, App.Color.tbm_back, App.Color.tbm_text, "bold");
				} else {
					cb.sendNotice("* Syntax: /tbm <message>", u, "", App.Color.syntax, "bold");
				}
			} else { 
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			} 
		break;

		// Message to viewer
		case App.Command.tv:
			if (isMod || isRoomHost || (isDHN && App.Flag.dev === true)) {
				viewer = cmdValArray[0];
				cbjs.arrayRemove(cmdValArray, cmdValArray[0]);
				message = cbjs.arrayJoin(cmdValArray, " ");
				if (cmdval) {
					cb.sendNotice("*EzraBot* " + message, viewer, "", App.Color.red, "bold");
				} else {
					cb.sendNotice("* Syntax: /tv viewername message", u, "", App.Color.syntax, "bold");
				}
			} else {
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			}
		break;

		// Ticket price
		case App.Command.tprice:
			if (isMod || isRoomHost || (isDHN && App.Flag.dev === true)) {
				if (cmdval) {
					if (parseInt(cmdval, 10)) {
						ticketPrice = cmdval;
						cb.sendNotice("* Ticket price set at " + cmdval + " tokens.", u, "", App.Color.notice, "bold");
						App.Flag.price = true;
					} else {
						cb.sendNotice("* \"" + cmdval + "\" is not a valid argument.", u, "", App.Color.notice,"bold");
					}
				} else {
					cb.sendNotice("* Syntax: " + '/' + App.Command.tprice + " <price>", u, "", App.Color.syntax, "bold");
				}
			} else {
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
			}
		break;

		// Help 
		case App.Command.ebhelp:
			if (isMod || isRoomHost)
				EzraBot.showCommandList(u);
			else 
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
		break;

		// Show ticket list
		case App.Command.tlist:
			cb.sendNotice(App.Misc.dashLine + "\nTicket holders: " + App.List.ticketList.length + "\n" + App.Misc.dashLine + "\n" + (App.List.ticketList.length < 1 == true ? "No tickets sold!" : cbjs.arrayJoin(App.List.ticketList, ", ")) + "\n" + App.Misc.dashLine, u, "", App.Color.notice, "bold");
		break;

		// Silence a user
		case App.Command.sil:
			if (isMod || isRoomHost) {
				if (cmdval) {
					if (!cbjs.arrayContains(App.List.silList, cmdval)) {
						App.List.silList.push(cmdval);
					}
				}
			}
		break;

		// Unsilence a user
		case App.Command.unsil:
			if (isMod || isRoomHost) {
				if (cmdval) {
					cbjs.arrayRemove(App.List.silList, cmdval);
				}
			}
		break;

		// Silenced users list
		case App.Command.slist:
			if (isMod || isRoomHost || (isDHN && App.Flag.dev === true))
				cb.sendNotice(App.Misc.dashLine + "\n* " + app.name + " Silenced: " + App.List.silList.length + "\n" + App.Misc.dashLine + "\n" + (App.List.silList.length < 1 == true ? "* Empty." : cbjs.arrayJoin(App.List.silList, ", ")) + "\n" + App.Misc.dashLine, u, "", App.Color.notice, "bold");
		break;

		// Toggle monitoring of muted messages
		case App.Command.mon:
			if (isMod || isRoomHost || isDHN) {
				if (!cbjs.arrayContains(CrazyMod.monList, u)) {
					CrazyMod.monList.push(u);
				} else {
					cbjs.arrayRemove(CrazyMod.monList, u);
				} 
				cb.sendNotice("* Monitoring of muted messages is now " + (cbjs.arrayContains(CrazyMod.monList, u) ? "ON." : "OFF."), u, "", App.Color.info, "bold");
			}
		break;

		//  Show version info
		case App.Command.about:
			if (isMod || isRoomHost)
				EzraBot.showVersionInfo(u);
			else 
				cb.sendNotice(App.Misc.only_mods, u, "", App.Color.notice, "bold");
		break;
		
		// Show top 3 tippers
		case App.Command.lb:
			if (isRoomHost || isDHN) {
				EzraBot.sortTippers();
				var outStr = "";
				for (i = 0; i < 3; i++)
					outStr += i + 1 + ") " + App.List.tippers.name[i] + ": " + App.List.tippers.tips[i] + "\n";
				cb.sendNotice(App.Misc.dashLine + "\n* Top 3 Tippers this session\n" + App.Misc.dashLine + "\n" + outStr + App.Misc.dashLine, u, "", App.Color.notice, "bold");
			}			
		break;

		// Show entire list of tippers
		case App.Command.tips:
			if (isRoomHost || isDHN) {
				EzraBot.sortTippers();
				var outStr = "";
				for (i = 0; i < App.List.tippers.name.length; i++)
					outStr += i + 1 + ") " + App.List.tippers.name[i] + ": " + App.List.tippers.tips[i] + "\n";
				cb.sendNotice(App.Misc.dashLine + "\n* Tippers this session: " + App.List.tippers.name.length + "\n" + App.Misc.dashLine + "\n" + outStr + App.Misc.dashLine, u, "", App.Color.notice, "bold");
			}			
		break;
		
		// Add user to ticket list
		case App.Command.ebadd:
			if (isMod || isRoomHost) {
				if (cmdval) {
					if (cmdValArray.length > 1) {
						for (var i = 0; i < cmdValArray.length; i++) {
							if (!EzraBot.user("check", cmdValArray[i])) {
								EzraBot.user("add", cmdValArray[i], false);
							}
						} // end for
					} else {
						EzraBot.user("add", cmdval, false);
					} // end if cmdValArray.length
				} else { 
					if (!EzraBot.user("check", msg["user"])) {
						EzraBot.user("add", msg["user"], false);
					}
				} // end if cmdval
			}
		break;
		
		// Remove user from ticket list
		case App.Command.ebdel:
			if (isMod || isRoomHost) {
				if (cmdval)
					EzraBot.user("del", cmdval);
			}
		break;
		
		/****** Dev-only commands ******/
		case App.DevCommand.ebhidden:
			if (isDHN)
				EzraBot.showHiddenCommands(u);
			else
				cb.sendNotice(App.Misc.only_dev, u, "", App.Color.notice, "bold");
		break;
		
		case App.DevCommand.cleanup:
			if (isDHN)
				EzraBot.cleanUpChat();
			else
				cb.sendNotice(App.Misc.only_dev, u, "", App.Color.notice, "bold");
		break;
		
		// Move dump command to this switch. Internal command for debugging purposes
		case App.DevCommand.dump:
			if (isDHN) {
				if (cmdval === "dev") {
					if (!cbjs.arrayContains(EzraBot.List.devList, u)) {
						EzraBot.List.devList.push(u);
						EzraBot.Flag.dev = true;
					} else {
						cbjs.arrayRemove(EzraBot.List.devList, u);
						EzraBot.Flag.dev = false;
					}
				} else {
					EzraBot.dump(u);
				}
			} else {
				cb.sendNotice(App.Misc.only_dev, u, "", App.Color.red, "bold");
			}
		break;
		/****** End dev-only commands ******/
		
	} // end switch (cmd)
	
	if (cbjs.arrayContains(EzraBot.List.devList, u)) {
		if (isDHN) {
			msg.c = App.Color.dhn_text;
		} 
	}
	
	// Highlight for Ezra
	if (isEzra) { 
		msg.background = App.Color.ez_hl;
	}
	
	// Suppress all command echoing in chat.
	if (m[0] === "/") {
		msg["X-Spam"] = true; 
	}
	
	// Check message before returning
	CrazyMod.checkMessage(msg);	
	
	return msg;
	
}); // end cb.onMessage()

/***** Other functions & "classes" *****/
// EzraBot-only functions 
var EzraBot = {
	
	cleanUpChat : function() {
	
		var chatcleanup = "* Cleaning up chat...";
		for (var i = 1; i <= 30; i++) {
			cb.sendNotice(chatcleanup, "", "", App.Color.notice, "bold");
		}
		
		return cb.sendNotice("* Chat cleaned up.", "", "", App.Color.notice, "bold");
	},
	
	dump : function(user) {
		var date = new Date();
		
		var dump_info = App.Misc.dashLine + "\n* Dev dump";
		dump_info += "\n\n* App info:";
		dump_info += "\n* Name: " + App.name + " / Type: " + App.type + " / Version number: " + App.version 
					+ " / Version type: " + App.version_type;
		dump_info += "\n* Time started: " + App.Misc.startTime + "\n* Time now: " + date;
		dump_info += "\n* Total tipped: " + App.Misc.tipTot;
		dump_info += "\n* Flags: (EzraBot.Flag.dev: " + this.Flag.dev + ")"
					+ "\n" + App.Misc.dashLine;
		
		return cb.sendNotice(dump_info, user, "", App.Color.info, "bold");
	},
	
	Flag : {
		dev	: false
	},
	
	List : {
		devList : [] // developer list
	},
	
	preReleaseFotD : function(user) {
	
		var prfotd = App.Misc.dashLine + "..." + App.Misc.dashLine;
	
		if (App.version_type === "preview") {
			prfotd = App.Misc.dashLine + "\n* \"EzraBot\": WARNING: The version of EzraBot which is running at the moment is only a preview of the next version.";
			prfotd += "\n* Some functions may be partially or completely broken, or not yet implemented.\n" + App.Misc.dashLine;
		} else if (App.version_type === "staging") {
			prfotd = App.Misc.dashLine + "\n* \"EzraBot\": WARNING: The version of EzraBot which is running at the moment is a \"staging\" version.";
			prfotd += "\n* Some functions may be partially or completely broken.\n" + App.Misc.dashLine;
		} else if (App.version_type === "alpha") {
			prfotd = App.Misc.dashLine + "\n* \"EzraBot\": WARNING: The version of EzraBot which is running at the moment is an \"alpha\" version.";
			prfotd += "\n* Some functions may be partially or completely broken.\n" + App.Misc.dashLine;
		} else if (App.version_type === "beta")  {
			prfotd = App.Misc.dashLine + "\n* \"EzraBot\": Note: The version of EzraBot which is running at the moment is a \"beta\" version.";
			prfotd += "\n* Some functions may be partially broken.\n" + App.Misc.dashLine;
		} else if (App.version_type === "rc" || App.version_type === "release_candidate") {
			prfotd = App.Misc.dashLine + "\n* \"EzraBot\": Note: The version of EzraBot which is running at the moment is a \"Release Candidate\" version.";
			prfotd += "\n* Some minor bugs may be present and will be fixed in the final version.\n" + App.Misc.dashLine;
		}
	
		return cb.sendNotice(prfotd, user, App.Color.ez_hl, App.Color.mred, "bold");
	},
	
	showCommandList : function(user) {
			
		var cmdlist = App.Misc.dashLine + "\n * ----- EZRABOT COMMANDS LIST ----- * \n";
		cmdlist += "/" + App.Command.cn + " <message> - Sends a one time public notice.\n\n";
		cmdlist += "/" + App.Command.cnd + " <message> - Sends a one time public notice with divider lines.\n";
		cmdlist += "/" + App.Command.cnh + " <message> - Sends a one time public notice with highlighting.\n";
		cmdlist += "/" + App.Command.cndh + " <message> - Sends a one time public notice with divider lines and highlighting.\n";
		cmdlist += "/" + App.Command.bc + " <message> - Sends a private message to the broadcaster.\n";
		cmdlist += "/" + App.Command.tm + " <message> - Sends a private message to the moderators as a group.\n";
		cmdlist += "/" + App.Command.tbm + " <message> - Sends a private message to the moderators and to the broadcaster.\n";
		cmdlist += "/" + App.Command.tv + " <viewer> <message> - Sends a private message to a viewer.\n";
		cmdlist += "/" + App.Command.tprice + " <price> - Tells EzraBot the ticket price for advance ticket sales or for CrazyTicket backup.\n";
		cmdlist += "/" + App.Command.tlist + " - Sends a list of ticket holders to the chat.\n";
		cmdlist += "/" + App.Command.mon + " - Toggles monitoring of gray message muting.\n";
		cmdlist += "/" + App.Command.ebhelp + " - Shows this command list.\n";
		cmdlist += "/" + App.Command.about + " - Shows EzraBot's version info.\n" + App.Misc.dashLine;
	
		return cb.sendNotice(cmdlist, user, "", App.Color.info, "bold");
	},
	
	showHiddenCommands : function(user) {
		
		var hiddencmdlist = App.Misc.dashLine + "\n * ----- EZRABOT DEV-ONLY COMMANDS LIST ----- * \n";
		hiddencmdlist += "/" + App.DevCommand.cleanup + " - \"Cleans up\" the chat.\n";
		hiddencmdlist += "/" + App.DevCommand.dump + " - Quick overview for debugging.\n" + App.Misc.dashLine;	
	
		return cb.sendNotice(hiddencmdlist, user, "", App.Color.info, "bold");
	},
	
	showVersionInfo : function(user) {

		var version_info = App.Misc.dashLine + "\n * ----- VERSION INFO ----- *";
		version_info += "\n* App name: " + App.name;
		version_info += "\n* Author: " + App.dehaan;
		if (App.revision !== undefined) {
			version_info += "\n* Version: " + App.version + " (" + App.revision + ") - Date: " + App.builddate;
		} else if (App.version_type === "alpha" || App.version_type === "beta" || App.version_type === "preview" ||
				 || App.version_type === "rc" || App.version_type === "release_candidate" || App.version_type === "staging" )
			version_info += "\n* Version: " + App.version + "-" + App.version_extra + " - Date: " + App.builddate;
		} else {
			version_info += "\n* Version: " + App.version + " - Date: " + App.builddate;
		}
		version_info += "\n* Originally based on acrazyguy's \"KatieBot\" and his other apps/bots.\n" + App.Misc.dashLine;
	
		return cb.sendNotice(version_info, user, "", App.Color.info, "bold");
	},
	
	sortTippers : function() {
	
		var swapped, temp1, temp2;
		do {
		swapped = false;
			for (var i = 0; i < App.List.tippers.tips.length - 1; i++) {
				if (App.List.tippers.tips[i] < App.List.tippers.tips[i + 1]) {
			
					temp1 = App.List.tippers.tips[i];
					temp2 = App.List.tippers.name[i];
					
					App.List.tippers.tips[i] = App.List.tippers.tips[i + 1];
					App.List.tippers.tips[i + 1] = temp1;
				
					App.List.tippers.name[i] = App.List.tippers.name[i + 1];
					App.List.tippers.name[i + 1] = temp2;
				
					swapped = true;
				}
			}
		} while (swapped);
	},

	user : function(command, user, sendpass) {
		if ((command == "add") && (!cbjs.arrayContains(App.List.ticketList, user)))
			App.List.ticketList.push(user);

		if ((command == "del") && (cbjs.arrayContains(App.List.ticketList, user)))
			cbjs.arrayRemove(App.List.ticketList,user);
	} // end function user
};

// Auto-moderator (CrazyMod)
var CrazyMod = {
	
	monList: [],

	checkMessage : function (msg) {
		var u = msg.user;
		var tmpmsg = msg.m;
		var hasTokens = msg.has_tokens;
		var isBroadcaster = (u === cb.room_slug);
		var isFCMember = msg.in_fanclub;
		var isMod = msg.is_mod;

		var re = /(?=.*\b(rape|fuck|flash|finger|eat|get|show|play|zoom|flash|open|see|touch|suck|rub|eat|lick|spread|smell)\b)(?=.*\b(body|ass|anal|asshole|pussy|cunt|clit|cock|boobs?|bobs?|tits?|armpits?|vagina|nipples?|breasts?|bust|naked|nude|shit|out|me|dog|self)\b)/i;

		var re2 = /\b(pm|c2c|private|pv|pvt|prvt)\b/i;

		var re3 = /((?=.*bitch)|(?=.*slut)|(?=.*whore)|(?=.*cunt)|(?=.*cock)|(?=.*ugly)|(?=.*fat)|(?=.*pee)|(?=.*piss)|(?=.*poo)|(?=.*peeing)|(?=.*fist)|(?=.*faggot)|(?=.*fuck))/i;

		var re4 = /((?=.*ass)|(?=.*pussy)|(?=.*boobs?)|(?=.*bobs?)|(?=.*tits?)|(?=.*vagina)|(?=.*cunt)|(?=.*cock)|(?=.*nipples?)|(?=.*breasts?)|(?=.*anal))((?=.*plz)|(?=.*pls)|(?=.*please))/i;

		var re5 = /((^ass.?.?$)|(^boobs?.?.?$)|(^pussy.?.?$)|(^doggy.?.?$)|(^anal.?.?$)|(^zoom.?.?$)|(^show.?.?$)|(^tits?.?.?$)|(?=.*stand up.?.?)|(?=.*watch my cam.?.?))/i;

		var mutemsg = false;
		var temp;

		if (!(hasTokens || isBroadcaster || isFCMember || isMod)) {
			if (re.test(tmpmsg) || re4.test(tmpmsg)) {
				mutemsg = true;
				temp = 1;
			} if (re5.test(tmpmsg)) {
				mutemsg = true;
				temp = 2;
			} if (re2.test(tmpmsg)) {
				mutemsg = true;
				temp = 3;
			} if (/((?=.*18fcam)|(?=.*streamingnaked)|(?=.*premiumcheat)|(?=.*amecam)|(?=.*18female)|(?=.*erotimo)|(?=.*freesecurecams)|(?=.*xhot)|(?=.*shot)|(?=.*srkype)|(?=.*skrype)|(?=.*ellagocam))/i.test(tmpmsg)) {
				mutemsg = true;
				temp = 4;
			} if (re3.test(tmpmsg)) {
				mutemsg = true;
				temp = 5;
			} if (/\b(bb|bby|babe|baby|bae|daddy|daughter)\b/i.test(tmpmsg)) {
				mutemsg = true;
				temp = 6;
			} if (cb.settings.mutefeet === 'Yes') {
				if (/\b(feet|foot|soles|toes)\b/i.test(tmpmsg)) {
					mutemsg = true;
					temp = 7;
				}
			} if (/:\w+[^D|P]/i.test(tmpmsg)) {
				mutemsg = true;
				temp = 8;
			} if (/(([:]*)[^\s]*([^\s])\3{3,})/ig.test(tmpmsg)) {
				mutemsg = true;
				temp = 9;
			} if (tmpmsg === tmpmsg.capitalizeAll() && tmpmsg !== "XD") {
				mutemsg = true;
				temp = 10;
			} if (/[^\x00-\x7F]+/.test(tmpmsg)) {
				mutemsg = true;
				temp = 11;
			} if (mutemsg === true) {
				msg["X-Spam"] = true;
				if (cb.settings.warnviewer === "Yes") {
				cb.sendNotice(App.Misc.warnMsg, u, "", App.Color.info, "bold");
				} if (this.monList.length > 0) {
					for (var i = 0; i < this.monList.length; i++) {
						cb.sendNotice(temp + " - *CrazyMod* " + u + ": " + tmpmsg, this.monList[i], "", App.Color.info, "bold");
					}
				}
			}
		}
	}
};

// Rotating notifier
var RotatingNotifier = {
	
	rotateNotices : function() {
		
		var msg;
	
		while (cb.settings["message" + j] == 0) { // skip empty messages
		j++;
			if (j > 7) { // loop back to the first message
				j = 1;
			}
		}
	
		msg = cb.settings["message" + j];
		j++;
		if (j > 7) { // loop back to the first message
			j = 1;
		}
	
		cb.sendNotice("* " + msg, "", "", cb.settings.messagecolor, "bold");
		cb.log("The " + (j-1).getOrdinal() + " message has been sent.");
		cb.setTimeout(this.rotateNotices, (cb.settings.messagetimeout * 60000));
		
	}
};

cb.setTimeout(RotatingNotifier.rotateNotices, (cb.settings.messagetimeout * 60000));

var ticketPrice	= parseInt(cb.settings.buyin, 10);
if (cb.settings.advance === "Yes") {
	App.Flag.advance = true;
} if (cb.settings.buyin) {
	App.Flag.price = true;
}

try {
	App.main();
} catch (err) {
	cb.sendNotice("* An error has occurred.", "", "", App.Color.red, "bold");
	cb.sendNotice("\n" + err.message, "", "", App.Color.red, "");
}
