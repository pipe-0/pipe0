'use strict';

const { runPipes, isEmpty } = require('../lib/pipe0');

const perform = async (z, bundle) => {
  const result = await runPipes(z, {
    pipes: [{ pipe_id: 'person:workemail:waterfall@1' }],
    input: {
      name: bundle.inputData.full_name,
      company_domain: bundle.inputData.company_domain,
    },
  });

  if (isEmpty(result.fields.work_email)) {
    return [];
  }

  return [
    {
      id: result.run_id,
      full_name: bundle.inputData.full_name,
      company_domain: bundle.inputData.company_domain,
      work_email: result.fields.work_email,
      email_validation_status: result.fields.email_validation_status || null,
      credits_spent: result.credits_spent,
    },
  ];
};

module.exports = {
  key: 'find_work_email',
  noun: 'Work Email',
  display: {
    label: 'Find Work Email',
    description: "Finds a person's work email from their full name and company domain.",
  },
  operation: {
    inputFields: [
      {
        key: 'full_name',
        label: 'Full Name',
        required: true,
        helpText: 'First and last name of the person, e.g. Jane Doe.',
      },
      {
        key: 'company_domain',
        label: 'Company Domain',
        required: true,
        helpText: 'Bare domain of the company they work at, e.g. stripe.com (no https:// or path).',
      },
    ],
    perform,
    sample: {
      id: 'run_01J9Z8Y7X6W5V4T3S2R1Q0P9N8',
      full_name: 'Jane Doe',
      company_domain: 'example.com',
      work_email: 'jane.doe@example.com',
      email_validation_status: 'valid',
      credits_spent: 0.5,
    },
    outputFields: [
      { key: 'id', label: 'Run ID' },
      { key: 'full_name', label: 'Full Name' },
      { key: 'company_domain', label: 'Company Domain' },
      { key: 'work_email', label: 'Work Email' },
      { key: 'email_validation_status', label: 'Email Validation Status' },
      { key: 'credits_spent', label: 'Credits Spent', type: 'number' },
    ],
  },
};
