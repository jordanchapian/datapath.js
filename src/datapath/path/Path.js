define('path/Path',
[
	'util/is',
	'util/set',
	'info',

	'path/VirtualRoute',

	'path/pipeline/Filler',
	'path/pipeline/Formatter',
	'path/pipeline/Subset',
	'path/pipeline/Transform',

	'option/cacheDefault'
],
function(is, set, info, VirtualRoute, Filler, Formatter, Subset, Transform, cacheDefault){

	function Path(key, routeTemplate, configuration){

		this._ = {};//protected instance namespace
		this._.key = key;

		//virtual route
		this._.route = (new VirtualRoute(routeTemplate || ''));

		//cache size for this path (start with default)
		this._.cacheSize = cacheDefault.cacheSize;

		//pipeline memory
		this._.pipeline = {
			formatter:null,
			filler:[],
			subset:{},
			transform:{}
		};

	}

	Path.prototype.setRoute = function(routeTemplate){

		if(is.String(routeTemplate) === false){
			info.warn('setRoute requires a string as an argument. Ignoring this request. Behavior is undefined.');
			return this;
		}

		this._.route = (new VirtualRoute(routeTemplate));

		return this;

	};

	/*----------  Formatter Operations  ----------*/
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

	/*----------  Filler Operations  ----------*/
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


	/*----------  Subset Operations  ----------*/
	
	//multi level add API

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

	/*----------  Transform Operation  ----------*/

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


	/*----------  Configure hooks  ----------*/
	Path.prototype.setCacheSize = function(size, omitEvents){
		//defend input
		if(size === undefined || is.Number(size) === false || size < 1){
			infoLog.error("Not providing a {number >= 1} size for [setCacheSize]. Action Ignored.");
			return;
		}

		//we have changed the local cache size configuration, 
		//we can emit this event internally, then externally.
		if(!omitEvents && cacheSize[datapath] !== size)
		{

		}

		//change the configuration
		this._.cacheSize = size;
	};

	Path.prototype.getCacheSize = function(){

		return this._.cacheSize;

	};

	/*----------  utilities  ----------*/
	
	//alias this class in factories
	return Path;
});