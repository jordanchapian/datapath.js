(function(cacheFactory){
	function Data(datapath, rawData){
		this._datapath = datapath;

		//data caches
		this._rawData = (rawData || []); //raw, unaltered dataset


		//initialize the class
		init(this);
	}

	/*----------  utils  ----------*/
	function runPipeline(self){
		// console.log('running pipeline on', self._rawData);
	}

	function init(self){
		if(self._rawData.length === 0)return;

		runPipeline(self);
	}

	cacheFactory.Data = Data;

})(
	_private('cache.factory')
);