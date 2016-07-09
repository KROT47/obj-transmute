
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
		prop: 'temp',
		get: ( temp ) => { return temp + 1 }
	},
	obj1: {
		prop: 'obj',
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
		prop: 'temp',
		get: ( temp ) => { return temp + 1 }
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
		prop: 'temp',
		get: ( temp ) => { return temp + 1 }
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
		prop: 'none',
		default: 111,
		get: ( none ) => { return none + 1 }
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
		prop: 'text',
		saveOrigin: false
	},
	num: {
		prop: 'none',
		default: 111,
		get: ( none ) => { return none + 1 }
	},
	opt: 'opt'
};

var defaultObj = {
	opt: 123
};

config = {
	otherProps: true,
	get: function ( value, originProp, obj, prop ) { return value || defaultObj[ originProp ] },
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


/* --------------------------------- End --------------------------------- */

console.log( 'Done!' );


/* --------------------------------- Helpers --------------------------------- */

function check( testObj, result ) {

	for ( var i in testObj ) {
		if ( typeof testObj[ i ] == 'object' ) {
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