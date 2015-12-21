(function(cacheFactory){
	function Data(datapath, rawData){
		this._datapath = datapath;

		//data caches
		this._rawData = (rawData || []); //raw, unaltered dataset


		//initialize the class
		init(this);
	}

	//replaces the data set with new raw data. It is then pushed through pipeline
	Data.prototype.inject = function(rawData){
		this._rawData = rawData;

		runPipeline(this);
	};


	/*----------  utils  ----------*/
	function runPipeline(self){
		console.log('running pipeline on', self._rawData);
	}

	function init(self){
		if(self._rawData.length === 0)return;

		runPipeline();
	}

	cacheFactory.Data = Data;

})(
	_private('cache.factory')
);