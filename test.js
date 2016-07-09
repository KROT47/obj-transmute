
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