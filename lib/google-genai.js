/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This is a simplified, self-contained client for the Google AI SDK.
// It is designed to work within a Chrome Extension's Manifest V3 environment,
// which has strict Content Security Policies that prevent loading remote scripts.

class GoogleGenAI {
    constructor(options) {
        if (!options || !options.apiKey) {
            throw new Error("API key is required when initializing GoogleGenAI.");
        }
        this.apiKey = options.apiKey;
        this.models = {
            generateContent: this.generateContent.bind(this)
        };
    }

    async generateContent(request) {
        const { model, contents } = request;
        if (!model || !contents) {
            throw new Error("Request must include 'model' and 'contents' fields.");
        }

        const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        
        let parts;
        if (typeof contents === 'string') {
            parts = [{ text: contents }];
        } else if (contents.parts && Array.isArray(contents.parts)) {
            parts = contents.parts;
        } else {
            throw new Error("Invalid 'contents' format. It must be a string or an object with a 'parts' array.");
        }
        
        const payload = {
            contents: [{ parts }]
        };

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.error?.message || 'Unknown API error';
                console.error("Google AI API Error:", errorData);
                throw new Error(`API request failed with status ${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            
            // Replicate the .text accessor from the official SDK for compatibility
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            
            if (!responseText && data.promptFeedback) {
                 const blockReason = data.promptFeedback.blockReason;
                 if (blockReason) {
                    console.warn(`Response was blocked. Reason: ${blockReason}`);
                    return { text: `Response was blocked due to ${blockReason.toLowerCase().replace(/_/g, ' ')}.` };
                 }
            }

            return { text: responseText };

        } catch (error) {
            console.error("Error during fetch to Google AI API:", error);
            // Re-throw a more generic error to avoid exposing too much detail
            throw new Error("A network error occurred or the API call failed.");
        }
    }
}

export { GoogleGenAI };