/**
 * PrimeFaces Galleria Widget
 */
PrimeFaces.widget.Galleria = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);

        this.cfg.panelWidth = this.cfg.panelWidth||600;
        this.cfg.panelHeight = this.cfg.panelHeight||400;
        this.cfg.frameWidth = this.cfg.frameWidth||60;
        this.cfg.frameHeight = this.cfg.frameHeight||40;
        this.cfg.activeIndex = 0;
        this.cfg.showFilmstrip = (this.cfg.showFilmstrip === false) ? false : true;
        this.cfg.autoPlay = (this.cfg.autoPlay === false) ? false : true;
        this.cfg.transitionInterval = this.cfg.transitionInterval||4000;
        this.cfg.effect = this.cfg.effect||'fade';
        this.cfg.effectSpeed = this.cfg.effectSpeed||250;

        this.panelWrapper = this.jq.children('div.ui-galleria-panel-wrapper');
        this.panels = this.panelWrapper.children('div.ui-galleria-panel');
        
        var $this = this;
        if(this.jq.is(':not(:visible)')) {
            var hiddenParent = this.jq.parents('.ui-hidden-container:first'),
            hiddenParentWidget = hiddenParent.data('widget');

            if(hiddenParentWidget) {
                hiddenParentWidget.addOnshowHandler(function() {
                    return $this.render();
                });
            }
        } 
        else {
            this.render();
        }
    },
    
    render: function() {
        if(this.jq.is(':visible')) {
            var activePanel = this.panels.eq(this.cfg.activeIndex);
            activePanel.removeClass('ui-helper-hidden');
            
            this.panelWrapper.width(this.cfg.panelWidth).height(this.cfg.panelHeight);
            this.panels.width(this.cfg.panelWidth).height(this.cfg.panelHeight);
            this.jq.width(this.cfg.panelWidth);

            if(this.cfg.showFilmstrip) {
                this.renderStrip();
                this.bindEvents();
            }
            
            if(this.cfg.custom) {
                this.panels.children('img').remove();
            }

            this.jq.css('visibility', 'visible');

            if(this.cfg.autoPlay) {
                this.startSlideshow();
            }

            return true;
        } 
        else {
            return false;
        }
    },
                
    renderStrip: function() {
        //strip
        var frameStyle = 'style="width:' + this.cfg.frameWidth + "px;height:" + this.cfg.frameHeight + 'px;"';
                    
        this.stripWrapper = $('<div class="ui-galleria-filmstrip-wrapper"></div>')
                .width(this.panelWrapper.width() - 50)
                .height(this.cfg.frameHeight)
                .appendTo(this.jq);
                
        this.strip = $('<ul class="ui-galleria-filmstrip"></div>').appendTo(this.stripWrapper);
                    
        for(var i = 0; i < this.panels.length; i++) {
            var image = this.panels.eq(i).children('img'),
            frameClass = (i == this.cfg.activeIndex) ? 'ui-galleria-frame ui-galleria-frame-active' : 'ui-galleria-frame',
            frameMarkup = '<li class="'+ frameClass + '" ' + frameStyle + '>'
            + '<div class="ui-galleria-frame-content" ' + frameStyle + '>'
            + '<img src="' + image.attr('src') + '" class="ui-galleria-frame-image" ' + frameStyle + '/>'
            + '</div></li>';
                                      
            this.strip.append(frameMarkup);
        }
                    
        this.frames = this.strip.children('li.ui-galleria-frame');
                    
        //navigators
        this.jq.append('<div class="ui-galleria-nav-prev ui-icon ui-icon-circle-triangle-w" style="bottom:' + (this.cfg.frameHeight / 2) + 'px"></div>' + 
            '<div class="ui-galleria-nav-next ui-icon ui-icon-circle-triangle-e" style="bottom:' + (this.cfg.frameHeight / 2) + 'px"></div>');
        
        //caption
        if(this.cfg.showCaption) {
            this.caption = $('<div class="ui-galleria-caption"></div>').css({
                'bottom': this.stripWrapper.outerHeight(true),
                'width': this.panelWrapper.width()
                }).appendTo(this.jq);
        }
    },
                
    bindEvents: function() {
        var $this = this;
                    
        this.jq.children('div.ui-galleria-nav-prev').on('click.galleria', function() {
            if($this.slideshowActive) {
                $this.stopSlideshow();
            }
            
            if(!$this.isAnimating()) {
                $this.prev();
            }
        });
                    
        this.jq.children('div.ui-galleria-nav-next').on('click.galleria', function() {
            if($this.slideshowActive) {
                $this.stopSlideshow();
            }
            
            if(!$this.isAnimating()) {
                $this.next();
            }
        });
                    
        this.strip.children('li.ui-galleria-frame').on('click.galleria', function() {
            if($this.slideshowActive) {
                $this.stopSlideshow();
            }
            
            $this.select($(this).index(), false);
        });
    },
                
    startSlideshow: function() {
        var $this = this;
                    
        this.interval = setInterval(function() {
            $this.next();
        }, this.cfg.transitionInterval);
        
        this.slideshowActive = true;
    },
    
    stopSlideshow: function() {
        clearInterval(this.interval);
        
        this.slideshowActive = false;
    },
    
    isSlideshowActive: function() {
        return this.slideshowActive;
    },
                
    select: function(index) {
        if(index !== this.cfg.activeIndex) {
            if(this.cfg.showCaption) {
                this.caption.slideUp('fast');
            }
            
            var oldPanel = this.panels.eq(this.cfg.activeIndex),
            oldFrame = this.frames.eq(this.cfg.activeIndex),
            newPanel = this.panels.eq(index),
            newFrame = this.frames.eq(index);

            //content
            oldPanel.hide(this.cfg.effect, null, this.cfg.effectSpeed);
            newPanel.show(this.cfg.effect, null, this.cfg.effectSpeed);

            //frame
            oldFrame.removeClass('ui-galleria-frame-active').css('opacity', '');
            newFrame.animate({opacity:1.0}, this.cfg.effectSpeed, null, function() {
               $(this).addClass('ui-galleria-frame-active'); 
            });
            
            //caption
            if(this.cfg.showCaption) {
                var image = newPanel.children('img');
                this.caption.html('<h4>' + image.attr('title') + '</h4><p>' + image.attr('alt') + '</p>').slideDown('fast');
            }
            
            //viewport
            var frameLeft = newFrame.position().left,
            stepFactor = this.cfg.frameWidth + parseInt(newFrame.css('margin-right')),
            stripLeft = this.strip.position().left,
            frameViewportLeft = frameLeft + stripLeft,
            frameViewportRight = frameViewportLeft + this.cfg.frameWidth;

            if(frameViewportRight > this.stripWrapper.width()) {
                this.strip.animate({left: '-=' + stepFactor}, this.cfg.effectSpeed, 'easeInOutCirc');
            } else if(frameViewportLeft < 0) {
                this.strip.animate({left: '+=' + stepFactor}, this.cfg.effectSpeed, 'easeInOutCirc');
            }
            
            this.cfg.activeIndex = index;
        }
    },
                
    prev: function() {
        if(this.cfg.activeIndex != 0) {
            this.select(this.cfg.activeIndex - 1, true);
        }
    },
                
    next: function() {
        if(this.cfg.activeIndex !== (this.panels.length - 1)) {
            this.select(this.cfg.activeIndex + 1, true);
        }
    },
    
    isAnimating: function() {
        return this.strip.is(':animated');
    }
    
});