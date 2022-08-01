const fs = require('fs')

let page = 1
let restartRequired = false

Water.gui.addMenuButton("- Installed Mods -",()=>{
	page = 1
	waterMods()
}, "- Steam Workshop -")

function waterMods() {
	Water.gui.createWindow(false, "Please wait...")
	getInstalledMods(page, mods=>{
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
											Water.gui.closeAllWindows()
											waterMods()	
										})
									}
								}])
							}
						}])
					},
					fillWidth: true,
				})
			}
			win.push(`Page ${page}`)
			let bottomButtons = []
			if (page > 1) bottomButtons.push({
				text: "Prev",
				action: ()=>{
					Water.gui.closeWindow()
					page--
					waterMods()
				}
			})
			if (mods.length > 0) bottomButtons.push({
				text: "Next",
				action: ()=>{
					Water.gui.closeWindow()
					page++
					waterMods()
				}
			})
			Water.gui.createWindow("Installed Mods", win, bottomButtons)
			
		} catch (e) {
			Water.gui.closeWindow()
			let stack = e.stack.split("\n")
			Water.gui.createWindow(stack.shift(), stack.join("\n"), true)
		}
	})
}