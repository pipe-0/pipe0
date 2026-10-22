'use strict';

const { runPipes } = require('../lib/pipe0');

const parseJson = (z, raw, label) => {
  if (raw === undefined || raw === null || raw === '') return undefined;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new z.errors.Error(`${label} is not valid JSON: ${e.message}`, 'InvalidInput');
  }
};

const perform = async (z, bundle) => {
  const config = parseJson(z, bundle.inputData.pipe_config, 'Pipe Config');
  const pipe = { pipe_id: bundle.inputData.pipe_id.trim() };
  if (config) pipe.config = config;

  const result = await runPipes(z, {
    pipes: [pipe],
    input: bundle.inputData.input || {},
  });

  return {
    id: result.run_id,
    pipe_id: pipe.pipe_id,
    run_status: result.run_status,
    credits_spent: result.credits_spent,
    ...result.fields,
    field_status: result.field_status,
  };
};

module.exports = {
  key: 'run_pipe',
  noun: 'Pipe Run',
  display: {
    label: 'Run Pipe',
    description: 'Runs any pipe0 enrichment pipe on one record and returns every output field.',
  },
  operation: {
    inputFields: [
      {
        key: 'pipe_id',
        label: 'Pipe ID',
        required: true,
        helpText:
          'The pipe to run, e.g. `person:workemail:waterfall@1` or `company:overview@3`. Browse all pipes in the [pipe0 catalog](https://pipe0.com/docs/pipes).',
      },
      {
        key: 'input',
        label: 'Input Fields',
        dict: true,
        required: true,
        helpText:
          'Input fields the pipe needs, as key and value pairs, e.g. `name` = Jane Doe and `company_domain` = example.com. The pipe page in the catalog lists its required inputs.',
      },
      {
        key: 'pipe_config',
        label: 'Pipe Config (JSON)',
        type: 'code',
        required: false,
        helpText:
          'Optional pipe config as JSON, e.g. `{"providers":[{"provider":"hunter"}]}`. Leave empty to use the pipe defaults.',
      },
    ],
    perform,
    sample: {
      id: 'run_01J9Z8Y7X6W5V4T3S2R1Q0P9N8',
      pipe_id: 'company:overview@3',
      run_status: 'completed',
      credits_spent: 1,
      company_domain: 'example.com',
      company_name: 'Example Inc.',
      company_industry: 'Software Development',
      field_status: { company_domain: 'completed', company_name: 'completed', company_industry: 'completed' },
    },
    outputFields: [
      { key: 'id', label: 'Run ID' },
      { key: 'pipe_id', label: 'Pipe ID' },
      { key: 'run_status', label: 'Run Status' },
      { key: 'credits_spent', label: 'Credits Spent', type: 'number' },
    ],
  },
};
