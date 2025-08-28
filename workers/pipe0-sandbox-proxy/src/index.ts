export interface Env {
	PIPE0_API_KEY: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Only allow /run and /run/sync paths
		if (
			!(
				url.pathname === '/v1/pipes/run' ||
				url.pathname === '/v1/pipes/run/sync' ||
				url.pathname === '/v1/pipes/check' ||
				url.pathname === '/v1/searches/run/sync' ||
				url.pathname === '/v1/searches/run' ||
				url.pathname === '/v1/searches/check'
			)
		) {
			return new Response('Not Found', { status: 404 });
		}

		// Handle preflight CORS requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: getCorsHeaders(),
			});
		}

		// Create destination URL
		const destinationUrl = `https://api.pipe0.com${url.pathname}${url.search}`;

		// Clone headers and sanitize
		const newHeaders = new Headers(request.headers);

		newHeaders.delete('authorization');
		newHeaders.delete('x-api-key');

		newHeaders.set('x-environment', 'sandbox');
		newHeaders.set('Authorization', `Bearer ${env.PIPE0_API_KEY}`);

		let body;
		if (url.pathname.includes('run') && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
			const res = (await request.json()) as any;
			body = {
				...res,
				config: {
					...res?.config,
					environment: 'sandbox',
				},
			};
		}
		// Forward the request
		const proxyRequest = new Request(destinationUrl, {
			method: request.method,
			headers: newHeaders,
			body: JSON.stringify(body),
			redirect: 'manual',
		});

		const response = await fetch(proxyRequest);

		// Clone response and attach CORS headers
		const responseHeaders = new Headers(response.headers);
		for (const [key, value] of Object.entries(getCorsHeaders())) {
			responseHeaders.set(key, value);
		}

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	},
};

function getCorsHeaders(): Record<string, string> {
	return {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': '*',
	};
}
