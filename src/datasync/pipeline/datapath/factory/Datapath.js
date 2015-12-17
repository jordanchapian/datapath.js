(function(datapathFactories, fillerFactories, formatterFactories, is, info){

	function Datapath(key, routeTemplate){

		//instance memory
		this._pipeline = {
			formatter:null,
			filler:[],
			subset:[],
			transform:[],
			route: (new datapathFactories.VirtualRoute(routeTemplate))
		};

	}

	//TODO:remove this...
	Datapath.prototype._ = {};

	/*----------  Formatter Operations  ----------*/
	Datapath.prototype.getFormatter = function(){
		return this_pipeline.formatter;
	};

	Datapath.prototype.hasFormatter = function(){
		return (this._pipeline.formatter !== null);
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
		this._pipeline.formatter = (new formatterFactories.Formatter(fn));

		return this;
	};

	/*----------  Filler Operations  ----------*/
	Datapath.prototype.getFiller = function(){
		return this_pipeline.filler;
	};
	
	Datapath.prototype.hasFiller = function(){
		return (this._pipeline.filler.length !== 0);
	};

	Datapath.prototype.addFiller = function(fn){
		//1] defend the input

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
		this._pipeline.filler.push((new fillerFactories.Filler(fn)));

		return this;
	};


	/*----------  Subset Operations  ----------*/
	
	//multi level add API

	function addSubset_ml(self, name){
		return function(fn){
			//what is the scope here?? TODO: test if i actually need self.
			return addSubset(name, fn);
		};
	}

	//single level add API (Used by multilevel)
	function addSubset(self, name, fn){
		console.log('single level add')

		return self;
	}

	//add public facing interface
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
	
	Datapath.prototype.addTransform = function(){
		return this;
	};


	/*----------  utilities  ----------*/
	// function getRequestedParams(route){
	// 		return route.match(/:[\w\d]+/g);
	// 	}	
	// 	function fillInQueryParams(route){
	// 		return route;
	// 	}
	// 	function requiredQueryParams(route){
	// 		return _.map(getRequestedParams((route.split('?')[1] || '')), function(e){return e.slice(1);});
	// 	}

	// 	function requiredRouteParams(route){
	// 		return _.map(getRequestedParams(route.split('?')[0]), function(e){return e.slice(1);});
	// 	}
	// function getDynamicQueryParameters(routeTemplate){
	// 	var queryComponent = routeTemplate.split('?')[1];

	// 	if(queryComponent === undefined) return [];
	// }
	// function getStaticQueryParameters(routeTemplate){
	// 	var output = {};
	// 	var re = /[&|?]([\w\d]+)=([^&.]+)/g;
	// 	var match;
	// 	while(match = re.exec(route)){
	// 		if(!output[match[1]])output[match[1]] = match[2];
	// 		else if(!_.isArray(output[match[1]]))output[match[1]] = [output[match[1]], match[2]];
	// 		else output[match[1]].push(match[2]);
	// 	}

	// 	return output;
	// }
	// function getDynamicRouteParameters(routeTemplate){
	// 	return _.map(getRequestedParams((route.split('?')[1] || '')), function(e){return e.slice(1);});
	// }

	//alias this class in factories
	datapathFactories.Datapath = Datapath;

})(
	_private('pipeline.datapath.factory'), 
	_private('pipeline.filler.factory'), 
	_private('pipeline.formatter.factory'), 
	_private('util.is'),
	_private('info')
);
