
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
		get: function ( value, originProp, obj, prop ) { return value }
	};


/* --------------------------------- ObjTransmute --------------------------------- */

function ObjTransmute( obj, rules, config ) {

	var result = {},
		context = { obj: obj, rules: rules },
		rule, prop, originProp, getProp, defaultValue, saveOrigin, toDelete = [];

	config = extend( {}, defaultConfig, config );

	var props = Object.keys( rules );

	if ( config.otherProps ) {
		props = props.concat(
				Array.isArray ? Object.keys( obj ) : Object.getOwnPropertyNames( obj )
			);
	}

	for ( var i = props.length; i--; ) {
		prop = props[ i ];
		rule = rules[ prop ];

		// if prop is already defined - go next
		if ( result[ prop ] !== undefined ) continue;

		originProp = null;

		switch ( typeof rule ) {

			case 'function': result[ prop ] = rule.call( context, obj, result );
			break;

			case 'object':
				if ( !rule.prop ) throw Error( `Undefined prop in ruleConfig.${prop}` );

				originProp = rule.prop;

				getProp = rule.get || config.get;

				if ( typeof getProp == 'function' && obj[ originProp ] ) {
					result[ prop ] = 
						getProp.call( context, obj[ originProp ], originProp, obj, prop );
				}

				// try to set default
				if ( result[ prop ] === undefined ) {
					defaultValue = rule.default || config.default;

					if ( defaultValue !== undefined ) result[ prop ] = defaultValue;
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
				result[ prop ] = config.get.call( context, obj[ prop ], prop, obj, prop );

				// try to set default
				if ( result[ prop ] === undefined && config.default !== undefined ) {
					result[ prop ] = config.default;
				}
			break;

			default: if ( !rule ) break;
				originProp = rule;

				result[ prop ] = 
					config.get.call( context, obj[ originProp ], originProp, obj, prop );

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

/* --------------------------------- Rules Examples --------------------------------- */

// all function would be executed in context of { obj: obj, rules: rules }
// var rules = {
		// text: 'text',

		// content: 'text',
		// or
		// content: { prop: 'text' },

		// content: function ( obj, result ) { return obj.text || 'Hello World' },

		// content: {
		// 	prop: 'text',
		// 	default: 'Hello world!',
		// 	get: ( text ) => { return `This is text: ${text}` }
		// },

		// created_at: { default: 'NOW()' },
	// };