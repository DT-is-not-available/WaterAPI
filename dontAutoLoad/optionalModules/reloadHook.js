Water.extend("nw.Window.get().reload", () => {
	localStorage.setItem("hardReload", "true")
	chrome.runtime.reload()
})
if (localStorage.getItem("hardReload") == "true") {
	localStorage.removeItem("hardReload")
	// open dev tools
	nw.Window.get().showDevTools()
}