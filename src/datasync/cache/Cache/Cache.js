(function(cacheFactory, datapathConfig, datapathAPI, paramState){
	
	function Cache(datapathKey){
		//dataframes, ordered from recent to oldest
		this._dataframes = [];
		
		//reference to the datapath object associated with this cache
		this._datapath = datapathAPI.getDatapath(datapathKey);
		this._datapathKey = datapathKey;
	}

	Cache.prototype.isCacheFull = function(){
		return (datapathConfig.cacheSize.get(this._datapathKey) >= this._dataframes.length);
	};

	Cache.prototype.sync = function(cb){
		var validIndex;

		//if we do not have any data frames, we push our first.
		if(this._dataframes.length === 0){
			this._dataframes.push( new cacheFactory.DataFrame(this._datapath) );
		}
		//if we have a valid frame already, we need to put it in the front of the array, and no datafetch required
		else if((validIndex = validFrameIndex(this)) > -1){
			console.log('we already have a valid frame');
		}
		//we do not have a valid frame, we must add a new one to the front of the cache
		//while checking if this violates our cache size
		//we also must reach out for a new dataset
		else {	
			console.log('we need a new frame...');
		}

		//action is complete (TODO, this would be an async response...)
		return cb();
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