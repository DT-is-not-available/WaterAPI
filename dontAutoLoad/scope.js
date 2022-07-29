Water.scope = {
	share: (modid) => {
		let myid = Water.getId()
		if (!modid) warn("globalShare")
		else if (!_scopes[modid]) _scopes[modid] = {}
		return _scopes[modid || "global"][myid] = eval(`
			(function(str) {
				return eval(str)
			})
		`)
	},
	get: (id) => {
		let myid = Water.getId()
		return _scopes[myid][id] || _scopes.global[id]
	},
	getAll: () => {
		let myid = Water.getId()
		let ret = {}
		ret[myid] = _scopes[myid]
		ret.global = _scopes.global
		return ret
	}
}