(function(){
	
	Datasync._.util.is = {};

	Datasync._.util.is.Integer = function(val) {
		return (isNumber(val) && Math.floor(val) == val);
	};

	Datasync._.util.is.Number = function(val) {
		return (typeof val == "number");
	};

	Datasync._.util.is.String = function(){
		return (typeof val == "string");
	};

	Datasync._.util.is.Boolean = function(val) {
		return (typeof val == "boolean");
	};

	Datasync._.util.is.Object = function(val) {
		return (typeof val == "object" && val !== null);
	};

	Datasync._.util.is.Array = function(val) {
		return (val instanceof Array);
	};

	Datasync._.util.is.Function = function(val) {
		return (typeof val == "function");
	};

	Datasync._.util.is.Date = function(val) {
		return (Object.prototype.toString.call(val) === "[object Date]");
	};

})();