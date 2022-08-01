Water.getDir = () => {
	let path = Water.getPath()
	let index = path.indexOf("mods") + 1
	if (index == -1) index = path.indexOf("1180130") + 1
	if (index == -1) index = path.length - 1
	path.length = index
	return path.join("/")
}

Water.getId = () => {
	let path = Water.getPath()
	let index = path.indexOf("mods") + 1
	if (index == -1) index = path.indexOf("1180130") + 1
	if (index == -1) index = path.length - 1
	return path[index]
}