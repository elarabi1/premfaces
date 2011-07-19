/**
 * PrimeFaces Sheet Widget
 */
PrimeFaces.widget.Sheet = function(id, cfg) {
    this.id = id;
    this.jqId = PrimeFaces.escapeClientId(this.id);
    this.jq = $(this.jqId);
    this.header = this.jq.children('.ui-sheet-header');
    this.body = this.jq.children('.ui-sheet-body');
    this.cfg = cfg;
    this.editor = $(this.jqId + ' .ui-sheet-editor-bar').find('.ui-sheet-editor');
    var _self = this;

    //sync body scroll with header
    this.body.scroll(function() {
        _self.header.scrollLeft(_self.body.scrollLeft());
    });
    
    this.bindEvents();
    
    this.setupResizableColumns();
}

PrimeFaces.widget.Sheet.prototype.bindEvents = function() {
    var _self = this,
    cells = this.body.find('div.ui-sh-c');

    //events for data cells
    cells.click(function(e) {
        var cell = $(this);
        _self.current = cell;

        cells.filter('.ui-state-highlight').removeClass('ui-state-highlight');
        cell.addClass('ui-state-highlight');
        _self.editor.val(cell.children('.ui-sh-c-d').html());
    })
    .dblclick(function(e) {
        var cell = $(this),
        oldWidth = cell.width(),
        padding = cell.innerWidth() - cell.width(),
        newWidth = oldWidth + padding;

        //change cell structure to allocate all the space
        cell.data('oldWidth', oldWidth)
        .removeClass('ui-state-highlight')
        .css('padding', '0px')
        .width(newWidth);

        //switch to edit mode    
        cell.children('.ui-sh-c-d').hide();
        cell.children('.ui-sh-c-e').show().children('input:first').focus();
    });

    //events for input controls in data cells
    cells.find('input').blur(function(e) {
        //switch to display mode if anything other than editor is clicked
        var editableContainer = _self.current.children('.ui-sh-c-e'),
        editableValue = editableContainer.children('input:first').val();

        _self.current.children('.ui-sh-c-d').html(editableValue).show();
        editableContainer.hide();

        //restore cell structure
        _self.current.css('padding', '').width(_self.current.data('oldWidth')).removeData('oldWidth');

    }).keyup(function(e) {
        //switch to display mode when enter is pressed during editing
        var keyCode = $.ui.keyCode,
        key = e.which,
        input = $(this);

        if(key == keyCode.ENTER || key == keyCode.NUMPAD_ENTER) {
            input.blur();
        } 
        else {
            _self.editor.val(input.val());
        }
    });

    //events for global editor
    this.editor.keydown(function(e) {
        //update cell value on enter key
        var keyCode = $.ui.keyCode,
        key = e.which,
        editor = $(this);

        if(key == keyCode.ENTER || key == keyCode.NUMPAD_ENTER) {
            _self.current.children('.ui-sh-c-d').html(editor.val());
            _self.current.find('input:first').val(editor.val());
            editor.val('');
        }
    }).focus(function(e) {
        //highlight current cell
        _self.current.addClass('ui-state-highlight');
    });

    //keyboard navigation for datacells
    $(document).keydown(function(e) {
        var target = $(e.target);
        if(!target.is('html') && !target.is(document.body)) {
            return;
        }

        if(cells.filter('.ui-state-highlight').length > 0) {
            var keyCode = $.ui.keyCode,
            key = e.which,
            current = _self.current;

            switch(e.which) {
                case keyCode.RIGHT:
                    current.parent().next().children('div.ui-sh-c').click();
                    e.preventDefault();
                break;

                case keyCode.LEFT:
                    current.parent().prev().children('div.ui-sh-c').click();
                    e.preventDefault();
                break;

                case keyCode.ENTER:
                case keyCode.NUMPAD_ENTER:
                case keyCode.DOWN:
                    current.parents('tr:first').next().children().eq(current.parent().index()).children('div.ui-sh-c').click();
                    e.preventDefault();
                break;

                case keyCode.UP:
                    current.parents('tr:first').prev().children().eq(current.parent().index()).children('div.ui-sh-c').click();
                    e.preventDefault();
                break;
            }
        }


    });
}

PrimeFaces.widget.Sheet.prototype.setupResizableColumns = function() {
    //Add resizers and resizer helper
    this.header.find('th div.ui-sh-c').prepend('<div class="ui-column-resizer"></div>');
    this.jq.append('<div class="ui-column-resizer-helper ui-state-highlight"></div>');

    //Variables
    var resizerHelper = $(this.jqId + ' .ui-column-resizer-helper'),
    resizers = $(this.jqId + ' thead th div.ui-column-resizer'),
    frozenHeaderRow = this.header.find('tbody'),
    columnHeaders = this.header.find('thead th'),
    thead = $(this.jqId + ' thead'),
    _self = this;
    
    //State cookie
    this.columnWidthsCookie = this.id + '_columnWidths';
    
    //Main resize events
    resizers.draggable({
        axis: 'x',
        start: function(event, ui) {
            //Set height of resizer helper
            resizerHelper.height(_self.body.height() + frozenHeaderRow.height());
            resizerHelper.show();
        },
        drag: function(event, ui) {
            resizerHelper.offset(
                {
                    left: ui.helper.offset().left + ui.helper.width() / 2, 
                    top: thead.offset().top + thead.height()
                });  
        },
        stop: function(event, ui) {
            var columnHeaderWrapper = ui.helper.parent(),
            columnHeader = columnHeaderWrapper.parent(),
            oldPos = ui.originalPosition.left,
            newPos = ui.position.left,
            change = (newPos - oldPos),
            newWidth = columnHeaderWrapper.width() + change;
            
            ui.helper.css('left','');
            resizerHelper.hide();
            
            columnHeaderWrapper.width(newWidth);
                        
            _self.header.find('tbody tr td:nth-child(' + (columnHeader.index() + 1) + ')').width('').children('div').width(newWidth);
            _self.body.find('tr td:nth-child(' + (columnHeader.index() + 1) + ')').width('').children('div').width(newWidth);
            
            //Save state
            var columnWidths = [];
            columnHeaders.each(function(i, item) {
                columnWidths.push($(item).children('div').width());
            });
            PrimeFaces.setCookie(_self.columnWidthsCookie, columnWidths.join(','));
        },
        containment: this.jq
    });
    
    //Restore widths on postback
    var widths = PrimeFaces.getCookie(this.columnWidthsCookie);
    if(widths) {
        widths = widths.split(',');
        for(var i = 0; i < widths.length; i++) {
            var width = widths[i];
            
            columnHeaders.eq(i).children('div').width(width);
            _self.header.find('tbody tr td:nth-child(' + (i + 1) + ')').children('div').width(width);
            _self.body.find('tr td:nth-child(' + (i + 1) + ')').children('div').width(width);
        }
    }

}