(function(parameterFactory, is){

	function ParameterHistoryEntry(value){
		this._value = value;

		this._nUsedBy = 0;
		this._usedBy = {}; //Keys for datapaths using this value.
	}

	ParameterHistoryEntry.prototype.getValue = function(){
		return this._value;
	};

	ParameterHistoryEntry.prototype.markDigestedBy = function(datapathKey){
		//ensure that we do not introduce duplicates
		if(this._usedBy[datapathKey] === undefined) return;
		else {
			this._nUsedBy++;
			this._usedBy[datapathKey] = true;
		}
	};

	ParameterHistoryEntry.prototype.unmarkDigestedBy = function(datapathKey){
		if(this._usedBy[datapathKey]){
			this._nUsedBy--;
			delete this._usedBy[datapathKey];
		}
	};

	ParameterHistoryEntry.prototype.isDigestedBy = function(datapathKey){
		return (this._usedBy[datapathKey] === true);
	};

	ParameterHistoryEntry.prototype.isUnused = function(){
		return (this._nUsedBy === 0);
	};

	parameterFactory.ParameterHistoryEntry = ParameterHistoryEntry;

	/*----------  utils  ----------*/

})
(
	_private('state.parameter.factory')
);