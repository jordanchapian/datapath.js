(function(formatterFactories, internalApi, publicApi){
	
	//formatter just passes entities
	function Formatter(fn){
		//defend input

		this.getFn = function(){
			return fn;
		};
	}

	Formatter.prototype.run = function(dataset){
		var formatter = this.getFn();

		dataset.forEach(function(datum){
			formatter(datum);
		});
	};

	//alias this class in factories
	formatterFactories.Formatter = Formatter;

})(_private('datapath.pipeline.formatter.factory'), _private(), _public());