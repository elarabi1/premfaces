/*
 * Copyright 2010 Prime Technology.
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
package org.primefaces.component.colorpicker;

import java.io.IOException;
import java.util.Map;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.convert.ConverterException;
import org.primefaces.model.Color;

import org.primefaces.renderkit.CoreRenderer;

public class ColorPickerRenderer extends CoreRenderer {

    @Override
	public void decode(FacesContext context, UIComponent component) {
		ColorPicker colorPicker = (ColorPicker) component;
		String paramName = colorPicker.getClientId(context) + "_input";
		Map<String, String> params = context.getExternalContext().getRequestParameterMap();

		if(params.containsKey(paramName)) {
			String submittedValue = params.get(paramName);

			colorPicker.setSubmittedValue(submittedValue);
		}
	}

    @Override
	public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
		ColorPicker colorPicker = (ColorPicker) component;

		encodeMarkup(context, colorPicker);
		encodeScript(context, colorPicker);
	}

	protected void encodeMarkup(FacesContext context, ColorPicker colorPicker) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        String clientId = colorPicker.getClientId(context);
        String inputId = clientId + "_input";
        Color color = (Color) colorPicker.getValue();

        writer.startElement("div", null);
        writer.writeAttribute("id", colorPicker.getClientId(context), "id");

        //Input
		writer.startElement("input", null);
		writer.writeAttribute("id", inputId, null);
		writer.writeAttribute("name", inputId, null);
		writer.writeAttribute("type", "hidden", null);
		if(color != null) {
			writer.writeAttribute("value", color.toString(), null);
		}
		writer.endElement("input");

        writer.endElement("div");
    }

    protected void encodeScript(FacesContext context, ColorPicker colorPicker) throws IOException {
		ResponseWriter writer = context.getResponseWriter();
		String clientId = colorPicker.getClientId(context);
        Color color = (Color) colorPicker.getValue();

		writer.startElement("script", null);
		writer.writeAttribute("type", "text/javascript", null);

        writer.write("$(function() {");
        
		writer.write(colorPicker.resolveWidgetVar() + " = new PrimeFaces.widget.ColorPicker('" + clientId + "', {");
        writer.write("mode:'" + colorPicker.getMode() + "'");

        if(color != null) writer.write(",color:'" + color.getHex() + "'");

        writer.write("});});");

        writer.endElement("script");
    }

    @Override
	public Object getConvertedValue(FacesContext context, UIComponent component, Object value) throws ConverterException {
		try {
			String submittedValue = (String) value;
                    
			if(isValueBlank(submittedValue)) {
				return null;
            }

            String[] values = submittedValue.split(",");
            String hex = values[0];
            String[] rgb = values[1].split("_");
            String[] hsb = values[2].split("_");

            return new Color(hex, Integer.valueOf(rgb[0]), Integer.valueOf(rgb[1]), Integer.valueOf(rgb[2]),
                                    Integer.valueOf(hsb[0]), Integer.valueOf(hsb[1]), Integer.valueOf(hsb[2]));
			
		} catch (Exception e) {
			throw new ConverterException(e);
		}
    }
}