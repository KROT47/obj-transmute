
/* --------------------------------- Required Modules --------------------------------- */

const Extend = require( 'extend' );


/* --------------------------------- Module Exports --------------------------------- */

module.exports = ObjTransmute;


/* --------------------------------- Default Config --------------------------------- */

// all function would be executed in context of { obj: obj, rules: rules }
const defaultConfig = {
		// whether to pass all other properties from obj to result object
		otherProps: false,

		// whether to save origin properties in result object if not defined
		saveOrigin: false,

		// default value for all values of not founded props ( if undefined - prop wont be added )
		default: undefined,

		// default function to get prop value
		// value - obj[ originProp ]
		// originProp - obj property name to get value from
		// prop - result property name
		get: function ( value, obj, originProp, prop ) { return value }
	};


/* --------------------------------- ObjTransmute --------------------------------- */

function ObjTransmute( obj, rules, config ) {

	obj = Extend( true, {}, obj );

	var result = {},
		context = { obj: obj, rules: rules, config: config, result: result },
		toDelete = [],
		requireLog = {},
		rule, prop, originProp, defaultValue, saveOrigin, require, requiredProp;

	config = extend( {}, defaultConfig, config );

	var props = Object.keys( rules );

	if ( config.otherProps ) {
		props = props.concat(
				Array.isArray ? Object.keys( obj ) : Object.getOwnPropertyNames( obj )
			);
	}

	// check that required properties is not in recursion
	function recursionCheck( prop, requiredProp, checkedProps ) {
		var checkArray = requireLog[ requiredProp ];

		if ( !checkArray ) return;

		checkedProps = checkedProps || [ prop ];
		checkedProps.push( requiredProp );

		if ( checkArray.indexOf( prop ) != -1 ) {
			checkedProps.push( prop );
			throw Error( `Recursion require error in stack ${checkedProps.join(' -> ')}` )
		}

		for ( var i = checkArray.length;  i--; ) {
			recursionCheck( prop, checkArray[ i ], checkedProps );
		}
	}

	// check that required property is ok
	function checkRequire( prop, requiredProp ) {
		recursionCheck( prop, requiredProp );

		if ( !requireLog[ prop ] ) requireLog[ prop ] = [];

		requireLog[ prop ].push( requiredProp );
	}

	// just getting needed value
	function get( getFunc, originProp, prop ) {
		return getFunc.call( context, obj[ originProp ], obj, originProp, prop );
	}

	function propHandler( prop, rule ) {
		originProp = null;

		switch ( typeof rule ) {

			case 'function': result[ prop ] = get( rule, prop, prop );
			break;

			case 'object':

				if ( require = rule.require ) {

					if ( !Array.isArray( require ) ) require = [ require ];

					for ( var i = require.length; i--; ) {
						
						requiredProp = require[ i ];

						if ( result[ requiredProp ] === undefined ) {

							if ( rules[ requiredProp ] === undefined ) {
								throw Error(
									`Required property '${requiredProp}' is not defined in rules`
								);
							}

							checkRequire( prop, requiredProp );

							propHandler( requiredProp, rules[ requiredProp ] );
						}
					}
				}

				originProp = rule.from || prop;

				if ( typeof rule.get == 'function' ) {
					result[ prop ] = get( rule.get, originProp, prop );
				}

				// try to set default
				if ( result[ prop ] === undefined ) {
					defaultValue = rule.default || config.default;

					if ( defaultValue !== undefined ) result[ prop ] = defaultValue;
				}

				// try to use default get()
				if ( result[ prop ] === undefined ) {
					result[ prop ] = get( config.get, originProp, prop );
				}

				// try to save origin prop if undefined
				saveOrigin = rule.saveOrigin !== undefined ? rule.saveOrigin : config.saveOrigin;
				if ( saveOrigin
					&& result[ originProp ] === undefined
					&& obj[ originProp ] !== undefined
				) {
					result[ originProp ] = obj[ originProp ];
				}
			break;

			// no rule - default pass prop
			case 'undefined':
				result[ prop ] = get( config.get, prop, prop );

				// try to set default
				if ( result[ prop ] === undefined && config.default !== undefined ) {
					result[ prop ] = config.default;
				}
			break;

			default: if ( !rule ) break;
				originProp = rule;

				result[ prop ] = get( config.get, originProp, prop );

				// try to save origin prop if undefined
				if ( config.saveOrigin
					&& result[ originProp ] === undefined
					&& obj[ originProp ] !== undefined
				) {
					result[ originProp ] = obj[ originProp ];
				}
		}

		if ( originProp && rules[ originProp ] === undefined &&
			( 
				!config.saveOrigin && !( rule && rule.saveOrigin )
				|| rule && rule.saveOrigin === false
			)
		) {
			toDelete.push( originProp );
		}
	}

	for ( var i = props.length; i--; ) {
		prop = props[ i ];
		rule = rules[ prop ];

		// if prop is already defined - go next
		if ( result[ prop ] !== undefined ) continue;

		propHandler( prop, rule );
	}

	for ( i = toDelete.length; i--; ) delete result[ toDelete[ i ] ];

	return result;
}


/* --------------------------------- Helpers --------------------------------- */

function extend( result ) {
	var obj, keys, i, k;

	for ( i = 1; i < arguments.length; ++i ) {
		obj = arguments[ i ];

		if ( typeof obj == 'object' && obj !== null ) {

			keys = Object.keys( obj );

			for ( k = keys.length; k--; ) result[ keys[ k ] ] = obj[ keys[ k ] ];
		}
	}

	return result;
}