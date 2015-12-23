(function(publicApi, datapathAPI, is,set, datapathFactories, info, undefined){

	var datapathMap = {};
	
	publicApi.addDatapath = function(pathKey, pathTemplate){
		
		//defend input (must have at least a path key to complete action)
		if(pathKey === undefined || is.String(pathKey) === false){
			info.error('addDatapath Requries that at least a path key is provided. No recovery.');
			return;
		}
		else if(pathTemplate !== undefined && is.String(pathTemplate) === false){
			info.error('addDatapath Requries that the provided pathTemplate is a string. No recovery.');
			return;
		}
		//atempting to make multiple definitions with same key
		else if(datapathMap[pathKey] !== undefined){
			info.warn('Provided multiple definitions for datapath key ['+pathKey+']. Behavior is not predictable.');
		}

		return (datapathMap[pathKey] = new datapathFactories.Datapath(pathKey, pathTemplate));
	};

	publicApi.getDatapath = function(key){
		if(key === undefined)return set.values(datapathMap);
		else return datapathMap[key];
	};


	//private exposure
	datapathAPI.getDatapath = function(key){
		if(key === undefined)return set.values(datapathMap);
		else return datapathMap[key];
	};	


})(
	_public(), 
	_private('datapath'),
	_private('util.is'),
	_private('util.set'),
	_private('datapath.factory'),
	_private('info')
);
