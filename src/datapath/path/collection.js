define('path/collection',
[
	'util/is',
	'util/set',
	'info',
	'./Path'
],
function(is, set, info, Path){
	var datapathMap = {};
		
	var api = {};

	api.add = function(pathKey, pathTemplate){
		
		//defend input (must have at least a path key to complete action)
		if(pathKey === undefined || is.String(pathKey) === false){
			info.error('addPath Requries that at least a path key is provided. No recovery.');
			return;
		}
		else if(pathTemplate !== undefined && is.String(pathTemplate) === false){
			info.error('addPath Requries that the provided pathTemplate is a string. No recovery.');
			return;
		}
		//atempting to make multiple definitions with same key
		else if(datapathMap[pathKey] !== undefined){
			info.warn('Provided multiple definitions for datapath key ['+pathKey+']. Behavior is not predictable.');
		}

		return (datapathMap[pathKey] = new Path(pathKey, pathTemplate));
	};

	api.get = function(key){
		if(key === undefined)return set.values(datapathMap);
		else return datapathMap[key];
	};

	return api;

});
