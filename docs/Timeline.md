# Water.Timeline
Water's built-in timeline system for scheduled events. Can be used for optimization purposes or scheduling events within the game. Time for timelines is not automatically synced up with the game time.
```js
let Timeline = new Water.Timeline()
```

## Timeline.schedule
```js
Timeline.schedule(timeUntil, callback)
```
Schedules an event for `timeUntil` units in the future. Returns the event in an object.

### `timeUntil`
Amount of time the event should take to fire

### `callback`
The function to be run when the event occurs

## Timeline.advance
```js
Timeline.advance(time)
```
Advances the timeline by `time` units and runs any events that have passed in the order of earliest to latest.

### `time`
Amount of time to advance the timeline by

## Timeline.cancel
```js
Timeline.cancel(event)
```
Cancels an event from happening, effectively removing it from the timeline.

### `event`
An event object returned by `Timeline.schedule()`

## Timeline.reset
```js
Timeline.reset()
```
Resets all events and the current time on the timeline.

## Timeline.time
The current time on the timeline