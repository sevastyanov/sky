Sky.define('sky.Collection', {
	
	extend: 'sky.ObservableClass',
	
	__construct: function() {
		
		this.models = [];
		
		if (this.data) {
			
			var data = this.data;
			
			for (var i = 0, ln = data.length; i < ln; i++) {
				this.models.push(Sky.create('sky.Model', {
					data: data[i]
				}));
			}
			
		}
		
	},
	
	length: function() {
		return this.models.length;
	},
	
	find: function(fieldName, value) {
		
		var models = this.models,
			ln     = models.length;
		
		for (var i = 0; i < ln; i++) {
			if (models[i].get(fieldName) === value) {
				return models[i];
			}
		}
		
		return null;
		
	}
	
});