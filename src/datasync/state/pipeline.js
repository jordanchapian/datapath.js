(function(pipelineState, info){
	var datapath_map = {};

	pipelineState.storeDatapath = function(key, datapath){
		//atempting to make multiple definitions with same key
		if(datapath_map[key] !== undefined){
			info.warn('Provided multiple definitions for datapath key ['+key+']. Behavior is not predictable.');
		}

		datapath_map[key] = datapath;
	};

	pipelineState.getDatapath = function(key){
		return datapath_map[key];
	};

})(
	_private('state.pipeline'),
	_private('info')
);