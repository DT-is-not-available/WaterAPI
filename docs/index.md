# Water API
- [game](#Water.game)
- [city](#Water.city)
- [time](#Water.time)
- [extend](#Water.extend)
- [merge](#Water.merge)
- [include](#Water.include)
- [getPath](#Water.getPath)
- [getDir](#Water.getDir)
- [getId](#Water.getId)
- [steamMods](#Water.steamMods)
- [version](#Water.version)
- [on](#Water.on)
- [gui](gui.md)
	- [addButton](gui.md#Water.gui.addButton)
	- [addMenuButton](gui.md#Water.gui.addMenuButton)
	- [closeAllWindows](gui.md#Water.gui.closeAllWindows)
	- [closeWindow](gui.md#Water.gui.closeWindow)
	- [createWindow](gui.md#Water.gui.createWindow)
- [Timeline](Timeline.md)
	- [schedule](Timeline.md#Timeline.schedule)
	- [advance](Timeline.md#Timeline.advance)
	- [cancel](Timeline.md#Timeline.cancel)

## Water.game
A reference to the game variable

## Water.city
A reference to the city variable

## Water.time
Time elapsed since city load in in-game time, not the same as Water.city.simulation.time

## Water.extend
```js
Water.extend(funcName, newFunction, ?section, ?replace, ?index)
```
Inserts, modifies, or removes code from any function

### `funcName`
The name of the function to modify. Must be a string, NOT a function. This parameter is evaluated to modify the desired function. To avoid a call to `eval()`, use [merge](#Water.merge) instead.

### `newFunction`
The new function to insert.

### `section`
The section of the function to modify. Can be any string within the function. When `section` is not specified, the new code will be inserted at the end of the function.

### `replace`
If `true`, the new code will replace the section specified by `section`. If `false`, the new code will be inserted before the section specified by `section`. Defaults to `false`.

### `index`
The index of matching `section` to use. Defaults to `0`, which is the first matching section. 

## Water.merge
```js
Water.merge(func, newFunction, ?section, ?replace, ?index)
```
Inserts, modifies, or removes code from any function and returns the new function

### `func`
The function to modify. Must be a function, NOT a string.

### `newFunction`
The new function to insert.

### `section`
The section of the function to modify. Can be any string within the function. When `section` is not specified, the new code will be inserted at the end of the function.

### `replace`
If `true`, the new code will replace the section specified by `section`. If `false`, the new code will be inserted before the section specified by `section`. Defaults to `false`.

### `index`
The index of matching `section` to use. Defaults to `0`, which is the first matching section. 

## Water.include
```js
Water.include(filepath, ?variables)
```
Loads any JS file from your mod directory. Variables can be passed in as an object.

### `filepath`
The file path relative to your mod directory. Must be a string. Cannot be a complete path.

### `variables`
An object of variables to pass to the file.

## Water.getPath
```js
Water.getPath()
```
Returns the path to your mod folder as an array of folders

## Water.getDir
```js
Water.getDir()
```
Returns the path to your mod folder as a string

## Water.getId
```js
Water.getId()
```
Returns your mod's ID, or the folder it is located in if not a steam mod

## Water.steamMods
A path to the folder containing workshop mods

## Water.version
A variable containing the version name

## Water.on
Listen for a water event. Here is a list of currently supported ones:
- `mainMenu` - fires when the game loads the main menu