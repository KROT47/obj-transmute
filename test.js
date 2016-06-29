
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
	mutated,
	result;


/* ------------ 1 ------------- */

rules = {
	// saveOrigin: true,
	content: 'text',
	num: {
		param: 'temp',
		get: ( temp ) => { return temp + 1 }
	},
	obj1: {
		param: 'obj',
		get: ( obj ) => { return { test: obj.test + 1 } }
	}
};

result = {
	content: 'Hello world',
	num: 124,
	obj1: {
		test: 2
	}
};

mutated = ObjTransmute( obj, rules );

check( result, mutated );


/* ------------ 2 ------------- */

rules = {
	content: 'text',
	num: {
		param: 'temp',
		get: ( temp ) => { return temp + 1 }
	}
};

config = {
	passOtherProps: true,
	saveOrigin: true,
};

result = {
	text: 'Hello world',
	content: 'Hello world',
	temp: 123,
	num: 124,
	obj: {
		test: 1
	}
};

mutated = ObjTransmute( obj, rules, config );

check( result, mutated );


/* ------------ 3 ------------- */

rules = {
	content: 'text',
	num: {
		param: 'temp',
		get: ( temp ) => { return temp + 1 }
	}
};

config = {
	passOtherProps: true,
	// saveOrigin: true,
};

result = {
	content: 'Hello world',
	num: 124,
	obj: {
		test: 1
	}
};

mutated = ObjTransmute( obj, rules, config );

check( result, mutated );


/* ------------ 3 ------------- */

rules = {
	content: 'text',
	num: {
		param: 'none',
		default: 111,
		get: ( none ) => { return none + 1 }
	}
};

config = {
	passOtherProps: true,
	// saveOrigin: true,
};

result = {
	content: 'Hello world',
	num: 111,
	obj: {
		test: 1
	}
};

mutated = ObjTransmute( obj, rules, config );

check( result, mutated );



console.log( 'All good!' );


/* --------------------------------- Helpers --------------------------------- */

function check( result, mutated ) {
	for ( var i in result ) {
		if ( typeof result[ i ] == 'object' ) {
			check( result[ i ], mutated[ i ], true );
		} else if ( mutated[ i ] != result[ i ] ) {
			console.error( `Error in ${ index }: mutated[ ${ i } ] != result[ ${ i } ] => `, mutated[ i ], '!=', result[ i ] );
		}
	}
	if ( !arguments[ 2 ] ) index++;
}