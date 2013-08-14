/**
 * PrimeFaces Client Side Validation Framework
 */
(function(PrimeFaces) {
    
    if(PrimeFaces.validator) {
        PrimeFaces.debug("PrimeFaces client side validation framework already loaded, ignoring duplicate execution.");
        return;
    }
    
    PrimeFaces.locales['en_US'] = {
        messages: {
            'javax.faces.component.UIInput.REQUIRED': '{0}: Validation Error: Value is required.',
            'javax.faces.converter.IntegerConverter.INTEGER': '{2}: \'{0}\' must be a number consisting of one or more digits.',
            'javax.faces.converter.IntegerConverter.INTEGER_detail': '{2}: \'{0}\' must be a number between -2147483648 and 2147483647 Example: {1}',
            'javax.faces.converter.DoubleConverter.DOUBLE': '{2}: \'{0}\' must be a number consisting of one or more digits.',
            'javax.faces.converter.DoubleConverter.DOUBLE_detail': '{2}: \'{0}\' must be a number between 4.9E-324 and 1.7976931348623157E308  Example: {1}',
            'javax.faces.validator.LongRangeValidator.MAXIMUM': '{1}: Validation Error: Value is greater than allowable maximum of \'{0}\'',
            'javax.faces.validator.LongRangeValidator.MINIMUM': '{1}: Validation Error: Value is less than allowable minimum of \'{0}\'',
            'javax.faces.validator.LongRangeValidator.NOT_IN_RANGE': '{2}: Validation Error: Specified attribute is not between the expected values of {0} and {1}.',
            'javax.faces.validator.LongRangeValidator.TYPE={0}': 'Validation Error: Value is not of the correct type.',
            'javax.faces.validator.DoubleRangeValidator.MAXIMUM': '{1}: Validation Error: Value is greater than allowable maximum of \'{0}\'',
            'javax.faces.validator.DoubleRangeValidator.MINIMUM': '{1}: Validation Error: Value is less than allowable minimum of \'{0}\'',
            'javax.faces.validator.DoubleRangeValidator.NOT_IN_RANGE': '{2}: Validation Error: Specified attribute is not between the expected values of {0} and {1}',
            'javax.faces.validator.DoubleRangeValidator.TYPE={0}': 'Validation Error: Value is not of the correct type',
            'javax.faces.converter.FloatConverter.FLOAT': '{2}: \'{0}\' must be a number consisting of one or more digits.',
            'javax.faces.converter.FloatConverter.FLOAT_detail': '{2}: \'{0}\' must be a number between 1.4E-45 and 3.4028235E38  Example: {1}',
            'javax.faces.validator.LengthValidator.MINIMUM': '{1}: Validation Error: Length is less than allowable minimum of \'{0}\'',
            'javax.faces.validator.LengthValidator.MAXIMUM': '{1}: Validation Error: Length is greater than allowable maximum of \'{0}\'',
            'javax.faces.validator.RegexValidator.PATTERN_NOT_SET': 'Regex pattern must be set.',
            'javax.faces.validator.RegexValidator.PATTERN_NOT_SET_detail': 'Regex pattern must be set to non-empty value.',
            'javax.faces.validator.RegexValidator.NOT_MATCHED': 'Regex Pattern not matched',
            'javax.faces.validator.RegexValidator.NOT_MATCHED_detail': 'Regex pattern of \'{0}\' not matched',
            'javax.faces.validator.RegexValidator.MATCH_EXCEPTION': 'Error in regular expression.',
            'javax.faces.validator.RegexValidator.MATCH_EXCEPTION_detail': 'Error in regular expression, \'{0}\''
        }
    };
   
    PrimeFaces.validator = {
        
        'javax.faces.Length': {
            
            MINIMUM_MESSAGE_ID: 'javax.faces.validator.LengthValidator.MINIMUM',
            
            MAXIMUM_MESSAGE_ID: 'javax.faces.validator.LengthValidator.MAXIMUM',
            
            validate: function(element) {
                var length = element.val().length,
                min = element.data('p-minlength'),
                max = element.data('p-maxlength'),
                mf = PrimeFaces.util.MessageFactory;
                
                if(max !== undefined && length > max) {
                    throw mf.getMessage(this.MAXIMUM_MESSAGE_ID, max, mf.getLabel(element));
                }
                
                if(min !== undefined && length < min) {
                    throw mf.getMessage(this.MINIMUM_MESSAGE_ID, min, mf.getLabel(element));
                }
            }
        },
                
        'javax.faces.LongRange': {
            
            MINIMUM_MESSAGE_ID: 'javax.faces.validator.LongRangeValidator.MINIMUM',
            MAXIMUM_MESSAGE_ID: 'javax.faces.validator.LongRangeValidator.MAXIMUM',
            NOT_IN_RANGE_MESSAGE_ID: 'javax.faces.validator.LongRangeValidator.NOT_IN_RANGE',
            TYPE_MESSAGE_ID: 'javax.faces.validator.LongRangeValidator.TYPE',
            regex: /^-?\d+$/,
            
            validate: function(element, value) {
                var min = element.data('p-minvalue'),
                max = element.data('p-maxvalue'),
                mf = PrimeFaces.util.MessageFactory;
        
                if(!this.regex.test(element.val())) {
                    throw mf.getMessage(this.TYPE_MESSAGE_ID, mf.getLabel(element));
                }
        
                if((max !== undefined && min !== undefined) && (value < min || value > max)) {
                    throw mf.getMessage(this.NOT_IN_RANGE_MESSAGE_ID, min, max, mf.getLabel(element));
                }
                else if((max !== undefined && min === undefined) && (value > max)) {
                    throw mf.getMessage(this.MAXIMUM_MESSAGE_ID, max, mf.getLabel(element));
                }
                else if((min !== undefined && max === undefined) && (value < min)) {
                    throw mf.getMessage(this.MINIMUM_MESSAGE_ID, min, mf.getLabel(element));
                }
            }
        },
                
        'javax.faces.DoubleRange': {
            
            MINIMUM_MESSAGE_ID: 'javax.faces.validator.DoubleRangeValidator.MINIMUM',
            MAXIMUM_MESSAGE_ID: 'javax.faces.validator.DoubleRangeValidator.MAXIMUM',
            NOT_IN_RANGE_MESSAGE_ID: 'javax.faces.validator.DoubleRangeValidator.NOT_IN_RANGE',
            TYPE_MESSAGE_ID: 'javax.faces.validator.DoubleRangeValidator.TYPE',
            regex: /^[-+]?\d+(\.\d+)?[d]?$/,
            
            validate: function(element, value) {
                var min = element.data('p-minvalue'),
                max = element.data('p-maxvalue'),
                mf = PrimeFaces.util.MessageFactory;
        
                if(!this.regex.test(element.val())) {
                    throw mf.getMessage(this.TYPE_MESSAGE_ID, mf.getLabel(element));
                }
        
                if((max !== undefined && min !== undefined) && (value < min || value > max)) {
                    throw mf.getMessage(this.NOT_IN_RANGE_MESSAGE_ID, min, max, mf.getLabel(element));
                }
                else if((max !== undefined && min === undefined) && (value > max)) {
                    throw mf.getMessage(this.MAXIMUM_MESSAGE_ID, max, mf.getLabel(element));
                }
                else if((min !== undefined && max === undefined) && (value < min)) {
                    throw mf.getMessage(this.MINIMUM_MESSAGE_ID, min, mf.getLabel(element));
                }
            }
        },
                
        'javax.faces.RegularExpression': {
            
            PATTERN_NOT_SET_MESSAGE_ID: 'javax.faces.validator.RegexValidator.PATTERN_NOT_SET',
            NOT_MATCHED_MESSAGE_ID: 'javax.faces.validator.RegexValidator.NOT_MATCHED',
            MATCH_EXCEPTION_MESSAGE_ID: 'javax.faces.validator.RegexValidator.MATCH_EXCEPTION',
            
            validate: function(element, value) {
                if(!value) {
                    return;
                }
        
                var pattern = element.data('p-regex'),
                mf = PrimeFaces.util.MessageFactory;
                
                if(!pattern) {
                    throw mf.getMessage(this.PATTERN_NOT_SET_MESSAGE_ID);
                }
                
                var regex = new RegExp(pattern);
                if(!regex.test(value)) {
                    throw mf.getMessage(this.NOT_MATCHED_MESSAGE_ID, pattern);
                }
            }
        }
    };
    
    PrimeFaces.converter = {
    
        'javax.faces.Integer': {
            
            regex: /^[-+]?\d+$/,
                    
            MESSAGE_ID: 'javax.faces.converter.IntegerConverter.INTEGER',
            
            convert: function(element) {
                var value = element.val(),
                mf = PrimeFaces.util.MessageFactory;
        
                if($.trim(value).length === 0) {
                    return null;
                }
                
                if(!this.regex.test(value)) {
                    throw mf.getMessage(this.MESSAGE_ID, value, 9346, mf.getLabel(element));
                }
                
                return parseInt(value);
            }
        },
                
        'javax.faces.Double': {
            
            regex: /^[-+]?\d+(\.\d+)?[d]?$/,
                    
            MESSAGE_ID: 'javax.faces.converter.DoubleConverter.DOUBLE',
            
            convert: function(element) {
                var value = element.val(),
                mf = PrimeFaces.util.MessageFactory;
        
                if($.trim(value).length === 0) {
                    return null;
                }
                
                if(!this.regex.test(value)) {
                    throw mf.getMessage(this.MESSAGE_ID, value, 1999999, mf.getLabel(element));
                }
                
                return parseFloat(value);
            }
        },
                
        'javax.faces.Float': {
            
            regex: /^[-+]?\d+(\.\d+)?[f]?$/,
                    
            MESSAGE_ID: 'javax.faces.converter.FloatConverter.FLOAT',
            
            convert: function(element) {
                var value = element.val(),
                mf = PrimeFaces.util.MessageFactory;
        
                if($.trim(value).length === 0) {
                    return null;
                }
                
                if(!this.regex.test(value)) {
                    throw mf.getMessage(this.MESSAGE_ID, value, 2000000000, mf.getLabel(element));
                }
                
                return parseFloat(value);
            }
        }
    };
        
    PrimeFaces.vb = function(cfg) {
        return this.validate(cfg);
    }
       
    PrimeFaces.validate = function(cfg) {
        var exceptions = [],
        mf = PrimeFaces.util.MessageFactory;
        
        if(cfg.ajax) {
            
        }
        else {
            var form = $(cfg.source).closest('form');
            
            if(form.length) {
                var inputs = form.find(':input:visible:enabled:not(:button)'),
                valid = true;
                
                for(var i = 0; i < inputs.length; i++) {
                    var inputElement = inputs.eq(i),
                    submittedValue = inputElement.val(),
                    value = submittedValue,
                    valid = true,
                    converterId = inputElement.data('p-con');
                    
                    if(converterId) {
                        try {
                            value = PrimeFaces.converter[converterId].convert(inputElement);
                        }
                        catch(ce) {
                            valid = false;
                            exceptions.push(ce);
                        }
                    }
                    
                    if(valid && inputElement.data('p-required') && submittedValue === '') {
                        exceptions.push(mf.getMessage('javax.faces.component.UIInput.REQUIRED', mf.getLabel(inputElement)));
                        valid = false;
                    }
                                        
                    if(valid && ((submittedValue !== '')||PrimeFaces.settings.validateEmptyFields)) {
                        var validatorIds = inputElement.data('p-val');
                        if(validatorIds) {
                            validatorIds = validatorIds.split(',');

                            for(var j = 0; j < validatorIds.length; j++) {
                                var validatorId = validatorIds[j],
                                validator = PrimeFaces.validator[validatorId];

                                if(validator) {
                                    try {
                                        validator.validate(inputElement, value);
                                    }
                                    catch(ve) {
                                        valid = false;
                                        exceptions.push(ve);
                                    }
                                }
                            }
                        }
                    }
                    
                    if(!valid) {
                        inputElement.addClass('ui-state-error');
                    }
                }
            }
        }
        
        if(exceptions.length === 0) {
            return true;
        }
        else {
            var uimessages = form.find('.ui-messages');
            if(uimessages.length) {
                PrimeFaces.util.MessageRenderer.render(uimessages, exceptions);
            }
            
            return false;
        }
    }
    
    PrimeFaces.util.MessageRenderer = {
        
        render: function(element, exceptions) {
            element.html('');
            element.append('<div class="ui-messages-error ui-corner-all"><span class="ui-messages-error-icon"></span><ul></ul></div>');
            var messageList = element.find('> .ui-messages-error > ul');
            
            for(var i = 0; i < exceptions.length; i++) {
                var msg = exceptions[i];
                messageList.append('<li><span class="ui-messages-error-summary">' + msg.summary + '</span><span class="ui-messages-error-detail">' + msg.detail + '</span></li>');
            }
        }
    }
    
    PrimeFaces.util.MessageFactory = {
        
        getMessage: function(key) {
            var bundle = PrimeFaces.locales[PrimeFaces.settings.locale];
            if(bundle) {
                var s = bundle.messages[key],
                d = bundle.messages[key + '_detail'];

                s = this.format(s, arguments);
                
                if(d)
                    d = this.format(d, arguments);
                else
                    d = s;
                                
                return {
                    summary: s,
                    detail: d
                }
            }
            
            return null;
        },
        
        format: function(str, params) {
            var s = str;
            for(var i = 0; i < params.length - 1; i++) {       
                var reg = new RegExp('\\{' + i + '\\}', 'gm');             
                s = s.replace(reg, params[i + 1]);
            }
            
            return s;
        },
                
        getLabel: function(element) {
            return (element.data('p-label')||element.attr('id'))
        }
    };

})(PrimeFaces);