// This file will host methods extending the
// Array Class, this file should be loaded in app.js
// so the extensions are available at the app level.

// Handles transforming all values in an array to a Number.
Object.defineProperty(Array.prototype, "mapToNumber",{
	value(){
		return this.map( v => parseInt(v));
	}
})