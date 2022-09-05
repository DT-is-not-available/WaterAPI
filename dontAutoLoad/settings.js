extend("gui_MoreSettingsWindow.create", ()=>{
	waterButton = new gui_TextButton(gui,stage,thisWindow,Water.$.waterSettings,"Waterworks Settings");
	thisWindow.addChild(waterButton);
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,4)));
}, "	var slider1 = new gui_Slider(gui,stage,thisWindow,function() {")

extend("gui_MoreSettingsWindow.create", ()=>{
	waterButton.fillWidth()
}, "if(languageButton != null) {")

let waterDefaults = {
	betterModsMenu: true,
	restartOnReload: true,
}

Water.$.waterSettings = function() {
	settings = localStorage.getItem("WaterSettings") ? JSON.parse(localStorage.getItem("WaterSettings")) : waterDefaults
	Water.gui.createWindow("Waterworks Settings", [
		"[red]Most settings will not take effect until the next restart.",
		"You can restart now by clicking 'Apply' to save settings and reload the game.\n",
		"Special settings for Waterworks's UI and behavior",
		{
			type: "checkbox",
			text: "Better mods menu",
			onClick: ()=>{
				settings.betterModsMenu = !settings.betterModsMenu
				localStorage.setItem("WaterSettings", JSON.stringify(settings))
			},
			isChecked: ()=>settings.betterModsMenu,
		},
		{
			type: "checkbox",
			text: "Completely restart on reload",
			onClick: ()=>{
				settings.restartOnReload = !settings.restartOnReload
				localStorage.setItem("WaterSettings", JSON.stringify(settings))
			},
			isChecked: ()=>settings.restartOnReload,
		},
		{
			type: "checkbox",
			text: "Show errors in popups",
			onClick: ()=>{
				settings.showErrors = !settings.showErrors
				localStorage.setItem("WaterSettings", JSON.stringify(settings))
			},
			isChecked: ()=>settings.showErrors,
		},
		"Settings for Waterworks API experiments",
		{
			type: "checkbox",
			text: "Experimental Scopes API",
			onClick: ()=>{
				settings.experimentalAPI_scope = !settings.experimentalAPI_scope
				localStorage.setItem("WaterSettings", JSON.stringify(settings))
			},
			isChecked: ()=>settings.experimentalAPI_scope,
		},
		{
			type: "checkbox",
			text: "Experimental GUI functions",
			onClick: ()=>{
				settings.experimentalAPI_gui = !settings.experimentalAPI_gui
				localStorage.setItem("WaterSettings", JSON.stringify(settings))
			},
			isChecked: ()=>settings.experimentalAPI_gui,
		},
		{
			type: "checkbox",
			text: "Experimental Timeline API",
			onClick: ()=>{
				settings.experimentalAPI_timeline = !settings.experimentalAPI_timeline
				localStorage.setItem("WaterSettings", JSON.stringify(settings))
			},
			isChecked: ()=>settings.experimentalAPI_timeline,
		}
	], [
		{
			text: "Reset",
			action: ()=>{
				Water.gui.createWindow("Reset Defaults", "[red]Are you sure you want to reset all settings to their default values?", [
					{
						text: "Yes",
						action: ()=>{
							settings = waterDefaults
							localStorage.setItem("WaterSettings", JSON.stringify(settings))
							Water.gui.closeWindow()
						}
					}
				])
			}
		},
		{
			text: "Apply",
			action: ()=>{
				chrome.runtime.reload()
			}
		}
	])
}