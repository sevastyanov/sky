(function(global) {
	
	global.sky = global.sky || {};
	global.sky.dict = global.sky.dict || {};
	
	var translate = sky.dict.translate || {};
	
	global.Sky = {
		
		build: 1,
		
		global: global,
		
		isDebug: sky.isDebug,
		
		skyRoot: sky.basePath,
		
		emptyFn: function() {},
		
		define: function(className, prototype) {
			sky.ClassManager.define(className, prototype);
		},
		
		create: function(className, cfg) {

			return sky.ClassManager.create(className, cfg);
		},
		
		_: function(name) {
			var result = translate[name];
			return (typeof result === 'string') ? result : name;
		},
        
        namespace: function(namespace) {
            var ns = namespace.split('.'),
                child = this.global;

            for (var j = 0, ln = ns.length; j < ln; j++)
            {
                var nsPart = ns[j];

                child = child[nsPart] = child[nsPart] || {};
            }
        },

        isObject: function(obj) {
            return (typeof obj === 'object' && obj !== null);
        }
	};
	
})(window);