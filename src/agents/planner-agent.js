// src/agents/planner-agent.js
class PlannerAgent {
    constructor(llmBridge) {
        this.llmBridge = llmBridge; // Can be a standard reasoning model like gpt-4
    }

    /**
     * Creates a dependency graph/plan based on the goal and current state.
     * @param {Object} distilledState 
     * @param {String} currentTask 
     * @returns {Array<String>} Array of sub-goals
     */
    async createDependencyGraph(distilledState, currentTask) {
        const prompt = `
            You are the Strategic Planner Agent. 
            Your overall goal is: "${currentTask}".
            
            Current Page State:
            ${JSON.stringify(distilledState, null, 2)}
            
            Map out a strict dependency graph of immediate sub-goals required to achieve this task. 
            Do not output routing commands. Output a JSON array of sub-goals in order.
            Example: ["Navigate to Users Page", "Click Add New User", "Fill User Form"]
        `;

        try {
            let response = await this.llmBridge.requestApi(prompt);
            // Parse the JSON array from the LLM response
            let jsonMatch = response.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [currentTask]; // Fallback to the main task if parsing fails
        } catch (error) {
            console.error("[Planner Agent] Failed to parse dependency graph:", error);
            return [currentTask];
        }
    }
}

module.exports = PlannerAgent;