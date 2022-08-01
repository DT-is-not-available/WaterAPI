(()=>{

const { EventEmitter } = require("events")
window.Water = new EventEmitter()

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
	scopeShare: "By sharing your scope, you are giving another mod control over all variables in your scope. This can be dangerous, and is not recommended with mods you don't trust.",
	currentScriptNull: "This function can only be used during the initialization of the script. If you are trying to use this function in a callback, instead save it's value to a variable and reuse it later.",
	onlyInScript: "This function can only be used inside of a script.",
}
function waterWarn(id) {
	if (messages[id]) {
		let modid = Water.getId ? Water.getId() : "Water"
		console.warn(`Warning: [${modid == Water.id ? "Water" : modid}] ${err.message}`)
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

if (window['debugger api']) window["debugger api"]().scope.share(`Water ${MAJOR}.${MINOR}.${PATCH}`)

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
	let dir = path.join("/") + "/dontAutoLoad/" + filename
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

// include all api files
Water.include("getDir.js")
Water.include("extend.js")
Water.include("scope.js")
Water.include("gui.js", {
	$: $
})
Water.include("throw.js")

// include better mods menu
Water.include("optionalModules/betterModsMenu.js")
Water.include("optionalModules/reloadHook.js")

Water.id = Water.getId()

})()