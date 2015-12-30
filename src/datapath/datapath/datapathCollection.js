define('datapath/datapathCollection',
[
	'util/is',
	'util/set',
	'info',
	'./Datapath'
],
function(is, set, info, Datapath){
	var datapathMap = {};
		
	var api = {};

	api.addDatapath = function(pathKey, pathTemplate){
		
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

		return (datapathMap[pathKey] = new Datapath(pathKey, pathTemplate));
	};

	api.getDatapath = function(key){
		if(key === undefined)return set.values(datapathMap);
		else return datapathMap[key];
	};

	return api;

});
