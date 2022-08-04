Water.Timeline = class {
	#events
	constructor() {
		this.time = 0
		this.#events = []
	}
	schedule(timeUntil, callback) {
		if (timeUntil < 0) throw new Error("Cannot schedule an event in the past")
		let time = this.time+timeUntil
		
		let start = this.#events[0]
		let end = this.#events[this.#events.length-1]// python superior here (events[-1])
		// past largest value
		if (this.#events.length == 0 || time >= end.time)
			return this.#events[this.#events.push({
				time: time,
				callback: callback
			})]
		// before shortest value
		else if (time <= start.time) {
			this.#events.splice(0, 0, {
				time: time,
				callback: callback
			})
			return this.#events[0]
		} else {
			// its somewhere in the middle
			let pos = binarySearch(this.#events, time)
			let val = this.#events[pos]
			if (time > val.time) // insert after
				pos++
				this.#events.splice(pos, 0, {
					time: time,
					callback: callback
				})
			return this.#events[pos]
		}
	}
	cancel(event) {
		// del
		this.#events.splice(this.#events.indexOf(event), 1)
	}
	advance(time) {
		this.time += time
		console.log("do events "+time+" ("+this.time+")")
		while (this.#events.length > 0 && this.#events[0].time <= this.time) {
			let event = this.#events.shift()
			event.callback()
		}
	}
	reset() {
		this.#events = []
		this.time = 0
	}
	// anything else?
}

function binarySearch(arr, el) {
	let left = 0
	let right = arr.length - 1
	let mid
	
	while (left <= right) {
		// Using bitwise or instead of Math.floor as it is slightly faster
		mid = ((right + left) / 2) | 0
		if (arr[mid] === el) {
			// if its equal great, return position
			return mid
		} else if (el < arr[mid]) {
			right = mid - 1
		} else {
			left = mid + 1
		}
	}

	// not equal, return closest value
	return mid
}