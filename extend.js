
/* --------------------------------- Module Exports --------------------------------- */

module.exports = Extend;


/* ------------ Extend helpers ------------- */

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

function isArray( arr ) {
    if ( typeof Array.isArray === 'function' ) return Array.isArray( arr );

    return toStr.call( arr ) === '[object Array]';
};

function isPlainObject( obj ) {
    if ( !obj || toStr.call( obj ) !== '[object Object]' ) return false;

    var hasOwnConstructor = hasOwn.call( obj, 'constructor' );
    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call( obj.constructor.prototype, 'isPrototypeOf' );
    // Not own constructor property must be Object
    if ( obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf ) {
        return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for ( key in obj ) { /**/ }

    return typeof key === 'undefined' || hasOwn.call( obj, key );
};

/**
 * Default extend function
 */
function Extend() {
    var options, name, src, copy, copyIsArray, clone, names, k,
        target = arguments[ 0 ],
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === 'boolean' ) {
        deep = target;
        target = arguments[ 1 ] || {};
        // skip the boolean and the target
        i = 2;
    } else if ( ( typeof target !== 'object' && typeof target !== 'function' ) || target == null ) {
        target = {};
    }

    for ( ; i < length; ++i ) {
        options = arguments[ i ];
        // Only deal with non-null/undefined values
        if ( options != null ) {

            names = Object.getOwnPropertyNames( options );

            // Extend the base object
            for ( k = names.length; k--; ) {
                name = names[ k ];
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target !== copy ) {
                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy
                        && ( isPlainObject( copy ) || ( copyIsArray = isArray( copy ) ) )
                        && copy !== options
                    ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && isArray( src ) ? src : [];
                        } else {
                            clone = src && isPlainObject( src ) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = Extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( typeof copy !== 'undefined' ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
    }

    // Return the modified object
    return target;
}