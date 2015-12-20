(function(publicApi, datapathAPI, is,set, datapathFactories, info, undefined){

	var datapathMap = {};

	//add datapath single level
	var _addDatapath = function(pathTemplate, pathKey){

		//defend input
		if(pathTemplate === undefined || is.String(pathTemplate) === false
				|| pathKey === undefined || is.String(pathKey) === false){

			info.error('Input format for addDatapath is invalid. No recovery.');
			return;
		}
		//atempting to make multiple definitions with same key
		else if(datapathMap[pathKey] !== undefined){
			info.warn('Provided multiple definitions for datapath key ['+pathKey+']. Behavior is not predictable.');
		}

		//take action
		var newDatapath = new datapathFactories.Datapath(pathKey, pathTemplate);
		datapathMap[pathKey] = newDatapath;

		return newDatapath;
	};
	//multi-level datapath adder
	var _addDatapath_ML = function(pathTemplate){
		return {
			as:function(pathKey){
				return _addDatapath(pathTemplate, pathKey);
			}
		}
	};

	//public exposure
	publicApi.addDatapath = function(pathTemplate, pathKey){
		//do we have valid input?
		if(pathTemplate === undefined){
			info.warn("Calling addDatapath with no arguments. No action was taken.");
			return this;
		}
		//are we using single level accessor?
		else if(pathKey !== undefined)
			return _addDatapath(pathTemplate, pathKey);
		//they must want a multi-level accessor
		else
			return _addDatapath_ML(pathTemplate);
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
