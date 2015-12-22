(function(subsetFactories, publicApi){
	//the subset currently passes each item into a predicate (fn)
	//it then returns a filtered array
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
	subsetFactories.Subset = Subset;

})(
	_private('datapath.pipeline.subset.factory'), 
	_public()
);