extend("gui_MoreSettingsWindow.create", ()=>{
	waterButton = new gui_TextButton(gui,stage,thisWindow,Water.$.waterSettings,"Water Settings");
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
Water.settings = localStorage.getItem("WaterSettings") ? JSON.parse(localStorage.getItem("WaterSettings")) : waterDefaults

Water.$.waterSettings = function() {
	Water.settings = localStorage.getItem("WaterSettings") ? JSON.parse(localStorage.getItem("WaterSettings")) : waterDefaults
	Water.gui.createWindow("Water Settings", [
		"Most settings will not take effect until the next restart. You can restart now by clicking 'Apply' to save settings and reload the game.\n",
		"Special settings for Water's UI and behavior",
		{
			type: "checkbox",
			text: "Better mods menu",
			onClick: ()=>{
				Water.settings.betterModsMenu = !Water.settings.betterModsMenu
				localStorage.setItem("WaterSettings", JSON.stringify(Water.settings))
			},
			isChecked: ()=>Water.settings.betterModsMenu,
		},
		{
			type: "checkbox",
			text: "Completely restart on reload",
			onClick: ()=>{
				Water.settings.restartOnReload = !Water.settings.restartOnReload
				localStorage.setItem("WaterSettings", JSON.stringify(Water.settings))
			},
			isChecked: ()=>Water.settings.restartOnReload,
		},
		"Settings for experimental API features",
		{
			type: "checkbox",
			text: "Scopes API",
			onClick: ()=>{
				Water.settings.experimentalAPI_scope = !Water.settings.experimentalAPI_scope
				localStorage.setItem("WaterSettings", JSON.stringify(Water.settings))
			},
			isChecked: ()=>Water.settings.experimentalAPI_scope,
		},
	], [
		{
			text: "Reset",
			action: ()=>{
				Water.gui.createWindow("Reset Defaults", "Are you sure you want to reset all settings to their default values?", [
					{
						text: "Yes",
						action: ()=>{
							Water.settings = waterDefaults
							localStorage.setItem("WaterSettings", JSON.stringify(Water.settings))
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