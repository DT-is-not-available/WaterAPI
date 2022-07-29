extend = Water.extend = (func, newFunc, putBefore=false) => {
	if (typeof func != "function") {
		throw new Error("Water.extend: first argument must be a valid function")
		return
	}
	if (typeof newFunc != "function") {
		throw new Error("Water.extend: second argument must be a valid function")
		return
	}
	let orig = func
	if (putBefore) {
		func = function(...args) {
			let ret = newFunc(...args)
			if (ret !== undefined) {
				return ret
			}
			return orig(...args)
		}
	} else {
		func = function(...args) {
			let ret = orig(...args)
			if (ret !== undefined) {
				return ret
			}
			return newFunc(...args)
		}
	}
}