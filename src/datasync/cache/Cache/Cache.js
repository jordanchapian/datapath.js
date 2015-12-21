(function(cacheFactory, datapathConfig, datapathAPI, paramState){
	
	function Cache(datapathKey){
		//dataframes, ordered from recent to oldest
		this._dataframes = [];
		
		//reference to the datapath object associated with this cache
		this._datapath = datapathAPI.getDatapath(datapathKey);
		this._datapathKey = datapathKey;
	}
	Cache.prototype.activeDataFrame = function(){
		return (this._dataframes.length > 0) ? this._dataframes[0] : undefined;
	};

	Cache.prototype.isCacheFull = function(){
		return (datapathConfig.cacheSize.get(this._datapathKey) === this._dataframes.length);
	};

	Cache.prototype.cacheOverflow = function(){
		return (datapathConfig.cacheSize.get(this._datapathKey) < this._dataframes.length);
	};

	//remove entire cache
	Cache.prototype.clearDataframes = function(){
		this._dataframes = [];
	};

	Cache.prototype.sync = function(cb){
		var validIndex;

		//if we have a valid frame already, we need to put it in the front of the array, and no datafetch required
		if((validIndex = validFrameIndex(this)) > -1){
			this._dataframes.splice(0, 0, this._dataframes.splice(validIndex, 1)[0]);
		}
		//we must add a new frame. (then check overflow)
		else{
			this._dataframes.splice(0,0, new cacheFactory.DataFrame(this._datapath) );
		}

		//remove an old frame if we've overflowed
		if(this.cacheOverflow()){
			this._dataframes.splice((this._dataframes.length - 1), 1);
		}

		//now we can request our dataframe to fill it's dataset from remote
		this._dataframes[0].fill(function(){
			//action is complete (TODO, this would be an async response...)
			return cb();
		});
	};

	/*----------  utils  ----------*/
	function validFrameIndex(self){

		for(var i=0; i < self._dataframes.length; i++){
			if(self._dataframes[i].parameterStateValid()) return i;
		}

		return -1;
	}


	/*----------  Expose  ----------*/
	
	cacheFactory.Cache = Cache;
	
})(
	_private('cache.factory'),
	_private('datapath.config'),
	_private('datapath'),
	_private('state.parameter')
);