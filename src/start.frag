
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module 
        //in another project. That other project will only 
        //see this AMD call, not the internal modules in 
        //the closure below. 
        define([], factory);
    } else if (typeof exports != 'undefined' && !exports.nodeType){

        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = factory();
        }

        exports.datasync = factory();
    }
    else{
        //Browser globals case. Just assign the 
        //result to a property on the global. 
        root.datasync = factory();
    }
}(this, function () {