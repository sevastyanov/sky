Sky.define('sky.ui.List', {
	
	extend: 'sky.ui.Component',
	
	config: {
		minWidth: '30px',
		displayField: 'name',
		valueField: 'id'
	},
	
	_init: function() {
		this.callParent(arguments);
		
		this.renderList();
	},
	
	renderList: function() {
		
		var collection = this.collection,
			ln = collection.length();
		
		if (!this.collection) {
			throw 'Для sky.ui.List не указан объект типа sky.Collection';
		}
		
		if (!ln) {
			return;
		}
		
		var df = document.createDocumentFragment();
		
		for (var i = 0; i < ln; i++) {
			
			var item  = document.createElement('div'),
				model = collection.models[i];
			
			item.innerHTML = model.get(this.displayField);
			item.skyModel   = model;
			item.className = 'sky-list-item';
			
			if (this.getCls) {
				var itemClassName = this.getCls(model);
				
				if (itemClassName) {
					$(item).addClass(itemClassName);
				}
			}
			
			df.appendChild(item);
		}
		
		this.el.appendChild(df);
		
		this.$el.bind('click', this.onClick.bind(this));
	},
	
	onClick: function(e) {
		
		var target = e.target;
		
		while (target && !$(target).hasClass('sky-list-item')) {
			target = $(target).parent()[0];
		}
		
		if (!target.skyModel) {
			return;
		}
		
		this.fireEvent('select', this, target.skyModel);
	}
	
});