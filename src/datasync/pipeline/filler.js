(function(fillerFactories, internalApi, publicApi){

	console.log(publicApi);
	function Filler(fn){
		//defend input

	}


	//alias this class in factories
	fillerFactories.Filler = Filler;

})(_private('pipeline.filler.factory'), _private(), _public());