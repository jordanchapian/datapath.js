(function(Datasync){
	'use strict';

	var publicAPI = Datasync,
			privateAPI = {};

	/*==================================
	=            Namespaces            =
	==================================*/
	function _namespace(str, root) {
		var chunks = str.split('.');
		if(!root)
			root = window;
		var current = root;
		for(var i = 0; i < chunks.length; i++) {
			if (!current.hasOwnProperty(chunks[i]))
				current[chunks[i]] = {};
			current = current[chunks[i]];
		}
		return current;
	}

	function public(str){
		return _namespace(str, publicAPI);
	}

	function private(str){
		return _namespace(str, privateAPI);
	}
	/*=====  End of Namespaces  ======*/


};