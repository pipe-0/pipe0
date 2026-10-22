'use strict';

const { runPipes } = require('../lib/pipe0');

const perform = async (z, bundle) => {
  const result = await runPipes(z, {
    pipes: [{ pipe_id: 'email:validate:zerobounce@1' }],
    input: { email: bundle.inputData.email },
  });

  const details = result.fields.zerobounce_validation_match || {};
  return {
    id: result.run_id,
    email: bundle.inputData.email,
    status: result.fields.zerobounce_validation_status || details.status || null,
    sub_status: details.sub_status || null,
    free_email: typeof details.free_email === 'boolean' ? details.free_email : null,
    domain: details.domain || null,
    did_you_mean: details.did_you_mean || null,
    credits_spent: result.credits_spent,
  };
};

module.exports = {
  key: 'verify_email',
  noun: 'Email Verification',
  display: {
    label: 'Verify Email Address',
    description: 'Checks whether an email address is deliverable and returns its status (valid, invalid, catch-all, unknown, and more).',
  },
  operation: {
    inputFields: [
      {
        key: 'email',
        label: 'Email Address',
        required: true,
        helpText: 'The email address to verify.',
      },
    ],
    perform,
    sample: {
      id: 'run_01J9Z8Y7X6W5V4T3S2R1Q0P9N8',
      email: 'jane.doe@example.com',
      status: 'valid',
      sub_status: '',
      free_email: false,
      domain: 'example.com',
      did_you_mean: null,
      credits_spent: 0.4,
    },
    outputFields: [
      { key: 'id', label: 'Run ID' },
      { key: 'email', label: 'Email Address' },
      { key: 'status', label: 'Status' },
      { key: 'sub_status', label: 'Sub-Status' },
      { key: 'free_email', label: 'Free Email Provider', type: 'boolean' },
      { key: 'domain', label: 'Domain' },
      { key: 'did_you_mean', label: 'Suggested Correction' },
      { key: 'credits_spent', label: 'Credits Spent', type: 'number' },
    ],
  },
};
