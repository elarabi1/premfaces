/**
 * PrimeFaces PickList Widget
 */
PrimeFaces.widget.PickList = function(id, cfg) {
	this.id = id;
	this.cfg = cfg;
    this.jqId = PrimeFaces.escapeClientId(this.id);
    this.jq = $(this.jqId);
    this.sourceList = this.jq.find('.ui-picklist-source');
    this.targetList = this.jq.find('.ui-picklist-target');
    this.sourceState = $(this.jqId + '_source');
    this.targetState = $(this.jqId + '_target');
    this.items = this.jq.find('.ui-picklist-item');

    //Buttons
    this.setupButtons();

    if(this.cfg.disabled) {
        $(this.jqId + ' li.ui-picklist-item').addClass('ui-state-disabled');
        $(this.jqId + ' button').attr('disabled', 'disabled').addClass('ui-state-disabled');
    }
    else {
        var _self = this;

        //Sortable lists
        $(this.jqId + ' ul').sortable({
            connectWith: this.jqId + ' .ui-picklist-list',
            revert: true,
            update: function(event, ui) {
                _self.onUpdate(event, ui);
            }
        });

        //Visual selection and Double click transfer
        this.items.mouseover(function(e) {
                                $(this).addClass('ui-state-hover');
                            })
                  .mouseout(function(e) {
                                $(this).removeClass('ui-state-hover');
                            })
                  .mousedown(function(e) {
                                var element = $(this);
                                
                                if(!e.metaKey) {
                                    element.siblings('.ui.state-highlight').removeClass('ui-state-highlight');
                                }
                                
                                element.removeClass('ui-state-hover').addClass('ui-state-highlight');
                            })
                  .dblclick(function() {
                                $(this).hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                                    if($(this).parent().hasClass('ui-picklist-source'))
                                        _self.transfer(this, _self.targetList);
                                    else
                                        _self.transfer(this, _self.sourceList);
                            });
                    });

        //Pojo support
        if(this.cfg.pojo) {
            this.parseItemValues(this.sourceState, this.sourceList);
            this.parseItemValues(this.targetState, this.targetList);
        }
    }
}

/**
 * Creates button controls using progressive enhancement
 */
PrimeFaces.widget.PickList.prototype.setupButtons = function() {
    var _self = this;
    
    $(this.jqId + ' .ui-picklist-button-add').button({icons: {primary: "ui-icon-arrow-1-e"},text: (!this.cfg.iconOnly)}).click(function() {_self.add();});
    $(this.jqId + ' .ui-picklist-button-add-all').button({icons: {primary: "ui-icon-arrowstop-1-e"},text: (!this.cfg.iconOnly)}).click(function() {_self.addAll();});
    $(this.jqId + ' .ui-picklist-button-remove').button({icons: {primary: "ui-icon-arrow-1-w"},text: (!this.cfg.iconOnly)}).click(function() {_self.remove();});
    $(this.jqId + ' .ui-picklist-button-remove-all').button({icons: {primary: "ui-icon-arrowstop-1-w"},text: (!this.cfg.iconOnly)}).click(function() {_self.removeAll();});

    if(this.cfg.showSourceControls) {
        $(this.jqId + ' .ui-picklist-source-controls .ui-picklist-button-move-up').button({icons: {primary: "ui-icon-arrow-1-n"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveUp(_self.sourceList);});
        $(this.jqId + ' .ui-picklist-source-controls .ui-picklist-button-move-top').button({icons: {primary: "ui-icon-arrowstop-1-n"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveTop(_self.sourceList);});
        $(this.jqId + ' .ui-picklist-source-controls .ui-picklist-button-move-down').button({icons: {primary: "ui-icon-arrow-1-s"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveDown(_self.sourceList);});
        $(this.jqId + ' .ui-picklist-source-controls  .ui-picklist-button-move-bottom').button({icons: {primary: "ui-icon-arrowstop-1-s"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveBottom(_self.sourceList);});
    }

    if(this.cfg.showTargetControls) {
        $(this.jqId + ' .ui-picklist-target-controls .ui-picklist-button-move-up').button({icons: {primary: "ui-icon-arrow-1-n"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveUp(_self.targetList);});
        $(this.jqId + ' .ui-picklist-target-controls .ui-picklist-button-move-top').button({icons: {primary: "ui-icon-arrowstop-1-n"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveTop(_self.targetList);});
        $(this.jqId + ' .ui-picklist-target-controls .ui-picklist-button-move-down').button({icons: {primary: "ui-icon-arrow-1-s"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveDown(_self.targetList);});
        $(this.jqId + ' .ui-picklist-target-controls .ui-picklist-button-move-bottom').button({icons: {primary: "ui-icon-arrowstop-1-s"},text: (!this.cfg.iconOnly)}).click(function() {_self.moveBottom(_self.targetList);});
    }
}

PrimeFaces.widget.PickList.prototype.add = function() {
    var _self = this;

    this.sourceList.children('li.ui-picklist-item.ui-state-highlight').removeClass('ui-state-highlight').hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
        _self.fireOnTransferEvent(this, _self.sourceList, _self.targetList);

        _self.transfer(this, _self.targetList);
    });
}

PrimeFaces.widget.PickList.prototype.addAll = function() {
    var _self = this;

    this.sourceList.children('li.ui-picklist-item').removeClass('ui-state-highlight').hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
        _self.fireOnTransferEvent(this, _self.sourceList, _self.targetList);
        
        _self.transfer(this, _self.targetList);
    });
}

PrimeFaces.widget.PickList.prototype.remove = function() {
    var _self = this;

    this.targetList.children('li.ui-picklist-item.ui-state-highlight').removeClass('ui-state-highlight').hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
        _self.fireOnTransferEvent(this, _self.targetList, _self.sourceList);

        _self.transfer(this, _self.sourceList);
    });
}

PrimeFaces.widget.PickList.prototype.removeAll = function() {
    var _self = this;
    
    this.targetList.children('li.ui-picklist-item').removeClass('ui-state-highlight').hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
        _self.fireOnTransferEvent(this, _self.targetList, _self.sourceList);
        
        _self.transfer(this, _self.sourceList);
    });
}

PrimeFaces.widget.PickList.prototype.moveUp = function(list) {
    var _self = this;

    list.children('.ui-state-highlight').each(function() {
        var item = $(this);

        if(!item.is(':first-child')) {
            item.hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                item.insertBefore(item.prev()).show(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                    _self.saveState();
                });
            });
        }
    });
}

PrimeFaces.widget.PickList.prototype.moveTop = function(list) {
    var _self = this;

    list.children('.ui-state-highlight').each(function() {
        var item = $(this);

        if(!item.is(':first-child')) {
            item.hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                item.prependTo(item.parent()).show(_self.cfg.effect, {}, _self.cfg.effectSpeed, function(){
                    _self.saveState();
                });
            });
        }

    });
}

PrimeFaces.widget.PickList.prototype.moveDown = function(list) {
    var _self = this;

    list.children('.ui-state-highlight').each(function() {
        var item = $(this);

        if(!item.is(':last-child')) {
            item.hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                item.insertAfter(item.next()).show(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                    _self.saveState();
                });
            });
        }

    });
}

PrimeFaces.widget.PickList.prototype.moveBottom = function(list) {
    var _self = this;

    list.children('.ui-state-highlight').each(function() {
        var item = $(this);

        if(!item.is(':last-child')) {
            item.hide(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                item.appendTo(item.parent()).show(_self.cfg.effect, {}, _self.cfg.effectSpeed, function() {
                    _self.saveState();
                });
            });
        }

    });
}

PrimeFaces.widget.PickList.prototype.onUpdate = function(event, ui) {
    ui.item.removeClass('ui-state-highlight');

    this.saveState();
}

PrimeFaces.widget.PickList.prototype.saveState = function() {
    this.saveListState(this.sourceList, this.sourceState);
    this.saveListState(this.targetList, this.targetState);
}

PrimeFaces.widget.PickList.prototype.transfer = function(element, to) {
    var _self = this;

    $(element).appendTo(to).show(this.cfg.effect, {}, this.cfg.effectSpeed, function() {_self.saveState();});
}

PrimeFaces.widget.PickList.prototype.saveListState = function(list, holder) {
    var values = [],
    pojo = this.cfg.pojo;
    
    $(list).children('li.ui-picklist-item').each(function() {
        var item = $(this),
        itemValue = pojo ? item.data('itemValue') : item.html();

        values.push(itemValue);
    });
    
    holder.val(values.join(','));
}

/**
 * Parses item values and assigns to li elements
 */
PrimeFaces.widget.PickList.prototype.parseItemValues = function(state, list) {
    var itemValues = state.val().split(','),
    itemElements = list.children('li');

    for(var i in itemValues) {
        $(itemElements.get(i)).data('itemValue', itemValues[i]);
    }
}

/**
 * Invokes client side onchange callback if defined
 */
PrimeFaces.widget.PickList.prototype.fireOnTransferEvent = function(item, from, to) {

    if(this.cfg.onTransfer) {
        var obj = {};
        obj.item = item;
        obj.from = from;
        obj.to = to;

        this.cfg.onTransfer.call(this, obj);
    }
}
