Sky.define('sky.Model', {
	
	extend: 'sky.ObservableClass',
	
	get: function(name) {
		return this.data[name];
	},
	
	set: function(name, value) {
		this.data[name] = value;
		this.fireEvent('change', name, value);
	}
	
});