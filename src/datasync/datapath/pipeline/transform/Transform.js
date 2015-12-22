(function(transformFactories, publicApi){

	//the transform currently passes the entire formatted and filled dataset
	//into some transform function.

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
	transformFactories.Transform = Transform;

})(
	_private('datapath.pipeline.transform.factory'), 
	_public()
);