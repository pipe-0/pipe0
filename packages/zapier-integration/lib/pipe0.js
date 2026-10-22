'use strict';

const API_BASE = 'https://api.pipe0.com/v1';

// Sends the API key as a bearer token on every request. Kept out of the URL on purpose.
const addAuthHeader = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.api_key) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.api_key}`;
  }
  return request;
};

const handleErrors = (response, z) => {
  if (response.status === 401 || response.status === 403) {
    throw new z.errors.Error(
      'pipe0 rejected the API key. Create a new key in pipe0 under API and MCP > API keys and reconnect.',
      'AuthenticationError',
      response.status,
    );
  }
  if (response.status === 402) {
    throw new z.errors.Error(
      'Your pipe0 organization is out of credits. Add credits in the pipe0 dashboard and try again.',
      'InsufficientCredits',
      response.status,
    );
  }
  if (response.status === 429) {
    throw new z.errors.ThrottledError('pipe0 rate limit reached. Zapier will retry.', 30);
  }
  if (response.status >= 400) {
    let detail = response.content;
    try {
      const body = JSON.parse(response.content);
      detail = body.detail || body.message || body.title || JSON.stringify(body);
    } catch (e) {
      // keep raw content
    }
    throw new z.errors.Error(`pipe0 API error (${response.status}): ${detail}`, 'ApiError', response.status);
  }
  return response;
};

// Runs one or more pipes on a single input record and returns the flattened record.
const runPipes = async (z, { pipes, input }) => {
  const response = await z.request({
    url: `${API_BASE}/pipes/run/sync`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: {
      config: { environment: 'production' },
      pipes,
      input: [{ id: '1', ...input }],
    },
  });
  const run = response.data;

  if (Array.isArray(run.errors) && run.errors.length > 0) {
    const message = run.errors
      .map((e) => (typeof e === 'string' ? e : e.message || e.summary || JSON.stringify(e)))
      .join('; ');
    throw new z.errors.Error(`pipe0 run failed: ${message}`, 'RunFailed');
  }

  const recordId = (run.order && run.order[0]) || Object.keys(run.records || {})[0];
  const record = run.records && run.records[recordId];
  if (!record) {
    throw new z.errors.Error('pipe0 returned no record for this run.', 'EmptyRun');
  }

  const fields = {};
  const fieldStatus = {};
  for (const [name, field] of Object.entries(record.fields || {})) {
    fields[name] = field.value === undefined ? null : field.value;
    fieldStatus[name] = field.status;
  }

  return {
    run_id: run.id,
    run_status: run.status,
    credits_spent: run.credits && typeof run.credits.spent === 'number' ? run.credits.spent : null,
    fields,
    field_status: fieldStatus,
  };
};

const isEmpty = (value) => value === null || value === undefined || value === '';

module.exports = { API_BASE, addAuthHeader, handleErrors, runPipes, isEmpty };
