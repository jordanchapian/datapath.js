(function(transformFactories, publicApi){

	function Transform(fn){
		//defend input

	}


	//alias this class in factories
	transformFactories.Transform = Transform;

})(
	_private('pipeline.transform.factory'), 
	_public()
);