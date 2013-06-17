Ext.define('sky.core.Dispatcher', {

    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function(config) {

        this.mixins.observable.constructor.call(this, config);

        this.addEvents(
            'state_change'
        );

        this.state = this.getStateFromUrl();

        window.addEventListener('hashchange', Ext.bind(this.onHashChanged, this));

    },

    getStateFromUrl: function() {
        var queryString = location.hash.replace(/^#/, ''),
            query;

        try {
            query = Ext.Object.fromQueryString(queryString);
        } catch(e) {
            query = {};
        }

        query.module = query.module || 'page';
        query.action = query.action || 'index';

        return query;
    },

    onHashChanged: function() {
        this.state = this.getStateFromUrl();
        this.fireEvent('state_change', this.state);
    },

    setState: function(state) {
        location.hash = '#' + Ext.Object.toQueryString(state);
    }


});