const https = require('https');

class GeminiBridge {
    constructor(apiKey, model = 'gemini-2.5-flash') {
        this.apiKey = apiKey;
        this.model = (model.includes('bison') || model.includes('1.5')) ? 'gemini-2.5-flash' : model;
    }

    async requestApi(messages) {
        const last = messages.slice(-1)[0];
        const prompt = last && last.content ? last.content : '';
        return await this._callGenerate(prompt);
    }

    async requestApiStateless(prompt) {
        return await this._callGenerate(prompt);
    }

    _callGenerate(prompt) {
        const body = JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                temperature: 0.2
            }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        return reject(new Error(`API Error ${res.statusCode}: ${data}`));
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.candidates && parsed.candidates.length > 0) {
                            const cand = parsed.candidates[0];
                            if (cand.content && cand.content.parts && cand.content.parts.length > 0) {
                                return resolve(cand.content.parts[0].text);
                            }
                        }
                        resolve(JSON.stringify(parsed));
                    } catch (e) {
                        reject(new Error(`Failed to parse JSON. Raw response: ${data}`));
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(body);
            req.end();
        });
    }
}

module.exports = GeminiBridge;