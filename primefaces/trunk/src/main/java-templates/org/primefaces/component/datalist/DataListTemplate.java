import javax.faces.FacesException;
import javax.faces.event.PhaseId;
import javax.faces.component.UIColumn;
import javax.faces.component.behavior.Behavior;
import javax.faces.event.BehaviorEvent;
import javax.faces.event.FacesEvent;
import javax.faces.event.FacesListener;

	public static final String DATALIST_CLASS = "ui-datalist ui-widget";
    public static final String HEADER_CLASS = "ui-datalist-header ui-widget-header ui-corner-top";
    public static final String CONTENT_CLASS = "ui-datalist-content ui-widget-content";
	public static final String LIST_CLASS = "ui-datalist-data";
	public static final String LIST_ITEM_CLASS = "ui-datalist-item";
	
	public String getListTag() {
		String type = getType();
		
		if(type.equalsIgnoreCase("unordered"))
			return "ul";
		else if(type.equalsIgnoreCase("ordered"))
			return "ol";
		else if(type.equalsIgnoreCase("definition"))
			return "dl";
        else if(type.equalsIgnoreCase("none"))
            return null;
        else
			throw new FacesException("DataList '" + this.getClientId() + "' has invalid list type:'" + type + "'");
	}
	
	public boolean isDefinition() {
		return getType().equalsIgnoreCase("definition");
	}

    public boolean isPagingRequest(FacesContext context) {
        return context.getExternalContext().getRequestParameterMap().containsKey(getClientId(context) + "_ajaxPaging");
    }

    protected void updatePaginationMetadata(FacesContext context) {
        ValueExpression firstVe = this.getValueExpression("first");
        ValueExpression rowsVe = this.getValueExpression("rows");
        ValueExpression pageVE = this.getValueExpression("page");

        if(firstVe != null)
            firstVe.setValue(context.getELContext(), getFirst());
        if(rowsVe != null)
            rowsVe.setValue(context.getELContext(), getRows());
        if(pageVE != null)
            pageVE.setValue(context.getELContext(), getPage());
    }

    @Override
    public void processDecodes(FacesContext context) {
        if(!isRendered()) {
            return;
        }

		if(isPagingRequest(context)) {
            this.decode(context);

            updatePaginationMetadata(context);

            context.renderResponse();
        }
        else {
            if(getVar() == null) {
                pushComponentToEL(context, this);
                iterateChildren(context, PhaseId.APPLY_REQUEST_VALUES);
                decode(context);
                popComponentFromEL(context);
            } 
            else {
                super.processDecodes(context);
            }
        }
	}

    @Override
    public void processValidators(FacesContext context) {
        if(!isRendered()) {
            return;
        }

		if(getVar() == null) {
            pushComponentToEL(context, this);
            iterateChildren(context, PhaseId.PROCESS_VALIDATIONS);
            popComponentFromEL(context);
        } 
        else {
            super.processValidators(context);
        }
	}
    
    @Override
    public void processUpdates(FacesContext context) {
        if(!isRendered()) {
            return;
        }

		if(getVar() == null) {
            pushComponentToEL(context, this);
            iterateChildren(context, PhaseId.UPDATE_MODEL_VALUES);
            popComponentFromEL(context);
        } 
        else {
            super.processUpdates(context);
        }
	}

    protected void iterateChildren(FacesContext context, PhaseId phaseId) {
        setRowIndex(-1);
        if(getChildCount() > 0) {
            for(UIComponent kid : this.getChildren()) {
                if(phaseId == PhaseId.APPLY_REQUEST_VALUES)
                    kid.processDecodes(context);
                else if (phaseId == PhaseId.PROCESS_VALIDATIONS)
                    kid.processValidators(context);
                else if (phaseId == PhaseId.UPDATE_MODEL_VALUES)
                    kid.processUpdates(context);
                else
                    throw new IllegalArgumentException();
            }
        }
    }

    public void queueEvent(FacesEvent event) {
        if(getVar() != null) {
            super.queueEvent(event);
        }
        else {
            if(event == null) {
                throw new NullPointerException();
            }
            
            UIComponent parent = getParent();
            if(parent == null)
                throw new IllegalStateException();
            else
                parent.queueEvent(event);
        }
    }


    public void broadcast(FacesEvent event) throws AbortProcessingException {
        if(getVar() != null) {
            super.broadcast(event);
        }
        else {

            if(event == null) {
                throw new NullPointerException();
            }
            if(event instanceof BehaviorEvent) {
                BehaviorEvent behaviorEvent = (BehaviorEvent) event;
                Behavior behavior = behaviorEvent.getBehavior();
                behavior.broadcast(behaviorEvent);
            }
        }
    }