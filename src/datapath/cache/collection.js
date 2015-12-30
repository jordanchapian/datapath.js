define('cache/collection',
[
	'util/set',
	'util/is',
	'path/collection',

	'./Cache'
],
function(set, is, pathCollection, Cache){
	var dataCaches = {};

	var api = {};
	api.ensureSynced = function(datapathKeys, cb){
		if(arguments.length === 0) return;
		else if(arguments.length > 1)datapathKeys = set.argsToArray(arguments);
		else if(!is.Array(datapathKeys)) datapathKeys = [datapathKeys];

		//narrow the requested keys to valid keys
		datapathKeys = filterValidKeys(datapathKeys);

		//ensure that caches exist for each of these keys
		ensureCachesExist(datapathKeys);

		//call sync for each of the caches
		callSync(datapathKeys, cb);

	};

	//do not expose the data frame api to the public
	//only return the data api attached to each frame
	api.getData = function(datakey){
		if(dataCaches[datakey] === undefined)return undefined; //maybe just a blank data object?
		else if(dataCaches[datakey].activeDataFrame() == undefined) return undefined;
		else return dataCaches[datakey].activeDataFrame().data;
	};

	api.syncAll = function(){

	};

	api.getCache = function(datapathKey){
		return dataCaches[datapathKey];
	};

	/*----------  utils  ----------*/

	//ensure we have caches for some array of datapath keys
	function ensureCachesExist(datapathKeys){
		for(var i = 0; i < datapathKeys.length; i++){
			if(dataCaches[datapathKeys[i]] === undefined){
				dataCaches[datapathKeys[i]] = new Cache(datapathKeys[i]);
			}
		}
	}

	//this function will analyze an array of keys, and return a set of valid keys
	function filterValidKeys(datapathKeys){
		return datapathKeys.filter(function(e){ return (pathCollection.getDatapath(e) !== undefined); });
	}

	//call syncs
	function callSync(datapathKeys, cb){
		var ajaxCallsRemaining = datapathKeys.length;
		for(var i = 0; i < datapathKeys.length; i++){
			dataCaches[datapathKeys[i]].sync(function(){
				ajaxCallsRemaining--;

				//if there are no outstanding requests, return the cb
				if(ajaxCallsRemaining === 0){
					if(is.Function(cb)) cb();
				}
			});
		}
	}

});
