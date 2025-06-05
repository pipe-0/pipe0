// worker.ts
export interface SearchRequestBody {
	firstname?: string;
	lastname?: string;
	domainOrCompany: string;
}

interface Env {
	ACCESS_KEY: string;
	REQUEST_STATE: DurableObjectNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/search' && request.method === 'POST') {
			return handleSearch(request, env, ctx);
		}

		if (url.pathname === '/webhook' && request.method === 'POST') {
			return handleWebhook(request, env);
		}

		return new Response('Not found', { status: 404 });
	},
};

async function handleSearch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const incomingAuth = request.headers.get('Authorization');
	const accessKey = request.headers.get('X-Access-Key');

	if (accessKey !== env.ACCESS_KEY) {
		return new Response(JSON.stringify({ error: 'Unauthorized client' }), { status: 401 });
	}

	if (!incomingAuth) {
		return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
	}

	let body: SearchRequestBody;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
	}

	const { firstname, lastname, domainOrCompany } = body;
	if (!domainOrCompany || (!firstname && !lastname)) {
		return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
	}

	const externalId = crypto.randomUUID();
	const stub = env.REQUEST_STATE.get(env.REQUEST_STATE.idFromName(externalId));
	const webhookUrl = `https://icypeas-resolver.pipe0.com/webhook`;

	const icypeasPayload = {
		firstname,
		lastname,
		domainOrCompany,
		custom: {
			webhookUrl,
			externalId,
		},
	};

	const icypeasResp = await fetch('https://app.icypeas.com/api/email-search', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: incomingAuth,
		},
		body: JSON.stringify(icypeasPayload),
	});

	if (!icypeasResp.ok) {
		const errText = await icypeasResp.text();
		return new Response(JSON.stringify({ error: 'Icypeas API error', details: errText }), { status: 500 });
	}

	const response = await stub.fetch('https://internal/wait', { method: 'GET' });
	return new Response(await response.text(), { status: 200 });
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
	let webhookEvent: any;
	try {
		webhookEvent = await request.json();
	} catch (err) {
		return new Response('Invalid JSON', { status: 400 });
	}

	const externalId = webhookEvent?.data.userData?.externalId;
	if (!externalId) {
		return new Response('Missing externalId', { status: 400 });
	}

	const stub = env.REQUEST_STATE.get(env.REQUEST_STATE.idFromName(externalId));
	await stub.fetch('https://internal/resolve', {
		method: 'POST',
		body: JSON.stringify(webhookEvent),
	});

	return new Response('OK');
}

// Durable Object
export class RequestState {
	state: DurableObjectState;
	resolve: ((value: Response | PromiseLike<Response>) => void) | null = null;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
	}

	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname.endsWith('/wait')) {
			return new Promise((resolve) => {
				this.resolve = resolve;
				this.state.storage.setAlarm(Date.now() + 8_000);
			});
		}

		if (url.pathname.endsWith('/resolve')) {
			const body = await request.text();
			if (this.resolve) {
				this.resolve(new Response(body, { status: 200 }));
				this.resolve = null;
			}
			return new Response('ACK');
		}

		return new Response('Not found', { status: 404 });
	}

	async alarm(): Promise<void> {
		if (this.resolve) {
			this.resolve(new Response(JSON.stringify({ error: 'Timeout' }), { status: 504 }));
			this.resolve = null;
		}
	}
}
