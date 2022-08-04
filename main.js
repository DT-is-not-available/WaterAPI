(()=>{

const { EventEmitter } = require("events")
window.Water = new EventEmitter()

// error simplifier
function remIrrErrInfo (str) {
	str = str.toString()
	try {
		let lines = str.split("\n")
		lines.forEach((line, i) => {
			lines[i] = line.replace(/chrome\-extension:\/\/\w+\/game\/js\//g, "").replace(/file\:\/\/\//g,"").replace(/%20/g, " ").replace(/C\:\/Users\/\w+\//g,"").replace(/AppData\/Local\/the-final-earth-2\/User Data\/Default\//g, "")
		})
		return lines.join("\n")
	} catch (e) {
		alert (typeof str) 
	}
}

// local storage Water key

// version
const MAJOR = 0
const MINOR = 1
const PATCH = 0

const fs = require("fs")

try {
	Water.steamMods = _internalModHelpers.getAllModsSteam()[0].replace("steamMod:///", "").replace(/\\/g, "/").split("/").slice(0, -1).join("/")
} catch (e) {
	Water.steamMods = false
}

/**/ let /**/ _scopes = {
	global: {}
}

let $ = {}
Water.$ = $

let messages = {
	globalShare: "Sharing your scope globally can be dangerous, as you are giving any mod control over your scope. It is recommended that you do not share your scope globally, unless you know what you are doing.",
	scopeShare: "By sharing your scope, you are giving another mod control over all variables in your scope. This can be dangerous, and is not recommended with mods you don't trust. You can add true as the third parameter of this function to ignore this warning completely.",
	currentScriptNull: "This function can only be used during the initialization of the script. If you are trying to use this function in a callback, instead save it's value to a variable and reuse it later.",
	onlyInScript: "This function can only be used inside of a script.",
}
function waterWarn(id, dispid = false) {
	if (messages[id]) {
		let modid = dispid ? dispid : Water.getId ? Water.getId() : "Water"
		console.warn(`Warning: [${modid == Water.id ? "Water" : modid}] ${messages[id]}`)
	}
}
function waterErr(id, dispid = false) {
	try {
		if (messages[id]) {
			let modid = dispid ? dispid : Water.getId ? Water.getId() : "Water"
			throw new Error(`[${modid == Water.id ? "Water" : modid}] ${messages[id]}`)
		}
	} catch (err) {
		throw err
	}
}
Water.time = 0

// easily accessible version number
Water.version = MAJOR + "." + MINOR + "." + PATCH

// get path function
Water.getPath = () => {
	var origPrep = Error.prepareStackTrace
	try {
		Error.prepareStackTrace = function(_, stack) {
			return stack
		}
		var err = new Error()
		var stack = err.stack
		Error.prepareStackTrace = origPrep
		stack.shift()
		stack.shift()
		while (stack[0].toString().indexOf("(") != -1) {
			stack.shift()
		}
		let dir = stack[0].toString()
		dir = dir.replace("%20"," ").replace("file:///","")
		let index = dir.indexOf(":")
		if (index != -1) dir.length = index
		let path = dir.split("/")
		return path
	} catch (e) {
		Error.prepareStackTrace = origPrep
		// force water id to prevent  O V E R F L O W
		waterErr("onlyInScript", "Water")
	}
}

// include function
Water.include = (filename, vars={}) => {
	let path = Water.getPath()
	let index = path.indexOf("mods") + 1
	if (index == -1) index = path.indexOf("1180130") + 1
	if (index == -1) index = path.length - 1
	path.length = index + 1
	let dir = path.join("/") + "/" + filename
	let file
	try {
		file = fs.readFileSync(dir).toString()
	} catch (e) {
		e.message = `${dir}\n${e.message}`
		throw e
	}
	// this method of synchronously including files shows up as an anonymous function in the stack trace
	// so instead, i put it in a variable named the same as the file directory
	// this way it prints nicer in the stack trace
	let module = {}
	try {
		module[filename] = Function(...Object.keys(vars), file)
	} catch (e) {
		let stacklines = e.stack.split("\n")
		stacklines[1] = `    at ${"file:///"+dir.replace(/ /g,"%20")}`
		e.stack = stacklines.join("\n")
		throw e
	}
	try {
		return module[filename](...Object.values(vars))
	} catch (e) {
		//*
		// something went wrong while executing the file
		// take it one step further and turn "at Object.eval [as filepath] (eval at Water.include (main.js:91), <anonymous>:line+2:col)"
		// into "at filepath:line:col"
		let stacklines = e.stack.split("\n")
		stacklines.forEach((line, i, stack) => {
			if (line.includes(filename)) {
				// remove last character of line
				// split by : and get last 2 parts
				let pos = line.slice(0, -1).split(":").slice(-2)
				pos[0] = parseInt(pos[0]-2)
				pos[1] = parseInt(pos[1])
				// replace line with new line
				stack[i] = `    at ${"file:///"+dir.replace(/ /g,"%20")}:${pos[0]}:${pos[1]}`
			}
		})
		e.stack = stacklines.join("\n")
		// perfection */
		throw e
	}
}

ModTools.onModsLoaded(function(_game) {
	Water.game = _game
	console.log("Water version: " + Water.version)
})

ModTools.onCityUpdate(function(_city, _dt) {
	Water.time += _dt
})

ModTools.onLoadStart(function() {
	Water.time = 0
})

// include all api files
let settings = localStorage.getItem("WaterSettings") ? JSON.parse(localStorage.getItem("WaterSettings")) : waterDefaults
let waterIncludes = {
	$: $,
	settings: settings,
	waterWarn: waterWarn,
	waterErr: waterErr,
	_scopes: _scopes
}
Water.include("dontAutoLoad/getDir.js", waterIncludes)
Water.include("dontAutoLoad/extend.js", waterIncludes)
Water.include("dontAutoLoad/settings.js", waterIncludes)
Water.include("dontAutoLoad/gui.js", waterIncludes)
if (settings.experimentalAPI_scope) Water.include("dontAutoLoad/scope.js", waterIncludes)
if (settings.experimentalAPI_timeline) Water.include("dontAutoLoad/timeline.js", waterIncludes)

// include better mods menu
if (settings.betterModsMenu) Water.include("dontAutoLoad/optionalModules/betterModsMenu.js", waterIncludes)
if (settings.restartOnReload) Water.include("dontAutoLoad/optionalModules/reloadHook.js", waterIncludes)

if (settings.showErrors) window.onerror = function(msg, url, line, col, error) {
	let stack = remIrrErrInfo(error.stack)
	try {
		Water.gui.createWindow("Error: "+msg, [`At ${remIrrErrInfo(url)}:${line}:${col}\n`, `[red]${stack}`], false)
	} catch (e) {
		alert(`Error: ${msg}
At ${remIrrErrInfo(url)}:${line}:${col}

${stack}`)
	}
}
if (settings.showErrors) window["debugger api"]().errmsg = false

Water.id = Water.getId()

})()