(()=>{

window.Water = {}

// version
const MAJOR = 0
const MINOR = 1
const PATCH = 0

const fs = require("fs")

/**/ let /**/ _scopes = {
	global: {}
}

let messages = {
	globalShare: "Sharing your scope globally can be dangerous, as you are giving any mod control over your scope. It is recommended that you do not share your scope globally, unless you know what you are doing.",
	scopeShare: "By sharing your scope, you are giving another mod control over all variables in your scope. This can be dangerous, and is not recommended with mods you don't trust.",
	currentScriptNull: "This function can only be used during the initialization of the script. If you are trying to use this function in a callback, instead save it's value to a variable and reuse it later."
}
function warn(id) {
	if (messages[id]) {
		console.warn(`[${Water.getId()}] Warning: ${messages[id]}`)
	}
}
function err(id) {
	if (messages[id]) {
		throw new Error(`[${Water.getId()}] Error: ${messages[id]}`)
	}
}

if (window['debugger api']) window["debugger api"]().scope.share(`Water ${MAJOR}.${MINOR}.${PATCH}`)

// easily accessible version number
Water.version = MAJOR + "." + MINOR + "." + PATCH

// include function
Water.include = (filename) => {
	if (document.currentScript == null) throw new Error("Water.include: this function can only be called from a script") 
	let dir = (document.currentScript.src.substr(
		0,
		document.currentScript.src.lastIndexOf("/")
	)+"/dontAutoLoad/"+filename).toString().replace("file:///","").replace("%20"," ")
	try {
		return Function(
			fs.readFileSync(dir)
		)()
	} catch (e) {
		throw new Error("Water.include: Failed to include file: "+dir)
	}
}

ModTools.onModsLoaded(function() {
	console.log("Water version: " + Water.version)
})

// include all api files
Water.include("getDir.js")
Water.include("extend.js")
Water.include("scope.js")

})()