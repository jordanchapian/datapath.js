(function(fillerFactories, publicApi){

	function Filler(fn){
		//defend input

	}


	//alias this class in factories
	fillerFactories.Filler = Filler;

})(
	_private('datapath.pipeline.filler.factory'), 
	_private(), 
	_public()
);