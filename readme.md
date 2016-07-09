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
        c: 'a',  // 'a' - originProp => result.c = obj.a
        d: function ( d, obj, originProp, prop ) {
            // context:
            // this.obj = obj
            // this.rules = rules
            // this.config = config
            // this.result - result object in current state
            // arguments:
            // d = obj[ originProp ] = obj.d = undefined - obj value of same property 'd'
            // originProp = 'd'
            // obj = this.obj
            // prop = 'd'
            return obj.b + this.obj.a;
        },
        e: {
            from: 'a1',             // originProp
            default: 'Bye world!',  // working only when get() returns undefined
            get: function ( a1, obj, originProp, prop ) {
                // arguments:
                // a1 = obj[ originProp ] = obj.a1 = undefined
                // originProp = 'a1'
                // obj = this.obj
                // prop = 'e'
                return a1 === undefined ? null : a1 + '!!!';
            }
        },
        f: {
            from: 'a1',             // originProp
            default: 'Bye world!',  // value by default if obj.a1 === undefined
        },
        g: { // same as d example but on undefined returns default value
            default: 'default',  // working only when get() returns undefined
            get: function ( g, obj, originProp, prop ) { return g && g + '!!!' || undefined }
        },
    };

ObjTransmute( obj, rules ) => { c: 1, d: 'Hello world!1', e: null, f: 'Bye world!', g: 'default' }


/* ------------ Using config ------------- */

var config = {
        otherProps: true
    };

ObjTransmute( obj, rules, config ) => {
        b: 'Hello world!',  // not defined in rules - passes through
        c: 1,
        d: 'Hello world!1',
        e: null,
        f: 'Bye world!',
        g: 'default',
        other1: null        // not defined in rules - passes through
    }


/* ------------ Using Default Object ------------- */

var defaultOptions = {
        other1: 123
    };

var config = {
        otherProps: true,
        saveOrigin: true,
        // define get by default
        get: function ( value, obj, originProp, prop ) { return value || defaultOptions[ prop ] }
    };

ObjTransmute( obj, rules, config ) => {
        a: 1,               // origin
        b: 'Hello world!',  // origin
        c: 1,
        d: 'Hello world!1',
        e: null,
        f: 'Bye world!',
        g: 'default',
        other1: 123                // unused value but using default get() returns value from defaultOptions
    }
    
/* ------------ Using Require Option ------------- */
// Reuqire option is used when we need other property to be calculated before current property
var obj = {
        a: 'Hello world',
        b: 1
    },
    rules = {
        c: {
            require: 'd',           // tells that first we need to get result.d
            get: function () { return this.result.d + 1 }
        },
        d: {
            require: 'e',           // tells that first we need to get result.e
            get: function () { return this.result.e * 2 }
        },
        e: function () { return this.obj.b + 2 },
        f: {
            from: 'a',              // we get value from obj.a
            require: [ 'c', 'e' ],  // and require result.c and result.e to be already calculated
            get: function ( a ) { return a + ( this.result.c + this.result.e ) }
        }
    };
    
ObjTransmute( obj, rules, config ) => {
     c: 7,
     d: 6,
     e: 3,
     f: 'Hello world10'
}
```