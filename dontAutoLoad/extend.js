function _getInnerCode(func) {
	// get from first { to last }
	var start = func.indexOf("{") + 1
	var end = func.lastIndexOf("}")
	var code = func.substring(start, end)
	if (code.indexOf("\n") == 0) {
		code = code.replace("\n", "")
	}
	if (code.lastIndexOf("\n") == code.length - 1) {
		code = code.replace(/\n$/, "")
	}
	return code
}

function _getArgs(func) {
	// get from first ( to first )
	var start = func.indexOf("(") + 1
	var end = func.indexOf(")")
	var args = func.substring(start, end)
	return args.split(",")
}

function _getIndexOf(string, subString, index) {
	let arr = string.split(subString)
	arr.splice(index + 1, arr.length - index)
	return arr.join(subString).length - 1;
}

$.__WATERERRORS = []
$.__WATERERRORS.throw = function(errno, e) {
	// get error message and first line of stack from e
	let message = e.message
	let stacktop = e.stack.split("\n")[0]
	// set errno error message and first line of stack
	$.__WATERERRORS[errno].message = message
	let stack = $.__WATERERRORS[errno].stack.split("\n")
	stack[0] = stacktop
	$.__WATERERRORS[errno].stack = stack.join("\n")
	// finally throw
	throw $.__WATERERRORS[errno]
}

Water.merge = function(origFunc, newFunc, section = null, replace = false, index = 0) {
	let errno = $.__WATERERRORS.push(new Error())-1
	if (typeof origFunc != "function") {
		throw new Error("Water.extend: first argument must be a valid function")
	}
	if (typeof newFunc != "function") {
		throw new Error("Water.extend: second argument must be a valid function")
	}

	let origCode = _getInnerCode(origFunc.toString())
	let newCode = 
	"\n/* extension */\n" + 
	"try {\n" +
	_getInnerCode(newFunc.toString()) + 
	"\n} catch (e) {\n" +
	"	Water.$.__WATERERRORS.throw(" + errno + ", e);\n" +
	"}\n" +
	"\n/* end */\n"

	let pos
	let endpos
	if (section != null) {
		pos = _getIndexOf(origCode, section, index)
	} else {
		pos = origCode.length
	}
	endpos = pos + (section == null ? 0 : section.length)

	if (pos < 0) {
		throw new Error("Water.extend: section not found in function")
	}

	let finalCode

	if (!replace) {
		finalCode = origCode.substring(0, pos) + newCode + origCode.substring(pos)
	} else {
		finalCode = origCode.substring(0, pos) + newCode + origCode.substring(endpos)
	}

	let finalFunc
	try {
		finalFunc = Function(..._getArgs(origFunc.toString()), finalCode)
	} catch (e) {
		throw finalCode+"\n"+e.stack
	}
	finalFunc.prototype = {
		...origFunc.prototype,
		...newFunc.prototype,
	}

	return finalFunc
}

extend = Water.extend = function(origFuncName, newFunc, section=null, replace=false, index=0) {
	if (!(typeof origFuncName == "string" && typeof eval(origFuncName) == "function")) {
		throw new Error("Water.extend: first argument must be a valid function name")
	}
	return eval(`
		${origFuncName} = Water.merge(${origFuncName}, ${newFunc}, ${JSON.stringify(section)}, ${replace}, ${index})
	`)
}