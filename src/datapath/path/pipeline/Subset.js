define('path/pipeline/Subset',
[
],
function(){

	function Subset(key, fn){
		//defend input

		this.getKey = function(){
			return key;
		};

		this.getFn = function(){
			return fn;
		};
	}

	Subset.prototype.run = function(data){
		return data.filter(this.getFn());
	};

	//alias this class in factories
	return Subset;

});