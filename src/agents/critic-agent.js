// src/agents/critic-agent.js
class CriticAgent {
    constructor(llmBridge) {
        this.llmBridge = llmBridge;
    }

    /**
     * Evaluates if the recent action was successful and advanced the plan.
     * @param {Object} oldState 
     * @param {Object} action Taken by Navigator
     * @param {Object} newState 
     * @param {String} currentSubGoal 
     * @returns {Object} { success: boolean, explanation: string }
     */
    async evaluate(oldState, action, newState, currentSubGoal) {
        const prompt = `
            You are the Reflection & Critic Agent.
            
            Sub-Goal: "${currentSubGoal}"
            Action Taken: "${action.actionString}"
            
            Previous Page Title: ${oldState.title}
            New Page Title: ${newState.title}
            
            Analyze the New Page State. Did this action bring us closer to the Planner's goal? 
            Look specifically for error banners, broken links, or "Missing state" text.
            
            Respond strictly in JSON format:
            {
                "success": true/false,
                "explanation": "Brief explanation of why it succeeded or failed."
            }
        `;

        try {
            let response = await this.llmBridge.requestApi(prompt);
            let jsonMatch = response.match(/\{.*\}/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return { success: true, explanation: "Assumed success due to parsing failure." };
        } catch (error) {
            console.error("[Critic Agent] Evaluation failed:", error);
            return { success: true, explanation: "Error during evaluation." };
        }
    }
}

module.exports = CriticAgent;