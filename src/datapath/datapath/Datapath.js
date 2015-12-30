define('datapath/Datapath',
[
	'util/is',
	'util/set',
	'info',

	'datapath/VirtualRoute',

	'datapath/pipeline/Filler',
	'datapath/pipeline/Formatter',
	'datapath/pipeline/Subset',
	'datapath/pipeline/Transform'
],
function(is, set, info, VirtualRoute, Filler, Formatter, Subset, Transform){

	function Datapath(key, routeTemplate, configuration){

		this._ = {};//protected instance namespace
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

	}

	Datapath.prototype.setRoute = function(routeTemplate){

		if(is.String(routeTemplate) === false){
			info.warn('setRoute requires a string as an argument. Ignoring this request. Behavior is undefined.');
			return this;
		}

		this._.route = (new VirtualRoute(routeTemplate));

		return this;

	};

	/*----------  Formatter Operations  ----------*/
	Datapath.prototype.getFormatter = function(){
		return this._.pipeline.formatter;
	};

	Datapath.prototype.hasFormatter = function(){
		return (this._.pipeline.formatter !== null);
	};

	Datapath.prototype.addFormatter = function(fn){

		//Are there any arguments?
		if(fn === undefined){
			info.warn("Calling [Datapath].addFormatter with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(is.Function(fn) === false){
			info.warn("Calling [Datapath].addFormatter an argument other than a function. No action was taken.");

			return this;
		}
		//is the user attempting to overwrite a previously defined formatter on this datapath?
		else if(this.hasFormatter()){
			info.warn("Calling [Datapath].addFormatter caused Datasync to overwrite a formatter. Action was taken.");
		}

		//take the action
		this._.pipeline.formatter = (new Formatter(fn));

		return this;
	};

	/*----------  Filler Operations  ----------*/
	Datapath.prototype.getFiller = function(){
		return this._.pipeline.filler;
	};
	
	Datapath.prototype.hasFiller = function(){
		return (this._.pipeline.filler.length !== 0);
	};

	Datapath.prototype.addFiller = function(fn){
		//Are there any arguments?
		if(fn === undefined){
			info.warn("Calling [Datapath].addFiller with no arguments. No action was taken.");

			return this;
		}
		//has the user provided a function as an argument to this function?
		else if(is.Function(fn) === false){
			info.warn("Calling [Datapath].addFiller an argument other than a function. No action was taken.");

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
	Datapath.prototype.getSubset = function(key){
		if(key === undefined) return set.values(this._.pipeline.subset);
		else return this._.pipeline.subset[key];
	};

	Datapath.prototype.addSubset = function(subsetName, fn){

		//do we have valid input?
		if(subsetName === undefined){
			info.warn("Calling [Datapath].addSubset with no arguments. No action was taken.");
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
	Datapath.prototype.addTransform = function(name, fn){

		//do we have valid input?
		if(name === undefined){
			info.warn("Calling [Datapath].addTransform with no arguments. No action was taken.");
			return this;
		}
		//are we using single level accessor?
		else if(fn !== undefined)
			return addTransform(this, name, fn);
		//they must want a multi-level accessor
		else
			return addTransform_ml(this, name);

	};

	Datapath.prototype.getTransform = function(key){
		if(key === undefined) return set.values(this._.pipeline.transform);
		else return this._.pipeline.transform[key];
	};


	/*----------  Configure hooks  ----------*/
	Datapath.prototype.setCacheSize = function(size){
		config.cacheSize.set(this._.key, size);
		
		return this;
	};

	/*----------  utilities  ----------*/
	
	//alias this class in factories
	return Datapath;
});