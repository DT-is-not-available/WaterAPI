const fs = require('fs')

$.page = 1
let restartRequired = false

Water.gui.addMenuButton(`- ${common_Localize.lo("manage_mods")} -`,()=>{
	$.page = 1
	$.waterMods()
}, "- Steam Workshop -")

extend("gui_GameMenu.create", ()=>{
	Water.gui.addButton(common_Localize.lo("manage_mods"), ()=>{
		Water.$.page = 1
		Water.$.waterMods()
	}, {
		fillWidth: true,
		centerText: true,
	})
},`	gui.windowAddBottomButtons([{ text : common_Localize.lo("back_to_title"), action : function() {`)

extend("gui_MoreSettingsWindow.create", ()=>{
	waterButton = new gui_TextButton(gui,stage,thisWindow,doConfirmLanguage,"Water "+common_Localize.lo("advanced_settings"));
	thisWindow.addChild(waterButton);
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,4)));
}, "	var slider1 = new gui_Slider(gui,stage,thisWindow,function() {")

extend("gui_MoreSettingsWindow.create", ()=>{
	waterButton.fillWidth()
}, "if(languageButton != null) {")

$.waterMods = function() {
	Water.gui.createWindow(false, "Please wait...")
	getInstalledMods($.page, mods=>{
		try {
			console.log(mods)
			Water.gui.closeWindow()
			let win = [
				"Select mods below to configure them",
			]
			if (restartRequired) {
				win.push("Restart required to apply changes")
				win.push({
					type: "button",
					text: "Restart",
					onClick: ()=>{
						chrome.runtime.reload()
					}
				})
			}
			for (let i = 0; i < mods.length; i++) {
				let mod = mods[i]
				let modConf = {
					name: mod.title,
					description: mod.description,
				}
				if (modConf.description.length > 200) modConf.description = modConf.description.substring(0, 200)+"..."
				win.push({
					type: "button",
					text: `${modConf.name}
${modConf.description}`,
					onClick: ()=>{
						Water.gui.createWindow(modConf.name, [
							modConf.description
						], [{
							text: "Settings",
							action: ()=>{
								// settings
							}
						},{
							text: "Uninstall",
							action: ()=>{
								Water.gui.createWindow("Are you sure?", "Are you sure you want to uninstall this mod?\nYou will have to reinstall it through the steam workshop.", [{
									text: "I am sure",
									action: ()=>{
										Water.gui.createWindow(false, "Please wait...")
										greenworks.ugcUnsubscribe(mod.publishedFileId, ()=>{
											restartRequired = true
											Water.gui.closeWindow(3)
											$.waterMods()	
										})
									}
								}])
							}
						}])
					},
					fillWidth: true,
				})
			}
			win.push(`Page ${$.page}`)
			let bottomButtons = []
			if ($.page > 1) bottomButtons.push({
				text: "Prev",
				action: ()=>{
					Water.gui.closeWindow()
					$.page--
					$.waterMods()
				}
			})
			if (mods.length > 0) bottomButtons.push({
				text: "Next",
				action: ()=>{
					Water.gui.closeWindow()
					$.page++
					$.waterMods()
				}
			})
			Water.gui.createWindow(common_Localize.lo("manage_mods"), win, bottomButtons)
			
		} catch (e) {
			Water.gui.closeWindow()
			let stack = e.stack.split("\n")
			Water.gui.createWindow(stack.shift(), stack.join("\n"), true)
		}
	})
}