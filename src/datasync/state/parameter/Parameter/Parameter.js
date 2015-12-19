(function(parameterFactory, is){

	function Parameter(){

		this._active;

		this._history = [];
	}

	Parameter.prototype.assignValue = function(value){
		//if this is the value that is already active, let's just bail
		if(this._active !== undefined && this._active.getValue() === value) return;

		//we need to pluck this value from the active state
		//can we just toss it, or do we need to store this value in our history? (used by some datapath)
		if(this._active !== undefined && !this._active.isUnused()){
			this._history.push(this._active);
		}
		this._active = undefined;

		//determine if we have this value already in our history
		var indexOfValue = value_indexInHistory(self, value);

		//we have not seen this value before, let's create it
		if(indexOfValue === -1){
			this._active = (new parameterFactory.ParameterHistoryEntry(value));
		}
		//let's just pull our historical record and remove it from history state
		else{
			this._active = this._history[indexOfValue];
			this._history.splice(indexOfValue, 1);
		}
	};

	//mark our active value as digested by some datapath
	Parameter.prototype.markDigestedBy = function(datapathKey){
		//determine if this datapath was digesting some past value in history, and remove

		//mark the active value as digested by this datapath key
		
	};

	/*----------  utils  ----------*/
	function value_indexInHistory(self, value){
		for(var i = 0; i < self._history.length; i++){
			if(self._history[i].getValue() === value){
				return i;
			}
		}
		return -1;
	}

	parameterFactory.Parameter = Parameter;

})
(
	_private('state.parameter.factory'),
	_private('util.is')
);