(function(cacheFactory, datapathConfig){
	
	function Cache(datapathKey){

		console.log(datapathConfig.cacheSize.get(datapathKey));

	}

	Cache.prototype.sync = function(cb){
		return cb();
	};

	cacheFactory.Cache = Cache;
	
})(
	_private('cache.factory'),
	_private('datapath.config')
);