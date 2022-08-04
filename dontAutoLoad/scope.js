Water.scope = {
	share: (evalfunc, ...modid) => {
		let myid = Water.getId()
		if (!modid[0]) waterWarn("globalShare", "Water")
		else {
			if (modid[1] != true) waterWarn("scopeShare", "Water")
			if (!_scopes[modid[0]]) _scopes[modid[0]] = {}
		}
		if (!(evalfunc.toString() == "e=>eval(e)" && typeof evalfunc == "function")) throw new Error("evalfunc must be e=>eval(e)")
		return _scopes[modid[0] || "global"][myid] = evalfunc
	},
	get: (id) => {
		let myid = Water.getId()
		if (!_scopes[myid]) _scopes[myid] = {}
		return _scopes[myid][id] || _scopes.global[id]
	},
	getAll: () => {
		let myid = Water.getId()
		if (!_scopes[myid]) _scopes[myid] = {}
		let ret = {}
		ret[myid] = _scopes[myid]
		ret.global = _scopes.global
		return ret
	}
}