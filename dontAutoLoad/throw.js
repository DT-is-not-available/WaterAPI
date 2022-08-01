Water.throw = (err) => {
	alert(err.stack.split("\n")[0] + "\n" + err.stack.split("\n")[1])
	console.error(err.stack)
}