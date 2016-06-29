# ObjTransmute

Transmutes ( converts ) object to another one using defined rules and config ( optional )

**Usage:**

```js
const ObjTransmute = require( 'obj-transmute' );

// ObjTransmute( {obj|Object}, {rules|Object}[, {config|Object}] ) => {Object}

var obj = {
		a: 1,
		b: 'Hello world!',
		other1: null
	},
	rules = {
		c: 'a',
		d: function ( obj ) {
			// this.obj = obj
			// this.rules = rules
			return obj.b + this.obj.a
		},
		e: {
			param: 'a1',
			default: 'Bye world!',
			get: function ( a1 ) { return a1 + '!!!' }
		}
	};

ObjTransmute( obj, rules ) => { c: 1, d: 'Hello world!1', e: 'Bye world!' }

// -- Using config

var config = {
		passOtherProps: true
	};

ObjTransmute( obj, rules, config ) => 
	{
		b: 'Hello world!',	// not defined in rules - passes through
		c: 1,
		d: 'Hello world!1',
		e: 'Bye world!',
		other1: null		// not defined in rules - passes through
	}

// --

var config = {
		passOtherProps: true,
		saveOrigin: true,
		init: function () { this.obj.other2 = this.obj.other1 }
	};

ObjTransmute( obj, rules, config ) => 
	{
		a: 1,				// origin
		b: 'Hello world!',	// origin
		c: 1,
		d: 'Hello world!1',
		e: 'Bye world!',
		other1: null		// unused value passes through
		other2: null		// unused value passes through
	}
```