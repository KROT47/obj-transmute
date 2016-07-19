
var ObjTransmute = require( './' );

var obj = {
		text: 'Hello world',
		temp: 123,
		obj: {
			test: 1
		}
	},
	index = 1,
	rules,
	config,
	result,
	testObj;


/* ------------ 1 ------------- */

rules = {
	// saveOrigin: true,
	content: 'text',
	num: {
		from: 'temp',
		get: ( temp ) => temp + 1
	},
	obj1: {
		from: 'obj',
		get: ( obj ) => { return { test: obj.test + 1 } }
	}
};

testObj = {
	content: 'Hello world',
	num: 124,
	obj1: {
		test: 2
	}
};

result = ObjTransmute( obj, rules );

check( testObj, result );


/* ------------ 2 ------------- */

rules = {
	content: 'text',
	num: {
		from: 'temp',
		get: ( temp ) => temp + 1
	}
};

config = {
	otherProps: true,
	saveOrigin: true,
};

testObj = {
	text: 'Hello world',
	content: 'Hello world',
	temp: 123,
	num: 124,
	obj: {
		test: 1
	}
};

result = ObjTransmute( obj, rules, config );

check( testObj, result );


/* ------------ 3 ------------- */

rules = {
	content: 'text',
	num: {
		from: 'temp',
		get: ( temp ) => temp + 1
	}
};

config = {
	otherProps: true,
	// saveOrigin: true,
};

testObj = {
	content: 'Hello world',
	num: 124,
	obj: {
		test: 1
	}
};

result = ObjTransmute( obj, rules, config );

check( testObj, result );


/* ------------ 4 ------------- */

rules = {
	content: 'text',
	num: {
		from: 'none',
		default: 111,
		get: ( none ) => none && none + 1 || undefined
	}
};

config = {
	otherProps: true,
	// saveOrigin: true,
};

testObj = {
	content: 'Hello world',
	num: 111,
	obj: {
		test: 1
	}
};

result = ObjTransmute( obj, rules, config );

check( testObj, result );



/* ------------ 5 ------------- */

rules = {
	content: {
		from: 'text',
		saveOrigin: false
	},
	num: {
		from: 'none',
		default: 111,
		get: ( none ) => none && none + 1 || undefined
	},
	opt: 'opt'
};

var defaultObj = {
	opt: 123
};

config = {
	otherProps: true,
	get: function ( value, obj, originProp, prop ) { return value || defaultObj[ originProp ] },
	saveOrigin: true,
};

testObj = {
	// text: 'Hello world',
	temp: 123,
	num: 111,
	obj: {
		test: 1
	},
	opt: 123
};

result = ObjTransmute( obj, rules, config );

check( testObj, result );


/* ------------ 6 ------------- */

var obj = {
        a: 1,
        b: 'Hello world!',
        other1: null
    },
    rules = {
        c: 'a',
        d: function ( value, obj, originProp, prop ) { return obj.b + this.obj.a },
        e: {
            from: 'a1',
            default: 'Bye world!',
            get: function ( a1, obj, originProp, prop ) {
            	return a1 === undefined ? null : a1 + '!!!'
        	}
        },
        f: {
            from: 'a1',
            default: 'Bye world!',
        },
        g: {
            default: 'default',
            get: function ( g, obj, originProp, prop ) { return g && g + '!!!' || undefined }
        },
    };

testObj = {
	g: 'default',
	f: 'Bye world!',
	e: null,
	d: 'Hello world!1',
	c: 1
};

result = ObjTransmute( obj, rules );

check( testObj, result );


/* ------------ 7 ------------- */

var config = {
        otherProps: true
    };

testObj = {
	other1: null,
	b: 'Hello world!',  
	g: 'default',       
	f: 'Bye world!',    
	e: null,            
	d: 'Hello world!1', 
	c: 1
};

result = ObjTransmute( obj, rules, config );

check( testObj, result );


/* ------------ 8 ------------- */

var defaultOptions = {
        other1: 123
    };

var config = {
        otherProps: true,
        saveOrigin: true,
        get: function ( value, obj, originProp, prop ) { return value || defaultOptions[ prop ] }
    };

testObj = {
	other1: 123,
	b: 'Hello world!',  
	a: 1,               
	g: 'default',       
	f: 'Bye world!',    
	e: null,            
	d: 'Hello world!1', 
	c: 1
};

result = ObjTransmute( obj, rules, config );

check( testObj, result );


/* ------------ 9 ------------- */

// var defaultOptions = {
//         other1: 123
//     };

var config = {
        // otherProps: true,
        // saveOrigin: true,
        // get: function ( value, obj, originProp, prop ) { return value || defaultOptions[ prop ] }
    };

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

testObj = {
	c: 7,
	d: 6,
	e: 3,
	f: 'Hello world10'
};

result = ObjTransmute( obj, rules, config );

check( testObj, result );


/* ------------ 10 ------------- */

var config = {
        descriptor: { enumerable: false }
    };

var obj = {
        a: 'Hello world'
    },
    rules = {
    	b: {
    		from: 'a',
    	},
    	c: {
    		from: 'a',
    		descriptor: { enumerable: true },
    	}
    };

testObj = {
	b: 'Hello world',
	c: 'Hello world'
};

result = ObjTransmute( obj, rules, config );

var getDescr = Object.getOwnPropertyDescriptor;

console.assert( getDescr( result, 'b' ).enumerable == false, 'Descriptor is not working' );
console.assert( getDescr( result, 'c' ).enumerable == true, 'Descriptor is not working' );

check( testObj, result );


/* --------------------------------- End --------------------------------- */

console.log( 'Done!' );


/* --------------------------------- Helpers --------------------------------- */

function check( testObj, result ) {
	for ( var i in testObj ) {
		if ( typeof testObj[ i ] == 'object' && testObj[ i ] !== null ) {
			if ( typeof result[ i ] != 'object' ) {
				console.error( `Error in ${ index }: result[ ${ i } ] != testObj[ ${ i } ] => `, result[ i ], '!=', testObj[ i ] );
			}
			check( testObj[ i ], result[ i ], true );
		} else if ( result[ i ] != testObj[ i ] ) {
			console.error( `Error in ${ index }: result[ ${ i } ] != testObj[ ${ i } ] => `, result[ i ], '!=', testObj[ i ] );
		}
	}
	if ( !arguments[ 2 ] ) index++;
}