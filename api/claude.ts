const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

type GatewayBody = {
    model?: string;
    maxTokens?: number;
    systemPrompt?: string;
    userPrompt?: string;
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' });
    }

    const body = (req.body || {}) as GatewayBody;
    const model = (body.model || '').trim();
    const systemPrompt = (body.systemPrompt || '').trim();
    const userPrompt = (body.userPrompt || '').trim();
    const maxTokens = Number.isFinite(body.maxTokens) ? Math.max(100, Number(body.maxTokens)) : 1000;

    if (!model || !systemPrompt || !userPrompt) {
        return res.status(400).json({ error: 'Missing required fields: model, systemPrompt, userPrompt' });
    }

    try {
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': ANTHROPIC_VERSION,
            },
            body: JSON.stringify({
                model,
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({ error: `Anthropic API error ${response.status}: ${errText}` });
        }

        const data = await response.json();
        const text = (data.content || [])
            .filter((block: any) => block.type === 'text')
            .map((block: any) => block.text)
            .join('');
        const usage = data.usage || null;
        return res.status(200).json({ content: text, usage });
    } catch (error: any) {
        return res.status(500).json({ error: error?.message || 'Gateway request failed' });
    }
}
