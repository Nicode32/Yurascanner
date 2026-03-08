// src/agents/navigator-agent.js
class NavigatorAgent {
    constructor(llmBridge) {
        this.llmBridge = llmBridge; // Best if this is a fast, specialized model
    }

    /**
     * Decides the exact next action based on the state and the current sub-goal.
     * @param {Object} distilledState 
     * @param {String} currentSubGoal 
     * @returns {Object} Action object (e.g., { type: 'CLICK', targetId: '3' })
     */
    async decideNextAction(distilledState, currentSubGoal) {
        const prompt = `
            You are the Navigator Agent.
            Your immediate sub-goal is: "${currentSubGoal}"
            
            Interactive Elements Available:
            ${distilledState.interactiveElements.join('\n')}
            Forms Available:
            ${distilledState.forms.join('\n')}
            
            Respond ONLY with the exact action syntax. 
            If movement is required, respond with "CLICK id=X". 
            If a form needs to be filled, respond with "FORM_INPUT id=X".
            If the goal is achieved on this page, respond with "STOP".
        `;

        let reply = await this.llmBridge.requestApi(prompt);
        reply = reply.trim();

        if (reply.startsWith('CLICK')) {
            return { type: 'CLICK', actionString: reply };
        } else if (reply.startsWith('FORM_INPUT')) {
            return { type: 'FORM_INPUT', actionString: reply };
        } else if (reply.startsWith('STOP')) {
            return { type: 'STOP', actionString: reply };
        }

        return { type: 'UNKNOWN', actionString: reply };
    }
}

module.exports = NavigatorAgent;