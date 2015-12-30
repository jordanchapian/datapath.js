define('datapath/pipeline/Transform',
[

],
function(){

	function Transform(key, fn){

		this.getKey = function(){
			return key;
		};

		this.getFn = function(){
			return fn;
		};
		
	}

	Transform.prototype.run = function(data){
		return this.getFn()(data);
	};

	//alias this class in factories
	return Transform;

});
