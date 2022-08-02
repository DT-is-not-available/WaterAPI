# Water.gui
Water's built-in API for menus and windows.

## Water.gui.addButton
```js
Water.gui.addButton(text, onClick, ?options)
```
Adds a button to the currently open window. If there is no open window, this function will throw an error.
### `text`
The text the button should display.
### `onClick`
The function to call when the button is clicked.
### `options`
An object containing the following optional keys:
- `font`: The font to use for the button. Can be `"Arial"`, `"Arial10"`, `"Arial15"`, `"Arial16"`, or `"Arial18"`. Defaults to `"Arial"`.
- `onHover`: The function to call when the mouse hovers over the button.
- `isActive`: A function returning `true` if the button should appear selected. Defaults to `() => false`.
- `textUpdateFunction`: A function that returns the new text to display on the button every frame. If not specified, the button will display the text it was given in the first place.
- `fillWidth`: If `true`, the button will fill the width of the window. Defaults to `false`.

## Water.gui.addMenuButton
```js
Water.gui.addMenuButton(text, onClick, ?index, ?options)
```
Adds a button to be added to the main menu. If you are on the main menu, the new button will appear after exiting and re-entering the main menu.
### `text`
The text the button should display.
### `onClick`
The function to call when the button is clicked.
### `index`
The index at which to insert the button. Defaults to `0`. A string containing the text of another button can also be used, in which case the button will be inserted after that button.
### `options`
An object containing the following optional keys:
- `font`: The font to use for the button. Can be `"Arial"`, `"Arial10"`, `"Arial15"`, `"Arial16"`, or `"Arial18"`. Defaults to `"Arial"`.
- `onHover`: The function to call when the mouse hovers over the button.
- `upperCorner`: A boolean indicating whether the button should appear in the main list or at the upper right corner of the screen. Defaults to `false`.
- `darken`: A boolean indicating whether the button should have a darker tint on it. Defaults to `false`.

## Water.gui.closeAllWindows
```js
Water.gui.closeAllWindows()
```
Closes all open windows.

## Water.gui.closeWindow
```js
Water.gui.closeWindow(n)
```
Closes the top n windows. If n is not specified, closes the top window. If there are fewer than n windows open, it will close all windows.
### `n`
The number of windows to close.

## Water.gui.createWindow
```js
Water.gui.createWindow(?title, ?content, ?bottomButtons, ?closeText, ?closeAction)
```
Creates a new window.
### `title`
The title of the window. If not specified, the window will have no title and be missing the x button in the top right corner.
### `content`
The content of the window. Can be a string or an array of strings or objects. 

If specified as a string, the string will be displayed as-is. 

If specified as an array, each element will be displayed on its own line. Each element is either a string with plain text or an object containing a `type` key. The following types are supported:
- `"text"`
	- `text`: The text to display.
	- `font`: The font to use for the text. Can be `"Arial"`, `"Arial10"`, `"Arial15"`, `"Arial16"`, or `"Arial18"`. Defaults to `"Arial"`.
	- `textUpdateFunction`: A function that returns the new text to display on the text label every frame. If not specified, the text label will display the text it was given in the first place.
- `"clickableText"`
	- `text`: The text to display.
	- `font`: The font to use for the text. Can be `"Arial"`, `"Arial10"`, `"Arial15"`, `"Arial16"`, or `"Arial18"`. Defaults to `"Arial"`.
	- `onClick`: The function to call when the text is clicked.
	- `textUpdateFunction`: A function that returns the new text to display on the text label every frame. If not specified, the text label will display the text it was given in the first place.
- `"button"`
	- `text`: The text to display.
	- `onClick`: The function to call when the button is clicked.
	- `font`: The font to use for the button. Can be `"Arial"`, `"Arial10"`, `"Arial15"`, `"Arial16"`, or `"Arial18"`. Defaults to `"Arial"`.
	- `onHover`: The function to call when the mouse hovers over the button.
	- `isActive`: A function returning `true` if the button should appear selected. Defaults to `() => false`.
	- `textUpdateFunction`: A function that returns the new text to display on the button every frame. If not specified, the button will display the text it was given in the first place.
	- `fillWidth`: If `true`, the button will fill the width of the window. Defaults to `false`.
- `"simpleButton"`
	- `text`: The text to display.
	- `onClick`: The function to call when the button is clicked.
	- `font`: The font to use for the button. Can be `"Arial"`, `"Arial10"`, `"Arial15"`, `"Arial16"`, or `"Arial18"`. Defaults to `"Arial"`.
	- `textUpdateFunction`: A function that returns the new text to display on the button every frame. If not specified, the button will display the text it was given in the first place.
	- `image`: The sprite name to display on the button.
- `"checkbox"`
	- `text`: The text to display.
	- `onClick`: The function to call when the checkbox is clicked.
	- `isChecked`: A function returning `true` if the checkbox should be checked. Defaults to `() => false`.
- `"slider"`
	- `text`: The text to display.
	- `font`: The font to use for the slider. Can be `"Arial"`, `"Arial10"`, `"Arial15"`, `"Arial16"`, or `"Arial18"`. Defaults to `"Arial"`.
	- `textUpdateFunction`: A function that returns the new text to display on the slider every frame. If not specified, the slider will display the text it was given in the first place.
	- `setFillLevel`: The function to call when the slider is moved.
	- `fillLevel`: A function returning the current fill level of the slider, between 0 and 1. Defaults to `() => 0.5`.

### `bottomButtons`
Either a boolean indicating whether the window should have a bottom button bar or an array of buttons to add to the bottom button bar.

If specified as `true`, the window will have a bottom button bar with a `"Close"` button.

If specified as an array, each element is an object containing the following keys:
- `text`: The text to display.
- `action`: The function to call when the button is clicked.

### `closeText`
The text to display on the close button. Defaults to `"Close"`.

### `closeAction`
The function to call when the close button is clicked. If not specified, the close button will use the default behavior of closing the top window.