(function(subsetFactories, publicApi){
	
	function Subset(name, fn){
		//defend input

	}


	//alias this class in factories
	subsetFactories.Subset = Subset;

})(
	_private('datapath.pipeline.subset.factory'), 
	_public()
);