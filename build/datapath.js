
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module 
        //in another project. That other project will only 
        //see this AMD call, not the internal modules in 
        //the closure below. 
        define([], factory);
    } else if (typeof exports != 'undefined' && !exports.nodeType){

        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = factory();
        }

        exports.datapath = factory();
    }
    else{
        //Browser globals case. Just assign the 
        //result to a property on the global. 
        root.datapath = factory();
    }
}(this, function () {/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../../node_modules/almond/almond", function(){});

define('parameter/collection', 
[

],
function(datapath){

	var parameterMap = {};

	var api = {};

	api.set = function(key, value){
		parameterMap[key] = value;
	};

	api.get = function(key){
		return parameterMap[key];
	};

	return api;
});
define('util/is', [],
{
	Integer : function(val) {
		return (isNumber(val) && Math.floor(val) == val);
	},

	Undefined : function(obj){
		return obj === void 0;
	},

	Number : function(val) {
		return (typeof val == "number");
	},

	String : function(obj){
		return (typeof obj == "string");
	},

	Boolean : function(obj) {
		return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	},

	Object : function(obj) {
		var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
	},

	Array : function(val) {
		return (val instanceof Array);
	},

	Function : function(val) {
		return (typeof val == "function");
	},

	Date : function(val) {
		return (Object.prototype.toString.call(val) === "[object Date]");
	}
});

define('util/set', [],
{
	values:function(obj){
		var output = [];
		for (var key in obj) {
		    if (Object.prototype.hasOwnProperty.call(obj, key)) {
		        output.push(obj[key]);
		    }
		}

		return output;
	},
	argsToArray:function(argumentObject){
		var outputArray = [];

		for(var i = 0; i < argumentObject.length; i++){
			outputArray.push(argumentObject[i]);
		}

		return outputArray;
	}
});
define('option/info',[],
{
	
	logPrefix : 'datamodel::',
	logEnabled : true
	
});
define('info',
['util/is', 'option/info'],
function(is, infoOptions){
	var info = {};

	info.warn = function(message){
		if(!canSendLog(message))return;
		//carry through with request, appending prefix to message
		console.warn( infoOptions.logPrefix + '  ' + message );
	};

	info.error = function(message){
		if(!canSendLog(message))return;
		//carry through with request, appending prefix to message
		console.error( infoOptions.logPrefix + '  ' + message );
	};

	info.log = function(message){
		if(!canSendLog(message))return;
		//carry through with request, appending prefix to message
		console.log( infoOptions.logPrefix + '  ' + message );
	};

	function canSendLog(message){
		//Check if we have logging enabled
		if(infoOptions.logEnabled === false) return false;
		//check to see if this is a valid message
		else if(!is.String(message)) return false;
		else return true;
	}

	return info;
});
define('path/VirtualRoute',
[
	'util/is',
	'util/set',
	'info'
],
function(is, set, info){
	
	function VirtualRoute(route){
		//internal memory
		this._ = {
			route:route,

			paramIndex:{},
			routeConstructor:[]
		};

		//init the component
		generateRouteStructure(this, route);
	}
	VirtualRoute.prototype.getParameterKeys = function(){
		return Object.keys(this._.paramIndex);
	};

	VirtualRoute.prototype.generateURL = function(paramMap){
		//clone the route template
		var rRoute = this._.routeConstructor.slice(0);

		//cycle the provided param map and fill in the rRoute
		for(var paramKey in paramMap){
			//do not worry about params provided that are not relevant to route
			var indexes = this._.paramIndex[paramKey]
			if(indexes === undefined)continue;

			var paramValue = paramMap[paramKey];
			for(var i=0; i < indexes.length; i++){
				rRoute[indexes[i]] = formatDataForURL(paramValue);
			}
		}

		//join the constructed path
		return rRoute.join('');
	}

	/*----------  utilities  ----------*/
	function formatDataForURL(datum){
		return datum;
	}

	//params are now flat no distinction between query and route params
	function generateRouteStructure(self, route){
		var params = route.match(/:[\w\d]+/g),
				paramIndex = {},
				routeStructure = route.split(/:[\w\d]+/g);

		//generate a parameter map if there are params found
		if(params){
			var i = 1, p;
			while(p = params.shift()){
				//remove the colon
				p = p.slice(1);

				//insert an empty sting placeholder for the param
				routeStructure.splice(i, 0,'');

				//ensure the param map is an array
				paramIndex[p] = paramIndex[p] || [];

				//push the index into the paramMap
				paramIndex[p].push(i);

				//increment our count
				i+=2;
			}
		}

		//expose results
		self._.paramIndex = paramIndex;
		self._.routeConstructor = routeStructure;
	}
	

	//alias this class in factories
	return VirtualRoute;

});


define('path/pipeline/Filler',
[
],
function(){

	function Filler(fn){
		
	}

	Filler.prototype.run = function(dataset){
		this.getFn()(dataset);
	};

	//alias this class in factories
	return Filler;

});

define('path/pipeline/Formatter',
[
],
function(){
	//formatter just passes entities
	function Formatter(fn){
		//defend input

		this.getFn = function(){
			return fn;
		};
	}

	Formatter.prototype.run = function(dataset){
		
		var formatter = this.getFn();

		dataset.forEach(function(datum){
			formatter(datum);
		});

	};

	//alias this class in factories
	return Formatter;

});

define('path/pipeline/Subset',
[
],
function(){

	function Subset(key, fn){
		//defend input

		this.getKey = function(){
			return key;
		};

		this.getFn = function(){
			return fn;
		};
	}

	Subset.prototype.run = function(data){
		return data.filter(this.getFn());
	};

	//alias this class in factories
	return Subset;

});
define('path/pipeline/Transform',
[

],
function(){

	function Transform(key, fn){

		this.getKey = function(){
			return key;
		};

		this.getFn = function(){
			return fn;
		};
		
	}

	Transform.prototype.run = function(data){
		return this.getFn()(data);
	};

	//alias this class in factories
	return Transform;

});

define('option/cacheDefault',[],
{

	cacheSize:1

});
/**
	Credit to:
	promiscuous-©Ruben Verborgh
*/

define('util/Promise',[],
function(){
	var func = 'f',
			obj = 'o';

  // Type checking utility function
  function is(type, item) { return (typeof item)[0] == type; }

  // Creates a promise, calling callback(resolve, reject), ignoring other parameters.
  function Promise(callback, handler) {
    // The `handler` variable points to the function that will
    // 1) handle a .then(resolved, rejected) call
    // 2) handle a resolve or reject call (if the first argument === `is`)
    // Before 2), `handler` holds a queue of callbacks.
    // After 2), `handler` is a finalized .then handler.
    handler = function pendingHandler(resolved, rejected, value, queue, then, i) {
      queue = pendingHandler.q;

      // Case 1) handle a .then(resolved, rejected) call
      if (resolved != is) {
        return Promise(function (resolve, reject) {
          queue.push({ p: this, r: resolve, j: reject, 1: resolved, 0: rejected });
        });
      }

      // Case 2) handle a resolve or reject call
      // (`resolved` === `is` acts as a sentinel)
      // The actual function signature is
      // .re[ject|solve](<is>, success, value)

      // Check if the value is a promise and try to obtain its `then` method
      if (value && (is(func, value) | is(obj, value))) {
        try { then = value.then; }
        catch (reason) { rejected = 0; value = reason; }
      }
      // If the value is a promise, take over its state
      if (is(func, then)) {
        function valueHandler(resolved) {
          return function (value) { then && (then = 0, pendingHandler(is, resolved, value)); };
        }
        try { then.call(value, valueHandler(1), rejected = valueHandler(0)); }
        catch (reason) { rejected(reason); }
      }
      // The value is not a promise; handle resolve/reject
      else {
        // Replace this handler with a finalized resolved/rejected handler
        handler = function (Resolved, Rejected) {
          // If the Resolved or Rejected parameter is not a function,
          // return the original promise (now stored in the `callback` variable)
          if (!is(func, (Resolved = rejected ? Resolved : Rejected)))
            return callback;
          // Otherwise, return a finalized promise, transforming the value with the function
          return Promise(function (resolve, reject) { finalize(this, resolve, reject, value, Resolved); });
        };
        // Resolve/reject pending callbacks
        i = 0;
        while (i < queue.length) {
          then = queue[i++];
          // If no callback, just resolve/reject the promise
          if (!is(func, resolved = then[rejected]))
            (rejected ? then.r : then.j)(value);
          // Otherwise, resolve/reject the promise with the result of the callback
          else
            finalize(then.p, then.r, then.j, value, resolved);
        }
      }
    };
    // The queue of pending callbacks; garbage-collected when handler is resolved/rejected
    handler.q = [];

    // Create and return the promise (reusing the callback variable)
    callback.call(callback = { then:  function (resolved, rejected) { return handler(resolved, rejected); },
                               catch: function (rejected)           { return handler(0,        rejected); } },
                  function (value)  { handler(is, 1,  value); },
                  function (reason) { handler(is, 0, reason); });
    return callback;
  }

  // Finalizes the promise by resolving/rejecting it with the transformed value
  function finalize(promise, resolve, reject, value, transform) {
    setTimeout(function () {
      try {
        // Transform the value through and check whether it's a promise
        value = transform(value);
        transform = value && (is(obj, value) | is(func, value)) && value.then;
        // Return the result if it's not a promise
        if (!is(func, transform))
          resolve(value);
        // If it's a promise, make sure it's not circular
        else if (value == promise)
          reject(TypeError());
        // Take over the promise's state
        else
          transform.call(value, resolve, reject);
      }
      catch (error) { reject(error); }
    });
  }

  // Creates a resolved promise
  Promise.resolve = ResolvedPromise;
  function ResolvedPromise(value) { return Promise(function (resolve) { resolve(value); }); }

  // Creates a rejected promise
  Promise.reject = function (reason) { return Promise(function (resolve, reject) { reject(reason); }); };

  // Transforms an array of promises into a promise for an array
  Promise.all = function (promises) {
    return Promise(function (resolve, reject, count, values) {
      // Array of collected values
      values = [];
      // Resolve immediately if there are no promises
      count = promises.length || resolve(values);
      // Transform all elements (`map` is shorter than `forEach`)
      promises.map(function (promise, index) {
        ResolvedPromise(promise).then(
          // Store the value and resolve if it was the last
          function (value) {
            values[index] = value;
            --count || resolve(values);
          },
          // Reject if one element fails
          reject);
      });
    });
  };

  // Export the main module
  return Promise;

});
define('path/cache/data/Data',
[
],
function(){
	
		function Data(Datapath, rawData){

			//apply fillers and formatters
			applyFormatter(Datapath, rawData);
			applyFiller(Datapath, rawData);

			//extend an array-like object to provide interface into the data
			var collection = Object.create( Array.prototype );
			collection = (Array.apply( collection, rawData ) || collection);

			var transformData = initTransforms(Datapath, rawData),
					subsetData = initSubsets(Datapath, rawData);

			collection.subset = function(subsetKey){
				return subsetData[subsetKey];
			};

			collection.transform = function(transformKey){
				return transformData[transformKey];
			};

			return collection;
		}

		/*----------  static methods  ----------*/
		Data.injectClassMethods = function( collection ){

	      // Loop over all the prototype methods and add them
	      // to the new collection.
	      for (var method in Data.prototype){

	          // Make sure this is a local method.
	          if (Data.prototype.hasOwnProperty( method )){

	              // Add the method to the collection.
	              collection[ method ] = Data.prototype[ method ];

	          }

	      }

	      // Return the updated collection.
	      return( collection );

	  };

	  /*----------  class methods  ----------*/
	  

		/*----------  utils  ----------*/

		function initTransforms(Datapath, rawData){
			var r = {};

			Datapath.getTransform().forEach(function(transformInstance){
				r[transformInstance.getKey()] = transformInstance.run(rawData);
			});

			return r;
		}

		function initSubsets(Datapath, rawData){
			var r = {};

			Datapath.getSubset().forEach(function(subsetInstance){
				r[subsetInstance.getKey()] = subsetInstance.run(rawData);
			});

			return r;
		}

		//in place formatting
		function applyFormatter(Datapath, data){
			if(Datapath.getFormatter() === null) return;

			Datapath.getFormatter().run(data);
		}

		//in place filling
		function applyFiller(Datapath, data){
			if(Datapath.getFiller().length === 0) return;
			Datapath.getFiller().forEach(function(fillerInstance){
				fillerInstance.run(data);
			});
		}


		return Data;
});

define('path/cache/data/DataFrame',
[
	'util/is',
	'util/Promise',

	'./Data',
	'parameter/collection'
],
function(is, Promise, Data, parameterCollection){

	//the data frame is an association between a dataset and a parameter set
	function DataFrame(datapath){
		//private namespace
		this._ = {};

		//datapath
		this._.datapath = datapath;

		//the datapath (needs to be injected with data)
		this._.data = new Data(datapath, []);

		//param map (what state is this data frame relative to)
		this._.param = {};
		this._.paramKeys = datapath._.route.getParameterKeys();

		init(this);
	}

	DataFrame.prototype.fill = function(cb){
		var self = this;
		console.log('filling');
		return new Promise(function(resolve, reject){
			//if we need to fill, take the async action, if not, immediately respond

			//get the data
			//--- --- ---
			//then inject into Data wrapper
			self._.data = new Data(self._.datapath, ['this', 'is', 'the', 'dataset']);
			resolve(self._.data);
		});
	};

	DataFrame.prototype.getData = function(){
		return this._.data;
	};
	
	//do the parameter values associated with this frame reflect the current param state
	DataFrame.prototype.parametersValid = function(){
		//get the parameter keys from  the route attached to the path
		var paramKeys = this._.datapath._.route.getParameterKeys();

		//go through each of our parameter keys and ensure that each value associated
		//with this frame is consistent to the current set parameters
		for(var i = 0; i < paramKeys.length; i++){
			var paramKey = paramKeys[i];

			var p0 = this._.param[paramKey];
			var p1 = parameterCollection.get(paramKey);

			console.log(p0,p1);
			if(paramsEqual(p0, p1) === false) return false;
		}

		return true;
	};

	function init(self){
		//get the parameter keys from  the route attached to the path
		var paramKeys = self._.datapath._.route.getParameterKeys();

		//grab the most recent param state. That is what this frame will anchor to.
		paramKeys.forEach(function(paramKey){
			self._.param[paramKey] = parameterCollection.get(paramKey);
		});
	}
	

	//this needs to be tested
	function paramsEqual(p0, p1){
		//---- date cases ----//
		//inconsistent types
		if(is.Date(p0) && !is.Date(p1) || !is.Date(p0) && is.Date(p1)) return false;
		//both dates, and times are not equal
		else if(is.Date(p0) && is.Date(p1) && (p1.getTime !== p2.getTime())) return false;
		//---- string cases ----//
		//---- boolean cases ----//
		//TODO:remaining cases?

		//---- catch remaining cases with strict equality ----// (TODO:test)		
		else if(p0 === p1) return true;
		//everything must be ok.
		else return false;
	}

	return DataFrame;

});

define('path/cache/Cache',
[
	'option/cacheDefault',
	'./data/DataFrame',
	'util/is'
],
function(cacheDefault, DataFrame, is){

	function Cache(datapath){
		//private instance namespace
		this._ = {};

		//dataframes, ordered from recent to oldest
		this._.dataframes = [new DataFrame(datapath)];
		this._.capacity = cacheDefault.cacheSize;

		//reference to the datapath object associated with this cache
		this._.datapath = datapath;
	}

	Cache.prototype.setSize = function(size){
		if(is.Number(size) && size >= 1){
			this._.capacity = size;

			//we have changed the local cache size configuration, 
			//we can emit this event internally, then externally.
			// if(!omitEvents && this._.cacheSize !== size)
			// {

			// }

		}
	};

	Cache.prototype.activeDataFrame = function(){
		return (this._.dataframes.length > 0) ? this._.dataframes[0] : undefined;
	};

	Cache.prototype.isCacheFull = function(){
		return (this._.capacity === this._.dataframes.length);
	};

	Cache.prototype.cacheOverflow = function(){
		return (this._.capacity < this._.dataframes.length);
	};

	//remove entire cache
	Cache.prototype.clearDataframes = function(){
		this._.dataframes = [];
	};

	Cache.prototype.sync = function(cb){ //should return promise
		var validIndex;

		//if we have a valid frame already, we need to put it in the front of the array, and no datafetch required
		if( (validIndex = validFrameIndex(this)) > -1 ){
			this._.dataframes.splice(0, 0, this._.dataframes.splice(validIndex, 1)[0]);
			return Promise.resolve(this._.dataframes[0].getData());
		}
		//we must add a new frame.
		else{
			this._.dataframes.splice(0,0, new DataFrame(this._.datapath) );

			//remove an old frame if we've overflowed
			if(this.cacheOverflow()){
				this._.dataframes.splice((this._.dataframes.length - 1), 1);
			}

			//now we can request our dataframe to fill it's dataset from remote
			return this._.dataframes[0].fill();
		}
	};

	/*----------  utils  ----------*/
	function validFrameIndex(self){

		for(var i=0; i < self._.dataframes.length; i++){
			if(self._.dataframes[i].parametersValid()) return i;
		}

		return -1;
	}

	/*----------  Expose  ----------*/
	
	return Cache;
});

define('path/Path',
[
	'util/is',
	'util/set',
	
	'info',

	'./VirtualRoute',

	'./pipeline/Filler',
	'./pipeline/Formatter',
	'./pipeline/Subset',
	'./pipeline/Transform',

	'./cache/Cache'
],
function(is, set, info, VirtualRoute, Filler, Formatter, Subset, Transform, Cache, Promise){

	function Path(key, routeTemplate, configuration){

		this._ = {};//protected instance namespace

		//accessor key
		this._.key = key;

		//virtual route
		this._.route = (new VirtualRoute(routeTemplate || ''));

		//pipeline memory
		this._.pipeline = {
			formatter:null,
			filler:[],
			subset:{},
			transform:{}
		};

		this._.cache = new Cache(this);
	}

	/*=============================
	=            Route            =
	=============================*/
	
	Path.prototype.setRoute = function(routeTemplate){

		if(is.String(routeTemplate) === false){
			info.warn('setRoute requires a string as an argument. Ignoring this request. Behavior is undefined.');
			return this;
		}

		this._.route = (new VirtualRoute(routeTemplate));

		return this;

	};
	
	/*=====  End of Route  ======*/
	
	
	/*=============================
	=            Cache            =
	=============================*/
	Path.prototype.setCacheSize = function(size){
		//defend input
		if(size === undefined || is.Number(size) === false || size < 1){
			infoLog.error("Not providing a {number >= 1} size for [setCacheSize]. Action Ignored.");
			return;
		}

		//change the configuration
		this._.cache.setSize(size);

		//return prototype api
		return this;
	};

	/*=====  End of Cache  ======*/


	/*============================
	=            Data            =
	============================*/

	Path.prototype.getData = function(){
		return this._.cache.activeDataFrame().getData();
	};

	Path.prototype.sync = function(cb){
		return this._.cache.sync(this._.key);
	};

	/*=====  End of Data  ======*/
	


	/*=================================
	=            Formatter            =
	=================================*/
	
	Path.prototype.getFormatter = function(){
		return this._.pipeline.formatter;
	};

	Path.prototype.hasFormatter = function(){
		return (this._.pipeline.formatter !== null);
	};

	Path.prototype.addFormatter = function(fn){

		//Are there any arguments?
		if(fn === undefined){
			info.warn("Calling [Path].addFormatter with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(is.Function(fn) === false){
			info.warn("Calling [Path].addFormatter an argument other than a function. No action was taken.");

			return this;
		}
		//is the user attempting to overwrite a previously defined formatter on this datapath?
		else if(this.hasFormatter()){
			info.warn("Calling [Path].addFormatter caused Datasync to overwrite a formatter. Action was taken.");
		}

		//take the action
		this._.pipeline.formatter = (new Formatter(fn));

		return this;
	};
	
	/*=====  End of Formatter  ======*/



	/*==============================
	=            Filler            =
	==============================*/
	
	Path.prototype.getFiller = function(){
		return this._.pipeline.filler;
	};
	
	Path.prototype.hasFiller = function(){
		return (this._.pipeline.filler.length !== 0);
	};

	Path.prototype.addFiller = function(fn){
		//Are there any arguments?
		if(fn === undefined){
			info.warn("Calling [Path].addFiller with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(is.Function(fn) === false){
			info.warn("Calling [Path].addFiller an argument other than a function. No action was taken.");

			return this;
		}

		//2] take the action
		this._.pipeline.filler.push((new Filler(fn)));

		return this;
	};
	
	/*=====  End of Filler  ======*/
	



	/*==============================
	=            Subset            =
	==============================*/
	function addSubset_ml(self, name){
		return function(fn){
			return addSubset(self, name, fn);
		};
	}

	//single level add API (Used by multilevel)
	function addSubset(self, name, fn){
		//defend input
		if(is.String(name) === false){
			info.warn('Attempting to add a subset with an identifier that is not a string. The request was ignored. Operation will not be as expected.');
			return self;
		}
		else if(is.Function(fn) === false){
			info.warn('Attempting to add a subset['+name+'] with an invalid predicate. Expecting a predicate of type [Function]');
			return self;
		}
		//is this overwriting another subset? (non breaking)
		else if(self._.pipeline.subset[name] !== undefined){
			info.warn('Providing multiple definitions for subset ['+name+']. Took the action.');
		}

		//take action
		self._.pipeline.subset[name] = (new Subset(name, fn));

		return self;
	}

	//add public facing interface
	Path.prototype.getSubset = function(key){
		if(key === undefined) return set.values(this._.pipeline.subset);
		else return this._.pipeline.subset[key];
	};

	Path.prototype.addSubset = function(subsetName, fn){

		//do we have valid input?
		if(subsetName === undefined){
			info.warn("Calling [Path].addSubset with no arguments. No action was taken.");
			return this;
		}
		//are we using single level accessor?
		else if(fn !== undefined)
			return addSubset(this, subsetName, fn);
		//they must want a multi-level accessor
		else
			return addSubset_ml(this, subsetName);

	};
	
	
	/*=====  End of Subset  ======*/
	


	/*=================================
	=            Transform            =
	=================================*/
	
	function addTransform_ml(self, name){
		return function(fn){
			return addTransform(self, name, fn);
		};
	}

	//single level add API (Used by multilevel)
	function addTransform(self, name, fn){
		
		//is name valid?
		if(is.String(name) === false){
			info.warn('Attempting to add a transform with an identifier that is not a string. The request was ignored. Operation will not be as expected.');
			return self;
		}
		//is fn valid?
		else if(is.Function(fn) === false){
			info.warn('Attempting to add a transform['+name+'] with an invalid transform. Expecting a transform of type [Function]. The request was ignored. Operation will not be as expected.');
			return self;
		}
		//is this overwriting another transform? (non breaking)
		else if(self._.pipeline.transform[name] !== undefined){
			info.warn('Providing multiple definitions for transform ['+name+']. Took the action.');
		}

		//take action
		self._.pipeline.transform[name] = (new Transform(name, fn));

		return self;
	}

	//add public facing interface
	Path.prototype.addTransform = function(name, fn){

		//do we have valid input?
		if(name === undefined){
			info.warn("Calling [Path].addTransform with no arguments. No action was taken.");
			return this;
		}
		//are we using single level accessor?
		else if(fn !== undefined)
			return addTransform(this, name, fn);
		//they must want a multi-level accessor
		else
			return addTransform_ml(this, name);

	};

	Path.prototype.getTransform = function(key){
		if(key === undefined) return set.values(this._.pipeline.transform);
		else return this._.pipeline.transform[key];
	};
	
	/*=====  End of Transform  ======*/
	
	
	
	return Path;
});
define('path/collection',
[
	'util/is',
	'util/set',
	'info',
	'./Path'
],
function(is, set, info, Path){
	var datapathMap = {};
		
	var api = {};

	api.add = function(pathKey, pathTemplate){
		
		//defend input (must have at least a path key to complete action)
		if(pathKey === undefined || is.String(pathKey) === false){
			info.error('addPath Requries that at least a path key is provided. No recovery.');
			return;
		}
		else if(pathTemplate !== undefined && is.String(pathTemplate) === false){
			info.error('addPath Requries that the provided pathTemplate is a string. No recovery.');
			return;
		}
		//atempting to make multiple definitions with same key
		else if(datapathMap[pathKey] !== undefined){
			info.warn('Provided multiple definitions for datapath key ['+pathKey+']. Behavior is not predictable.');
		}

		return (datapathMap[pathKey] = new Path(pathKey, pathTemplate));
	};

	api.get = function(key){
		if(key === undefined)return set.values(datapathMap);
		else return datapathMap[key];
	};

	return api;

});

define('datapath',
[
	'parameter/collection',
	'path/collection',
	'util/is'
],
function(parameterCollection, pathCollection, is){
	function DatapathPublicApi(pathname){
		var requestedPaths = pathCollection.get(pathname);

		if(requestedPaths === undefined && pathname !== undefined){
			return pathCollection.add(pathname);
		}	
		else return requestedPaths;

	}

	/*----------  static extensions  ----------*/
	DatapathPublicApi.parameter = function(name){

		return {

			set:function(value){
				return parameterCollection.set(name, value);
			},

			reset:function(){
				return parameterCollection.set(name, undefined);
			},

			get:function(){
				return parameterCollection.get(name);
			}

		};

	};

	
	return DatapathPublicApi;
});

	//above
    return require('datapath');
}));