(function(publicApi, pipelineState, is, datapathFactories, info, undefined){

	//add datapath single level
	var _addDatapath = function(pathTemplate, pathKey){

		//defend input
		if(pathTemplate === undefined || is.String(pathTemplate) === false
				|| pathKey === undefined || is.String(pathKey) === false){

			info.error('Input format for addDatapath is invalid. No recovery.');
			return;
		}

		//take action
		var newDatapath = new datapathFactories.Datapath(pathKey, pathTemplate);
		pipelineState.storeDatapath(pathKey, newDatapath);


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
		return pipelineState.getDatapath(key);
	};

})(
	_public(), 
	_private('state.pipeline'),
	_private('util.is'),
	_private('datapath.factory'),
	_private('info')
);
