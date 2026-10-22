'use strict';

// Offline tests: a fake `z` stands in for zapier-platform-core, so no network or API key is needed.
const test = require('node:test');
const assert = require('node:assert/strict');

const { addAuthHeader, handleErrors } = require('../lib/pipe0');
const findWorkEmail = require('../searches/find_work_email');
const findCompany = require('../searches/find_company');
const verifyEmail = require('../creates/verify_email');
const runPipe = require('../creates/run_pipe');

class ZError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
class ThrottledError extends Error {}

const field = (value, status = 'completed') => ({ value, status, type: 'string', reason: null });

const fakeZ = (fields, extra = {}) => {
  const calls = [];
  return {
    calls,
    errors: { Error: ZError, ThrottledError },
    request: async (req) => {
      calls.push(req);
      return {
        data: {
          id: 'run_123',
          status: 'completed',
          credits: { spent: 1 },
          order: ['1'],
          errors: [],
          records: { 1: { id: '1', fields } },
          ...extra,
        },
      };
    },
  };
};

test('auth header is a bearer token and never a query param', () => {
  const req = addAuthHeader({ url: 'https://api.pipe0.com/v1/credit-balance' }, null, { authData: { api_key: 'k' } });
  assert.equal(req.headers.Authorization, 'Bearer k');
  assert.equal(req.params, undefined);
  assert.ok(!req.url.includes('k=') && !req.url.includes('api_key'));
});

test('find_work_email sends the right payload and returns one result', async () => {
  const z = fakeZ({ name: field('Jane Doe'), company_domain: field('example.com'), work_email: field('jane@example.com'), email_validation_status: field('valid') });
  const res = await findWorkEmail.operation.perform(z, { inputData: { full_name: 'Jane Doe', company_domain: 'example.com' } });
  assert.equal(z.calls[0].url, 'https://api.pipe0.com/v1/pipes/run/sync');
  assert.deepEqual(z.calls[0].body.pipes, [{ pipe_id: 'person:workemail:waterfall@1' }]);
  assert.deepEqual(z.calls[0].body.input, [{ id: '1', name: 'Jane Doe', company_domain: 'example.com' }]);
  assert.equal(z.calls[0].body.config.environment, 'production');
  assert.equal(res.length, 1);
  assert.equal(res[0].work_email, 'jane@example.com');
});

test('find_work_email returns [] when nothing is found', async () => {
  const z = fakeZ({ work_email: field(null, 'no_result') });
  const res = await findWorkEmail.operation.perform(z, { inputData: { full_name: 'X', company_domain: 'example.com' } });
  assert.deepEqual(res, []);
});

test('find_company maps overview fields', async () => {
  const z = fakeZ({ company_name: field('Example'), company_industry: field('Software Development'), headcount: field('11-50') });
  const [c] = await findCompany.operation.perform(z, { inputData: { company_domain: 'example.com' } });
  assert.equal(c.company_name, 'Example');
  assert.equal(c.company_industry, 'Software Development');
  assert.equal(c.headcount, '11-50');
});

test('verify_email reads status and details', async () => {
  const z = fakeZ({
    zerobounce_validation_status: field('valid'),
    zerobounce_validation_match: { value: { status: 'valid', sub_status: '', free_email: false, domain: 'example.com' }, status: 'completed', type: 'json' },
  });
  const r = await verifyEmail.operation.perform(z, { inputData: { email: 'jane@example.com' } });
  assert.equal(r.status, 'valid');
  assert.equal(r.free_email, false);
  assert.equal(r.domain, 'example.com');
});

test('run_pipe passes config JSON and flattens fields', async () => {
  const z = fakeZ({ company_name: field('Example') });
  const r = await runPipe.operation.perform(z, {
    inputData: { pipe_id: ' company:overview@3 ', input: { company_domain: 'example.com' }, pipe_config: '{"output_fields":{}}' },
  });
  assert.deepEqual(z.calls[0].body.pipes, [{ pipe_id: 'company:overview@3', config: { output_fields: {} } }]);
  assert.equal(r.company_name, 'Example');
  assert.equal(r.field_status.company_name, 'completed');
});

test('run_pipe rejects invalid config JSON', async () => {
  const z = fakeZ({});
  await assert.rejects(
    runPipe.operation.perform(z, { inputData: { pipe_id: 'x@1', input: {}, pipe_config: '{nope' } }),
    /not valid JSON/,
  );
});

test('top-level run errors surface as a Zapier error', async () => {
  const z = fakeZ({}, { errors: [{ message: 'Unknown pipe' }] });
  await assert.rejects(runPipe.operation.perform(z, { inputData: { pipe_id: 'x@1', input: {} } }), /Unknown pipe/);
});

test('401 becomes a readable auth error', () => {
  assert.throws(() => handleErrors({ status: 401, content: '{}' }, { errors: { Error: ZError, ThrottledError } }), /rejected the API key/);
});
