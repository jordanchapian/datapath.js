define('datapath/pipeline/Filler',
[
],
function(){

	function Filler(fn){
		
	}

	Filler.prototype.run = function(dataset){
		this.getFn()(dataset);
	};

	//alias this class in factories
	return Filler;

});
