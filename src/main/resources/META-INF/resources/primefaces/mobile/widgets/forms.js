/**
 * PrimeFaces Mobile InputText Widget
 */
PrimeFaces.widget.InputText = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.input = this.jq.children('input');
        this.cfg.enhanced = true;
        this.cfg.clearBtn = true;
        
        this.input.textinput(this.cfg);
    }
    
});

/**
 * PrimeFaces Mobile InputTextarea Widget
 */
PrimeFaces.widget.InputTextarea = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.cfg.enhanced = true;
        this.cfg.autogrow = false;
        
        this.jq.textinput(this.cfg);
    }
    
});

/**
 * PrimeFaces SelectOneButton Widget
 */
PrimeFaces.widget.SelectOneButton = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.controlGroup = this.jq.children('.ui-controlgroup-controls');
        this.buttons = this.controlGroup.find('> .ui-radio > label.ui-btn');
        this.bindEvents();
    },
    
    bindEvents: function() {
        var $this = this;
                
        this.buttons.on('click.selectOneButton', function(e) {
            var button = $(this);

            if(!button.hasClass('ui-btn-active')) {
                $this.select(button);
            }
        });
    },
    
    select: function(button) {
        this.buttons.filter('.ui-btn-active').removeClass('ui-btn-active').next().prop('checked', false);

        button.addClass('ui-btn-active').next().prop('checked', true).change();
    }
    
});

/**
 * PrimeFaces SelecyManyButton Widget
 */
PrimeFaces.widget.SelectManyButton = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.controlGroup = this.jq.children('.ui-controlgroup-controls ');
        this.buttons = this.controlGroup.find('> .ui-checkbox > label.ui-btn');
        
        this.bindEvents();
    },
    
    bindEvents: function() {
        var $this = this;
        this.buttons.on('click.selectManyButton', function() {
            var button = $(this);

            if(button.hasClass('ui-btn-active'))
                $this.unselect(button);
            else
                $this.select(button);
        });
    },
    
    select: function(button) {
        button.addClass('ui-btn-active').next().prop('checked', true).change();

    },
    
    unselect: function(button) {
        button.removeClass('ui-btn-active').next().prop('checked', false).change();
    }
    
});

/**
 * PrimeFaces Mobile InputSlider Widget
 */
PrimeFaces.widget.InputSlider = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.jq.slider();
    }
    
});

/**
 * PrimeFaces Mobile RangeSlider Widget
 */
PrimeFaces.widget.RangeSlider = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.jq.attr('data-role', 'rangeslider');
        this.jq.rangeslider();
    }
    
});

/**
 * PrimeFaces Mobile UISwitch Widget
 */
PrimeFaces.widget.UISwitch = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.input = this.jq.children('input');
        this.cfg.enhanced = true;
        
        this.input.flipswitch(this.cfg);
    }
    
});

/**
 * PrimeFaces Mobile SelectOneMenu Widget
 */
PrimeFaces.widget.SelectOneMenu = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.jq.selectmenu(this.cfg).removeAttr('id');
        this.jq.closest('.ui-select').attr('id', this.id);
    }
    
});

/**
 * PrimeFaces Mobile SelectOneRadio Widget
 */
PrimeFaces.widget.SelectOneRadio = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.jq.controlgroup();
    }
    
});

/**
 * PrimeFaces Mobile SelectManyCheckbox Widget
 */
PrimeFaces.widget.SelectManyCheckbox = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.jq.controlgroup();
    }
    
});

/**
 * PrimeFaces Mobile SelectBooleanCheckbox Widget
 */
PrimeFaces.widget.SelectBooleanCheckbox = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.jq.controlgroup();
    }
    
});

