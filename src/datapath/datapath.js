define('datapath',
[
	'parameter/collection',
	'path/collection'
],
function(parameterCollection){

	function DatapathPublicApi(pathname){
		
	}

	/*----------  static extensions  ----------*/
	DatapathPublicApi.parameter = function(name){

		return {
			set:function(value){

			},
			reset:function(){

			}
		};

	};

	return DatapathPublicApi;
});