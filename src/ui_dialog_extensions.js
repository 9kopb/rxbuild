/* (c) Copyright 2009 Eric Doughty-Papassideris. All Rights Reserved.

	This file is part of RXBuild.

    RXBuild is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RXBuild is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RXBuild.  If not, see <http://www.gnu.org/licenses/>.
*/

/** @fileOverview This file defines YUI dialog extensions
	@requires utils.js
*/
if (!RXBuild) var RXBuild = {};
if (!RXBuild.UI) RXBuild.UI = {};
if (!RXBuild.UI.Dialogs)
	/**
		@namespace RXBuild.UI.Dialogs
		Holds various dialog utility functions.
	*/
	RXBuild.UI.Dialogs = { };

(function() {

	/** 
		Creates a new instance of TextAreaDialog
		@class The TextAreaDialog displays a YUI dialog with a text area as main content, and configurable verbs
		@property {String} divName The name of the div element that this item provided to YUI
		@property {YAHOO.widget.Dialog} dialog The YUI dialog - used internally.
		@property {YAHOO.widget.Button} _btnOk The YUI ok button - used internally.
		@property {YAHOO.widget.Button} _btnCancel The YUI close/cancel button - used internally.
		@property {HTMLTextArea} textBox The dynamically create text area - used internally.
		@constructor
		@param {String} divName The name of the div element that this item will provide to YUI
	*/
	RXBuild.UI.Dialogs.TextAreaDialog = function (divName) {
		this.divName = divName;
		this.dialog = new YAHOO.widget.Dialog(divName, 
			{
				width:"640px",
				visible:false,
				constraintoviewport:true,
				effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25},
				fixedcenter: true,
				hideaftersubmit: true,
				postmethod: "manual",
				modal: true,
				close: false,
				buttons:  [
					{
						text:"Ok",
						handler:
							{
								fn: function(e, btnId) { this._buttonPressed(btnId); },
								obj: "ok",
								scope: this
							},
						isDefault:true
					},
					{
						text:"Close",
						handler:
							{
								fn: function(e, btnId) { this._buttonPressed(btnId); },
								obj: "close",
								scope: this
							}
					} ]
			});
		this.textBox = document.createElement("TEXTAREA");
		this.textBox.setAttribute("rows", "20");
		this.textBox.setAttribute("cols", "80");
		this.textBox.setAttribute("wrap", "off");
		this.textBox.setAttribute("id", divName + "__BodyTextArea");
		this.textBox.setAttribute("name", divName + "__BodyTextArea");
		this.textBox.setAttribute("class", "screenWide lightBox");
		this.dialog.setBody(this.textBox);
		this.dialog.render(document.body);
		var oButtons = this.dialog.getButtons();
		this._btnOk = oButtons[0];
		this._btnCancel = oButtons[1];
		this._oPendingCallback = null;
	}
	RXBuild.UI.Dialogs.TextAreaDialog.prototype.constructor = RXBuild.UI.Dialogs.TextAreaDialog;
	RXBuild.UI.Dialogs.TextAreaDialog.prototype._buttonPressed = function(buttonId) {
		var oTemp = this._oPendingCallback;
		this._oPendingCallback = null;
		this.dialog.hide();
		if (buttonId == "ok" && oTemp) {
			oTemp(this.textBox.value);
		}
	};
	RXBuild.UI.Dialogs.TextAreaDialog.prototype.show = function(headerHTML, defaultText, verbs, callback, callbackContext) {
		if (this._oPendingCallback != null) throw "There is already a dialog expecting a response being shown."
		this.dialog.header.innerHTML = headerHTML;
		this.textBox.value = defaultText;
		if (callback && callbackContext)
			callback = createDelegate(callbackContext, callback);
		this._oPendingCallback = callback;
		if (callback)
			this.textBox.removeAttribute("readonly");
		else	
			this.textBox.setAttribute("readonly", "true");
		var sV1 = "Ok";
		var sV2 = callback ? "Cancel" : "Close";
		if (verbs && verbs.length == 0)
			verbs = null;
		if (verbs) {
			if (typeof(verbs) == "object" && verbs.length == 1)
				verbs = verbs[0];
			if (typeof(verbs) == "string")
				if (callback)
					sV1 = verbs;
				else
					sV2 = verbs;
			else {
				sV1 = verbs[0];
				sV2 = verbs[1];
			}
		}
		this._btnOk.set("label", sV1);
		this._btnCancel.set("label", sV2);
		this._btnOk.setStyle("display", callback ? "" : "none");
		this.dialog.show();
		this.textBox.focus();
		if (!callback)
			this.textBox.selectAll();
	};

})();

