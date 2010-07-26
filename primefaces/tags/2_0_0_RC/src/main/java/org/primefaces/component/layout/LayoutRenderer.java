/*
 * Copyright 2009 Prime Technology.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.primefaces.component.layout;

import java.io.IOException;
import java.util.Iterator;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import org.primefaces.renderkit.CoreRenderer;

public class LayoutRenderer extends CoreRenderer {
	
	@Override
	public void encodeBegin(FacesContext facesContext, UIComponent component) throws IOException {
		ResponseWriter writer = facesContext.getResponseWriter();
		Layout layout = (Layout) component;
		String var = createUniqueWidgetVar(facesContext, layout);
		
		String targetElement = null;
		if(layout.isFullPage())																//full page layout
			targetElement = "body";
		else if(layout.getParent() instanceof LayoutUnit)
			targetElement = layout.getParent().getClientId(facesContext);					//nested layouts
		else
			targetElement = layout.getClientId(facesContext);								//element based layout
		
		writer.startElement("script", null);
		writer.writeAttribute("type", "text/javascript", null);
		
		writer.write("jQuery(document).ready(function() {\n");
		writer.write(var + " = new PrimeFaces.widget.Layout('" + targetElement + "', {");

		for (Iterator<UIComponent> kids = layout.getChildren().iterator(); kids.hasNext();) {
			UIComponent kid = kids.next();
			
			if(kid.isRendered() && kid instanceof LayoutUnit) {
				LayoutUnit unit = (LayoutUnit) kid;
				String jqId = escapeJQId(unit.getClientId(facesContext));
				
				writer.write(unit.getPosition() + ": {");
				writer.write("paneSelector:'" + jqId + "'");
				if(!unit.isResizable()) writer.write(",resizable:false");
				if(!unit.isClosable()) writer.write(",closable:false");
				if(!unit.isSlidable()) writer.write(",slidable:false");
				if(unit.getSize() != null) writer.write(",size:" + unit.getSize());
				if(unit.getMinSize() != 50) writer.write(",minSize:" + unit.getMinSize());
				if(unit.getMaxSize() != 0) writer.write(",maxSize:" + unit.getMaxSize());
				if(unit.getSpacingOpen() != 6) writer.write(",spacing_open:" + unit.getSpacingOpen());
				if(unit.getSpacingClosed() != 6) writer.write(",spacing_closed:" + unit.getSpacingClosed());
				if(unit.isClosed()) writer.write(",initClosed:true");
				if(unit.getEffect() != null) writer.write(",fxName:'" + unit.getEffect() + "'");
				if(unit.getEffectSpeed() != null) writer.write(",fxSpeed:'" + unit.getEffectSpeed() + "'");
				
				writer.write("}");
				
				if(kids.hasNext())
					writer.write(",");
			}
		}
		
		writer.write("});});\n");
		
		writer.endElement("script");
		
		if(isElementLayout(layout)) {
			writer.startElement("div", layout);
			writer.writeAttribute("id", layout.getClientId(facesContext), null);
			
			if(layout.getStyle() != null) writer.writeAttribute("style", layout.getStyle(), null);
			if(layout.getStyleClass() != null) writer.writeAttribute("class", layout.getStyleClass(), null);
		}
	}
	
	private String escapeJQId(String id) {
		return "#" + id.replaceAll(":", "\\\\\\\\:");
	}

	@Override
	public void encodeEnd(FacesContext facesContext, UIComponent component) throws IOException {
		Layout layout = (Layout) component;
		
		if(isElementLayout(layout)) {
			ResponseWriter writer = facesContext.getResponseWriter();
			
			writer.endElement("div");
		}
	}
	
	private boolean isElementLayout(Layout layout) {
		return !(layout.isFullPage()) && !(layout.getParent() instanceof LayoutUnit);
	}
}