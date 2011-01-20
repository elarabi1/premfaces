/*
 * Copyright 2009-2011 Prime Technology.
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
package org.primefaces.component.menu;

import java.io.IOException;
import java.util.Iterator;

import javax.faces.FacesException;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import org.primefaces.component.menuitem.MenuItem;
import org.primefaces.component.submenu.Submenu;
import org.primefaces.renderkit.CoreRenderer;
import org.primefaces.util.ComponentUtils;

public class MenuRenderer extends CoreRenderer{

    @Override
	public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
		Menu menu = (Menu) component;

		if(menu.shouldBuildFromModel()) {
			menu.buildMenuFromModel();
		}

		encodeMarkup(context, menu);
		encodeScript(context, menu);
	}

	protected void encodeScript(FacesContext context, Menu menu) throws IOException {
		ResponseWriter writer = context.getResponseWriter();
		String clientId = menu.getClientId(context);
		String widgetVar = menu.resolveWidgetVar();
        String position = menu.getPosition();
        String type = menu.getType();

		writer.startElement("script", null);
		writer.writeAttribute("type", "text/javascript", null);

		writer.write(widgetVar + " = new PrimeFaces.widget.Menu('" + clientId + "',{");

        writer.write("position:'" + menu.getPosition() + "'");
        writer.write(",zindex:" + menu.getZindex());
        writer.write(",animated:'" + menu.getEffect() + "'");

        if(type.equalsIgnoreCase("sliding")) {
            writer.write(",mode:'sliding'");
            writer.write(",backLinkText:'" + menu.getBackLabel() + "'");
            writer.write(",maxHeight:" + menu.getMaxHeight());
        }

        if(menu.getEffectDuration() != 400) {
            writer.write(",showDuration:" + menu.getEffectDuration());
            writer.write(",hideDuration:" + menu.getEffectDuration());
        }

        if(position.equalsIgnoreCase("dynamic")) {
           writer.write(",my:'" + menu.getMy() + "'");
           writer.write(",at:'" + menu.getAt() + "'");

            UIComponent trigger = menu.findComponent(menu.getTrigger());
            if(trigger != null)
                writer.write(",trigger:'" + trigger.getClientId(context) + "'");
            else
                writer.write(",trigger:'" + menu.getTrigger() + "'");
        }

        if(menu.getStyleClass() != null) writer.write(",styleClass:'" + menu.getStyleClass() + "'");
        if(menu.getStyle() != null) writer.write(",style:'" + menu.getStyle() + "'");

        writer.write("});");

		writer.endElement("script");
	}

	protected void encodeMarkup(FacesContext context, Menu menu) throws IOException {
		ResponseWriter writer = context.getResponseWriter();
		String clientId = menu.getClientId(context);
        boolean tiered = menu.isTiered() || !menu.getType().equalsIgnoreCase("plain");

        writer.startElement("span", menu);
		writer.writeAttribute("id", clientId, "id");

		writer.startElement("ul", null);
		writer.writeAttribute("id", clientId + "_menu", null);

        if(tiered) {
            encodeTieredMenuContent(context, menu);
        }
        else {
            encodePlainMenuContent(context, menu);
        }

		writer.endElement("ul");

        writer.endElement("span");
	}

    protected void encodeTieredMenuContent(FacesContext context, UIComponent component) throws IOException {
        ResponseWriter writer = context.getResponseWriter();

        for(Iterator<UIComponent> iterator = component.getChildren().iterator(); iterator.hasNext();) {
            UIComponent child = (UIComponent) iterator.next();

            if(child.isRendered()) {

                writer.startElement("li", null);

                if(child instanceof MenuItem) {
                    encodeMenuItem(context, (MenuItem) child);
                } else if(child instanceof Submenu) {
                    encodeTieredSubmenu(context, (Submenu) child);
                }

                writer.endElement("li");
            }
        }
    }

	protected void encodeTieredSubmenu(FacesContext context, Submenu submenu) throws IOException{
		ResponseWriter writer = context.getResponseWriter();
        String icon = submenu.getIcon();
        String label = submenu.getLabel();

        //title
        writer.startElement("a", null);
        writer.writeAttribute("href", "javascript:void(0)", null);

        if(icon != null) {
            writer.startElement("span", null);
            writer.writeAttribute("class", icon + " wijmo-wijmenu-icon-left", null);
            writer.endElement("span");
        }

        if(label != null) {
            writer.startElement("span", null);
            writer.writeAttribute("class", "wijmo-wijmenu-text", null);
            writer.write(submenu.getLabel());
            writer.endElement("span");
        }

        writer.endElement("a");

        //submenus and menuitems
		if(submenu.getChildCount() > 0) {
			writer.startElement("ul", null);

			encodeTieredMenuContent(context, submenu);

			writer.endElement("ul");
		}
	}

	protected void encodeMenuItem(FacesContext context, MenuItem menuItem) throws IOException {
		String clientId = menuItem.getClientId(context);
        ResponseWriter writer = context.getResponseWriter();
        String icon = menuItem.getIcon();

		if(menuItem.shouldRenderChildren()) {
			renderChildren(context, menuItem);
		}
        else {
            writer.startElement("a", null);

			if(menuItem.getUrl() != null) {
				writer.writeAttribute("href", getResourceURL(context, menuItem.getUrl()), null);
				if(menuItem.getOnclick() != null) writer.writeAttribute("onclick", menuItem.getOnclick(), null);
				if(menuItem.getTarget() != null) writer.writeAttribute("target", menuItem.getTarget(), null);
			} else {
				writer.writeAttribute("href", "javascript:void(0)", null);

				UIComponent form = ComponentUtils.findParentForm(context, menuItem);
				if(form == null) {
					throw new FacesException("Menubar must be inside a form element");
				}

				String formClientId = form.getClientId(context);
				String command = menuItem.isAjax() ? buildAjaxRequest(context, menuItem, formClientId, clientId) : buildNonAjaxRequest(context, menuItem, formClientId, clientId);

				command = menuItem.getOnclick() == null ? command : menuItem.getOnclick() + ";" + command;

				writer.writeAttribute("onclick", command, null);
			}

            if(icon != null) {
                writer.startElement("span", null);
                writer.writeAttribute("class", icon + " wijmo-wijmenu-icon-left", null);
                writer.endElement("span");
            }

			if(menuItem.getValue() != null) {
                writer.startElement("span", null);
                writer.writeAttribute("class",  "wijmo-wijmenu-text", null);
                writer.write((String) menuItem.getValue());
                writer.endElement("span");
            }

            writer.endElement("a");
		}
	}

    protected void encodePlainMenuContent(FacesContext context, UIComponent component) throws IOException{
		ResponseWriter writer = context.getResponseWriter();

        for(Iterator<UIComponent> iterator = component.getChildren().iterator(); iterator.hasNext();) {
            UIComponent child = (UIComponent) iterator.next();

            if(child.isRendered()) {

                if(child instanceof MenuItem) {
                    writer.startElement("li", null);
                    encodeMenuItem(context, (MenuItem) child);
                    writer.endElement("li");
                } else if(child instanceof Submenu) {
                    encodePlainSubmenu(context, (Submenu) child);
                }
                
            }
        }
    }

    protected void encodePlainSubmenu(FacesContext context, Submenu submenu) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        String label = submenu.getLabel();

        //title
        writer.startElement("li", null);
        writer.startElement("h3", null);
        if(label != null) {
            writer.write(label);
        }
        writer.endElement("h3");
        writer.endElement("li");

        encodePlainMenuContent(context, submenu);
	}

    @Override
	public void encodeChildren(FacesContext context, UIComponent component) throws IOException {
		//Do nothing
	}

    @Override
	public boolean getRendersChildren() {
		return true;
	}
}