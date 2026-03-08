// src/agents/data-synthesis-agent.js
class DataSynthesisAgent {
    constructor(llmBridge) {
        this.llmBridge = llmBridge; // Needs high reasoning capabilities
    }

    /**
     * Generates context-aware input data for a specific form.
     * @param {String} formHtml The distilled HTML/JSON of the target form
     * @param {String} overallTask The overall goal to provide context
     * @returns {Object} Key-value pairs of input names and synthesized values
     */
    async generateData(formHtml, overallTask) {
        const prompt = `
            You are the Data Synthesis Agent. 
            Your job is to generate highly accurate, context-aware payload data for the following form.
            
            Context/Goal: "${overallTask}"
            
            Form Structure:
            ${formHtml}
            
            Analyze all text inputs, checkboxes, and dropdowns. 
            Return a JSON object where keys are the input 'name' or 'id' attributes, and values are the synthesized data.
            Do not include any other text.
            Example: { "username": "test_user_1", "role_dropdown": "admin", "terms_checkbox": true }
        `;

        try {
            let response = await this.llmBridge.requestApi(prompt);
            let jsonMatch = response.match(/\{.*\}/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return {};
        } catch (error) {
            console.error("[Data Synthesis Agent] Failed to synthesize data:", error);
            return {};
        }
    }
}

module.exports = DataSynthesisAgent;