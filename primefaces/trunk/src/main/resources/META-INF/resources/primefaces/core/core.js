jQuery(document).ready(function() {
    jQuery('body').addClass('yui-skin-sam');
});

PrimeFaces = {

    escapeClientId : function(id) {
        return "#" + id.replace(/:/g,"\\:");
    },
	
    onContentReady : function(id, fn) {
        YAHOO.util.Event.onContentReady(id, fn, window, true);
    },
	
    cleanWatermarks : function(){
        jQuery.watermark.hideAll();
    },
	
    showWatermarks : function(){
        jQuery.watermark.showAll();
    },
	
    addSubmitParam : function(parent, params) {
        var escapedId = this.escapeClientId(parent);
		
        for(var param in params) {
            if(jQuery(escapedId).children("input[name=\"" + param + "\"]").length == 0)
                jQuery(escapedId).append("<input type=\"hidden\" name=\"" + param + "\" value=\"" + params[param] + "\"/>");
        }
    },
	
    PARTIAL_REQUEST_PARAM : "javax.faces.partial.ajax",
    PARTIAL_UPDATE_PARAM : "javax.faces.partial.render",
    PARTIAL_PROCESS_PARAM : "javax.faces.partial.execute",
    PARTIAL_SOURCE_PARAM : "javax.faces.source",
    VIEW_STATE : "javax.faces.ViewState"
};

PrimeFaces.ajax = {};
PrimeFaces.widget = {};

PrimeFaces.ajax.AjaxUtils = {
	
    encodeViewState : function() {
        var viewstateValue = document.getElementById(PrimeFaces.VIEW_STATE).value;
        var re = new RegExp("\\+", "g");
        var encodedViewState = viewstateValue.replace(re, "\%2B");
		
        return encodedViewState;
    },
	
    updateState: function(value) {
        jQuery('#javax\\.faces\\.ViewState').val(value);
    },
	
    serialize: function(params) {
        var serializedParams = '';
		
        for(var param in params) {
            serializedParams = serializedParams + "&" + param + "=" + params[param];
        }
		
        return serializedParams;
    }
};

PrimeFaces.ajax.AjaxRequest = function(actionURL, cfg, params) {
    var requestParams;

    if(cfg.formId) {
        var jqForm = PrimeFaces.escapeClientId(cfg.formId),
        requestParams = jQuery(jqForm).serialize();
    } else {
        requestParams = PrimeFaces.VIEW_STATE + "=" + PrimeFaces.ajax.AjaxUtils.encodeViewState();
    }

    //partial ajax
    requestParams = requestParams + "&" + PrimeFaces.PARTIAL_REQUEST_PARAM + "=true";

    //source
    requestParams = requestParams + "&" + PrimeFaces.PARTIAL_SOURCE_PARAM + "=" + cfg.source;
    requestParams = requestParams + "&" + cfg.source + "=" + cfg.source;

    //process
    if(cfg.process) {
        requestParams = requestParams + "&" + PrimeFaces.PARTIAL_PROCESS_PARAM + "=" + cfg.process;
    }

    //update
    if(cfg.update) {
        requestParams = requestParams + "&" + PrimeFaces.PARTIAL_UPDATE_PARAM + "=" + cfg.update;
    }

    //params
    if(params) {
        requestParams = requestParams + PrimeFaces.ajax.AjaxUtils.serialize(params);
    }
	
    var xhrOptions = {
        url : actionURL,
        type : "POST",
        cache : false,
        dataType : "xml",
        data : requestParams,
        beforeSend: function(xhr) {
           xhr.setRequestHeader('Faces-Request', 'partial/ajax');

           if(cfg.onstart) {
               cfg.onstart.call(this, xhr);
           }
        },
        success : function(data, status, xhr) {
            if(cfg.onsuccess) {
                var value = cfg.onsuccess.call(this, data, status, xhr);
                if(value === false)
                    return;
            }
		
            PrimeFaces.ajax.AjaxResponse.call(this, data, status, xhr);
        },
        complete : function(xhr, status) {
            if(cfg.oncomplete) {
                cfg.oncomplete.call(this, xhr, status, this.args);
            }

            PrimeFaces.ajax.RequestManager.poll();
        }
    };
	
    xhrOptions.global = cfg.global === false ? false : true;
	
    if(cfg.onerror) {
        xhrOptions.error = cfg.onerror;
    }

    if(cfg.async) {
        jQuery.ajax(xhrOptions);
    } else {
        PrimeFaces.ajax.RequestManager.offer(xhrOptions);
    }
}

PrimeFaces.ajax.AjaxResponse = function(responseXML) {
    var xmlDoc = responseXML.documentElement,
    updates = xmlDoc.getElementsByTagName("update"),
    redirect = xmlDoc.getElementsByTagName("redirect"),
    extensions = xmlDoc.getElementsByTagName("extension");

    if(redirect.length > 0) {
        window.location = redirect[0].attributes.getNamedItem("url").nodeValue;
    } else {

        for(var i=0; i < updates.length; i++) {
            var id = updates[i].attributes.getNamedItem("id").nodeValue,
            content = updates[i].firstChild.data;

            if(id == PrimeFaces.VIEW_STATE) {
                PrimeFaces.ajax.AjaxUtils.updateState(content);
            }
            else {
                jQuery(PrimeFaces.escapeClientId(id)).replaceWith(content);
            }
        }
    }

    this.args = {};
    for(i=0; i < extensions.length; i++) {
        var extension = extensions[i];
        
        if(extension.hasAttribute('primefacesCallbackParam')) {
            var jsonObj = jQuery.parseJSON(extension.firstChild.data);

            for(var paramName in jsonObj) {
                if(paramName)
                    this.args[paramName] = jsonObj[paramName];
            }
        }
    }
}

PrimeFaces.ajax.RequestManager = {
		
    requests : new Array(),

    offer : function(req) {
        this.requests.push(req);

        if(this.requests.length == 1) {
            var retVal = jQuery.ajax(req);
            if(retVal === false)
                this.poll();
        }
    },

    poll : function() {
        if(this.isEmpty()) {
            return null;
        }
 
        var processedRequest = this.requests.shift();
        var nextRequest = this.peek();
        if(nextRequest != null) {
            jQuery.ajax(nextRequest);
        }

        return processedRequest;
    },

    peek : function() {
        if(this.isEmpty()) {
            return null;
        }
    
        var nextRequest = this.requests[0];
  
        return nextRequest;
    },
    
    isEmpty : function() {
        return this.requests.length == 0;
    }
};