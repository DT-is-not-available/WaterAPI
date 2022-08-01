$.waterButtons = []
let waterButtonNames = [
	"- Continue -",
	"- New City -",
	"- Load City -",
	"- Steam Workshop -",
	"- Exit -",
]

Water.extend("MainMenu", () => {
	try {
		Water.$.mainMenu = _gthis
		Water.emit("mainMenuCreated", _gthis)
		let waterButtons = Water.$.waterButtons
		let addButton = Water.$.w_mainMenu_addButton
		for (let i = 0; i < waterButtons.length; i++) {
			addButton(waterButtons[i].text, waterButtons[i].onClick, waterButtons[i].index, waterButtons[i].options)
		}
	} catch (e) {
		console.error(e)
	}
}, "		_gthis.positionUIElements();")

Water.gui = {}
Water.gui.addMenuButton = (text, onClick, index=0, options={}) => {
	if (typeof index == "string") {
		index = waterButtonNames.indexOf(index)+1
	}
	if (index < 0) {
		index = waterButtonNames.length-1
	}
	console.log(index)
	$.waterButtons.push({
		text: text,
		onClick: onClick,
		index: index,
		options: options
	})
	waterButtonNames.splice(index, 0, text)
}
Water.gui.closeWindow = (n=1) => {
	for (let i = 0; i < n; i++) {
		Water.game.state.gui.goPreviousWindow()
	}
}
Water.gui.closeAllWindows = () => {
	Water.game.state.gui.prevWindowStack = []
	Water.game.state.gui.closeWindow()
}

Water.gui.createWindow = (title, content, bottomButtons) => {
	let gui = Water.game.state.gui
	gui.createWindow()
	gui.addWindowToStack(()=>{
		Water.gui.createWindow(title, content, bottomButtons)
	})
	if (title) gui.windowAddTitleText(title)
	if (content) if (typeof content != "object") {
		gui.windowAddInfoText(content.toString())
	} else {
		let ids = Object.keys(content)
		let elements = Object.values(content)
		for (let i = 0; i < elements.length; i++) {
			let el = elements[i]
			if (typeof el != "object") {
				gui.windowSimpleButtonContainer = null
				gui.windowAddInfoText(el)
			} else {
				if (el.type == "simpleButton") {
					gui.windowAddSimpleButton(el.image, el.onClick, el.text, el.textUpdateFunction, el.font)
				} else if (el.type == "text") {
					gui.windowSimpleButtonContainer = null
					gui.windowAddInfoText(el.text, el.textUpdateFunction, el.font)
				} else if (el.type == "clickableText") {
					gui.windowSimpleButtonContainer = null
					gui.windowAddInfoTextClickable(el.onClick, el.text, el.textUpdateFunction, el.font)
				} else if (el.type == "checkbox") {
					gui.windowSimpleButtonContainer = null
					gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,el.onClick,el.isChecked || (()=>false),el.text)
					gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)))
				} else if (el.type == "slider") {
					gui.windowSimpleButtonContainer = null
					var slider = new gui_Slider(gui,gui.innerWindowStage,gui.windowInner,el.fillLevel=()=>0.50,el.setFillLevel=f=>{})
					slider.addChild(new gui_TextElement(slider,gui.innerWindowStage,el.text,el.textUpdateFunction,el.font))
					gui.windowInner.addChild(slider)
					gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)))
				} else if (el.type == "button") {
					let button = new gui_ContainerButton(gui,gui.innerWindowStage,gui.windowInner,el.onClick || (()=>{}), el.isActive || (()=>false), el.onHover || (()=>{}))
					button.container.addChild(new gui_TextElement(button,gui.innerWindowStage,el.text,el.textUpdateFunction,el.font))
					button.container.padding = { left: 3, right: 3, top: 3, bottom: -1 }
					if (el.fillWidth) button.container.fillSecondarySize = true
					button.container.updateSize()
					gui.windowInner.addChild(button)
					gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)))
				}
			}
		}
	}
	if (typeof bottomButtons == "object") gui.windowAddBottomButtons(bottomButtons)
	else if (bottomButtons) gui.windowAddBottomButtons()
}

$.w_mainMenu_addButton = (text, onClick, index=0, options={})=>{
	let o = {
		upperCorner: options.upperCorner || false,
		font: options.font || (options.upperCorner ? "Arial" : "Arial16"), 
		onHover: options.onHover || (() => {}),
		darken: options.darken || false,
	}
	let state = $.mainMenu
	state.bottomButtonStage.renderable = true
	var bottomButton = new graphics_BitmapText(text, {
		font: o.font, 
		tint: o.darken ? 13684944 : 16777215
	})
	state.bottomButtonStage.addChildAt(bottomButton, index)
	state.bottomButtons.splice(index, 0, bottomButton)
	state.bottomButtonOnClick.set(bottomButton, onClick)
	state.bottomButtonOnHover.set(bottomButton, o.onHover)
	state.bottomButtonOnRight.set(bottomButton, o.upperCorner)
	state.bottomButtonAttract.set(bottomButton, false)
	return bottomButton
}