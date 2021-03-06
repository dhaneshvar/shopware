
//{namespace name=backend/plugin_manager/translation}
Ext.define('Shopware.apps.PluginManager.view.detail.Prices', {
    extend: 'PluginManager.tab.Panel',
    cls: 'store-plugin-detail-prices-tab shopware-plugin-manager-tab',
    margin: '10 0',

    mixins: {
        events: 'Shopware.apps.PluginManager.view.PluginHelper'
    },

    tabIndex: {
    },

    initComponent: function() {
        var me = this,
            items = [],
            index = 0,
            buyPrice = me.getPriceByType(me.prices, 'buy'),
            rentPrice = me.getPriceByType(me.prices, 'rent'),
            testPrice = me.getPriceByType(me.prices, 'test'),
            freePrice = me.getPriceByType(me.prices, 'free');

        if (buyPrice) {
            items.push(me.createBuyTab(buyPrice));
            me.tabIndex['buy'] = index;
            index++;
        }
        if (rentPrice) {
            items.push(me.createRentTab(rentPrice));
            me.tabIndex['rent'] = index;
            index++;
        }
        if (testPrice) {
            items.push(me.createTestTab(testPrice));
            me.tabIndex['test'] = index;
            index++;
        }
        if (freePrice) {
            items.push(me.createFreeTab(freePrice));
            me.tabIndex['free'] = index;
            index++;
        }
        if (items.length <= 0 && me.plugin.get('useContactForm')) {
            items.push(me.createContactTab());
            me.tabIndex['contact'] = index;
            index++;
        }

        me.items = items;

        me.callParent(arguments);
    },

    createContactTab: function() {
        var me = this, items = [];


        items.push({
            xtype: 'plugin-manager-container-container',
            cls: 'button contact',
            html: '<div class="text">{s name="contact_text"}Contact producer{/s}</div>',
            handler: function() {
                var link = '{s name="contact_link"}http://store.shopware.com/en/contact-producer{/s}?technicalName=' + me.plugin.get('technicalName');
                window.open(link);
            }
        });

        return Ext.create('Ext.container.Container', {
            title: '{s name="contact_version"}Contact{/s}',
            cls: 'tab',
            height: 110,
            items: items
        });
    },

    createFreeTab: function(price) {
        var me = this, items = [];

        items.push({
            xtype: 'plugin-manager-container-container',
            cls: 'button free',
            html: '<div class="text">{s name="download_now"}Download now{/s}</div>',
            handler: function() {
                me.downloadFreePluginEvent(me.plugin, price);
            }
        });

        items.push({
            xtype: 'component',
            cls: 'price-free',
            html: '{s name="for_free"}Free{/s}'
        });

        return Ext.create('Ext.container.Container', {
            title: '{s name="free_version"}Free version{/s}',
            cls: 'tab',
            height: 110,
            items: items
        });
    },


    createBuyTab: function(price) {
        var me = this, items = [];

        items.push({
            xtype: 'plugin-manager-container-container',
            cls: 'button buy',
            html: '<div class="text">{s name="buy_now"}Buy now{/s}</div>',
            handler: function() {
                me.buyPluginEvent(me.plugin, price);
            }
        });

        items.push({
            xtype: 'component',
            cls: 'price',
            html: me.formatPrice(price.get('price')) + ' *'
        });

        if (price.get('subscription')) {
            items.push({
                xtype: 'component',
                cls: 'subscription',
                html: '<div class="icon">U</div>' +
                '<div class="text">{s name="subscription_info"}Incl. updates for 12 Months (subscription){/s}</div>'
            });
        }

        return Ext.create('Ext.container.Container', {
            title: '{s name="buy_version"}Purchase version{/s}',
            cls: 'tab buy-tab',
            height: 110,
            items: items
        });
    },

    createRentTab: function(price) {
        var me = this, items = [];

        items.push({
            xtype: 'plugin-manager-container-container',
            cls: 'button rent',
            html: '<div class="text">{s name="rent_now"}Rent now{/s}</div>',
            handler: function() {
                me.rentPluginEvent(me.plugin, price);
            }
        });

        items.push({
            xtype: 'component',
            cls: 'price',
            html: me.formatPrice(price.get('price')) + ' * <div class="month">/ {s name="per_month"}per month{/s}</div>'
        });

        items.push({
            xtype: 'component',
            cls: 'subscription',
            html: '<div class="icon">U</div>' +
            '<div class="text">{s name="rent_subscription_info"}All updates included during renting period{/s}</div>'
        });

        items.push({
            xtype: 'component',
            cls: 'dismissal',
            html: '{s name="rent_cancel"}Is cancelable on a monthly basis.{/s}'
        });

        return Ext.create('Ext.container.Container', {
            title: '{s name="rent_version"}Rent version{/s}',
            cls: 'tab rent-tab',
            height: 110,
            items: items
        });
    },

    createTestTab: function(price) {
        var me = this, items = [];

        items.push({
            xtype: 'plugin-manager-container-container',
            cls: 'button test',
            html: '<div class="text">{s name="request_test_version"}Request test version{/s}</div>',
            handler: function() {
                me.requestPluginTestVersionEvent(me.plugin, price);
            }
        });

        items.push({
            xtype: 'component',
            cls: 'price-free',
            html: '{s name="for_free"}Free{/s}'
        });

        return Ext.create('Ext.container.Container', {
            title: '{s name="test_version"}Test version{/s}',
            cls: 'tab',
            height: 110,
            items: items
        });
    },

    getPriceByType: function(prices, type) {
        var me = this, price = null;

        prices.each(function(item) {
            if (item.get('type') == type) {
                price = item;
            }
        });
        return price;
    },

    formatPrice: function(value) {
        return Ext.util.Format.currency(value, ' €', 2, true);
    }

});