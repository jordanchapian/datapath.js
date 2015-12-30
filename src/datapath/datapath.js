define('datapath',
[
	'parameter/collection',
	'path/collection',
	'util/is'
],
function(parameterCollection, pathCollection, is){

	function DatapathPublicApi(pathname){
		var requestedPaths = pathCollection.get(pathname);

		if(requestedPaths === undefined && pathname !== undefined){
			return pathCollection.add(pathname);
		}	
		else return requestedPaths;

	}

	/*----------  static extensions  ----------*/
	DatapathPublicApi.parameter = function(name){

		return {

			set:function(value){
				return parameterCollection.set(name, value);
			},

			reset:function(){
				return parameterCollection.set(name, undefined);
			},

			get:function(){
				return parameterCollection.get(name);
			}

		};

	};

	
	return DatapathPublicApi;
});