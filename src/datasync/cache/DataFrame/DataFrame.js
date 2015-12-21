(function(cacheFactory, parameterAPI, is){
	//the data frame is an association between a dataset and a parameter set
	function DataFrame(datapath){
		this._datapath = datapath;

		//the datapath (needs to be injected with data)
		this.data = new cacheFactory.Data(datapath, []);

		//param map (what state is this data frame relative to)
		this._param = {};
		this._paramKeys = datapath.route.getParameterKeys();

		init(this);
	}

	DataFrame.prototype.fill = function(cb){
		//if we need to fill, take the async action, if not, immediately respond

		//get the data
		//--- --- ---
		//then inject into Data
		this.data = new cacheFactory.Data(this._datapath, ['this', 'is', 'the', 'dataset']);

		cb();
	};
	//do the parameter values associated with this frame reflect the current param state
	DataFrame.prototype.parameterStateValid = function(){
		//go through each of our parameter keys and ensure that each value associated
		//with this frame is consistent to the current set parameters
		for(var i = 0; i < this._paramKeys.length; i++){
			var paramKey = this._paramKeys[i];

			var p0 = this._param[paramKey];
			var p1 = parameterAPI.getParameter(paramKey);

			console.log(p0,p1);
			if(paramsEqual(p0, p1) === false) return false;
		}

		return true;
	};

	function init(self){
		//grab the most recent param state. That is what this frame will anchor to.
		self._paramKeys.forEach(function(paramKey){
			self._param[paramKey] = parameterAPI.getParameter(paramKey);
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

	cacheFactory.DataFrame = DataFrame;
	
})(
	_private('cache.factory'),
	_private('state.parameter'),
	_private('util.is')
);