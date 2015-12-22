(function(transformFactories, publicApi){

	function Transform(key, fn){

		this.getKey = function(){
			return key;
		};

		this.getFn = function(){

		};
	}

	Transform.prototype.run = function(data){
		return [];
	};

	//alias this class in factories
	transformFactories.Transform = Transform;

})(
	_private('datapath.pipeline.transform.factory'), 
	_public()
);