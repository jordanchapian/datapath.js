(function(configApi, defaults, is, infoLog){
	//map datapaths to cache sizes
	var cacheSize = {};

	//create an api into map
	var api = {};

	api.get = function(datapath){

		//defend input
		if(datapath === undefined || is.String(datapath) === false){
			infoLog.error("Not providing a {string} datapath for [getCacheSize]. Action Ignored.");
			return;
		}

		//check if we have a cache size in this configuration
		if(cacheSize[datapath] !== undefined){
			return cacheSize[datapath];
		}
		//just use the global configuration
		else{
			return defaults.cacheSize;
		}
	};

	api.set = function(datapath, size, omitEvents){
		//defend input
		if(datapath === undefined || is.String(datapath) === false){
			infoLog.error("Not providing datapath for [setCacheSize]. Action Ignored.");
			return;
		}
		else if(size === undefined || is.Number(size) === false){
			infoLog.error("Not providing a {number} size for [setCacheSize]. Action Ignored.");
			return;
		}


		//we have changed the local cache size configuration, we can emit events if we choose.
		if(!omitEvents && (cacheSize[datapath] === undefined || cacheSize[datapath] !== size))
		{

		}

		//change the configuration
		cacheSize[datapath] = size;
	};

	//expose the api to the namespace
	configApi.cacheSize = api;
})(
	_private('datapath.config'),
	_private('datapath.configDefault'),
	_private('util.is'),
	_private('info')
);
