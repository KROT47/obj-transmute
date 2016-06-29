
/* --------------------------------- Required Modules --------------------------------- */

const Extend = require( 'extend' );


/* --------------------------------- Module Exports --------------------------------- */

module.exports = ObjTransmute;


/* --------------------------------- Default Config --------------------------------- */

// all function would be executed in context of { obj: obj, rules: rules }
const defaultConfig = {
		// whether to pass all other properties from obj to result object
		passOtherProps: false,

		// whether to save origin properties in result object ( only when passOtherProps = true )
		saveOrigin: false,

		// runs before transmutation
		init: function () {}
	};


/* --------------------------------- ObjTransmute --------------------------------- */

function ObjTransmute( obj, rules, config ) {

	var mutagen = {},
		otherProps,
		context = { obj: obj, rules: rules },
		conf, param;

	config = Extend( {}, defaultConfig, config );

	config.init.call( context );

	if ( config.passOtherProps ) {
		otherProps = config.saveOrigin ? obj : Extend( true, {}, obj );
	} else {
		config.saveOrigin = true;
	}

	for ( var i in rules ) {
		conf = rules[ i ];

		param = null;

		switch ( typeof conf ) {

			case 'function': mutagen[ i ] = conf.call( context, obj );
			break;

			case 'object':
				if ( !conf.param ) throw Error( `Undefined param in config.${i}` );

				param = conf.param;

				if ( typeof conf.get == 'function' ) {
					if ( obj[ param ] ) mutagen[ i ] = conf.get.call( context, obj[ param ] );

				} else if ( obj[ param ] ) {
					mutagen[ i ] = obj[ param ];
				}

				if ( mutagen[ i ] === undefined && conf.default ) mutagen[ i ] = conf.default;
			break;

			default: mutagen[ i ] = obj[ param = conf ];
		}

		if ( !config.saveOrigin && param ) delete otherProps[ param ];
	}

	return Extend( true, {}, otherProps, mutagen );
}

/* --------------------------------- Rules Examples --------------------------------- */

// all function would be executed in context of { obj: obj, rules: rules }
// var rules = {
		// text: 'text',

		// content: 'text',
		// or
		// content: { param: 'text' },

		// content: function ( obj ) { return obj.text || 'Hello World' },

		// content: {
		// 	param: 'text',
		// 	default: 'Hello world!',
		// 	get: ( text ) => { return `This is text: ${text}` }
		// },

		// created_at: { default: 'NOW()' },
	// };