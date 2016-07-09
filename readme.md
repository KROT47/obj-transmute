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
        d: function ( obj, result ) {
            // this.obj = obj
            // this.rules = rules
            return obj.b + this.obj.a
        },
        e: {
            prop: 'a1',
            default: 'Bye world!',
            get: function ( a1, originProp, obj, prop ) { return a1 + '!!!' }
        }
    };

ObjTransmute( obj, rules ) => { c: 1, d: 'Hello world!1', e: 'Bye world!' }

// -- Using config

var config = {
        otherProps: true
    };

ObjTransmute( obj, rules, config ) => {
        b: 'Hello world!',  // not defined in rules - passes through
        c: 1,
        d: 'Hello world!1',
        e: 'Bye world!',
        other1: null        // not defined in rules - passes through
    }

// --

var defaultOptions = {
        other1: 123
    };

var config = {
        otherProps: true,
        saveOrigin: true,
        get: function ( value, originProp, obj, prop ) { return value || defaultOptions[ prop ] }
    };

ObjTransmute( obj, rules, config ) => {
        a: 1,               // origin
        b: 'Hello world!',  // origin
        c: 1,
        d: 'Hello world!1',
        e: 'Bye world!',
        other1: 123                // unused value but using default get() returns value from defaultOptions
    }
```