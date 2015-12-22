(function(fillerFactories, publicApi){

	//the filler currently just passes the entire dataset to a user provided function
	//that will append items to the dataset required (like filling in unseen dates)
	//would probably be better to make this assertion based...
	function Filler(fn){
		//defend input
		
		this.getFn = function(){
			return fn;
		};

	}

	Filler.prototype.run = function(dataset){
		this.getFn()(dataset);
	};

	//alias this class in factories
	fillerFactories.Filler = Filler;

})(
	_private('datapath.pipeline.filler.factory'), 
	_private(), 
	_public()
);