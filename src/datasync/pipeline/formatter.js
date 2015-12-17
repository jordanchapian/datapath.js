(function(formatterFactories, internalApi, publicApi){
	
	function Formatter(fn){
		//defend input

	}

	//alias this class in factories
	formatterFactories.Formatter = Formatter;

})(_private('pipeline.formatter.factory'), _private(), _public());