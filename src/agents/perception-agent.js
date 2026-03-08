// src/agents/perception-agent.js
class PerceptionAgent {
    constructor(sensors) {
        this.sensors = sensors;
    }

    /**
     * Distills the current page state into a clean JSON representation.
     * @param {PageWrapper} pageWrapper 
     * @returns {Object} JSON map of the current state
     */
    async distill(pageWrapper) {
        // Force sensors to update the abstract page first
        await this.sensors.updateAbstractPage();
        let rawAbstract = this.sensors.getAbstractPage();
        
        // In a full implementation, you might pass `rawAbstract` to a small, fast LLM 
        // here to categorize elements (e.g., 'navigation', 'main_content', 'footer').
        // For now, we will construct a clean JSON representation directly.
        
        let distilledState = {
            url: pageWrapper.getUrl(),
            title: await pageWrapper.retryOnDestroyedContext(() => pageWrapper.getTitle()),
            interactiveElements: [],
            forms: []
        };

        // Parse the raw abstract strings back into semantic JSON 
        // (This relies on the updated sensors.js logic you implement)
        let lines = rawAbstract.split('\n').filter(line => line.trim() !== '');
        
        for (let line of lines) {
            if (line.startsWith('<form')) {
                distilledState.forms.push(line);
            } else {
                distilledState.interactiveElements.push(line);
            }
        }

        return distilledState;
    }
}

module.exports = PerceptionAgent;