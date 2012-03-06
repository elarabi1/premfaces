/*
 * Copyright 2009-2012 Prime Teknoloji.
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
package org.primefaces.jsfunit;

import org.jboss.jsfunit.jsfsession.JSFClientSession;

public class PrimeClientFactory {
    
    private static JSFClientSession client;

    public PrimeClientFactory(JSFClientSession client) {
        this.client = client;
    }
        
    public static SpinnerClient spinnerClient(JSFClientSession client, String componentId) {
        return new SpinnerClient(client, componentId);
    }
}
