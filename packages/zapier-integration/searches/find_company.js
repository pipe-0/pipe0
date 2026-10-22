'use strict';

const { runPipes, isEmpty } = require('../lib/pipe0');

const perform = async (z, bundle) => {
  const result = await runPipes(z, {
    pipes: [{ pipe_id: 'company:overview@3' }],
    input: { company_domain: bundle.inputData.company_domain },
  });

  const f = result.fields;
  if (isEmpty(f.company_name) && isEmpty(f.company_description)) {
    return [];
  }

  return [
    {
      id: result.run_id,
      company_domain: bundle.inputData.company_domain,
      company_name: f.company_name || null,
      company_description: f.company_description || null,
      company_industry: f.company_industry || null,
      company_region: f.company_region || null,
      headcount: f.headcount || null,
      estimated_revenue: f.estimated_revenue || null,
      founded_year: f.founded_year || null,
      credits_spent: result.credits_spent,
    },
  ];
};

module.exports = {
  key: 'find_company',
  noun: 'Company',
  display: {
    label: 'Find Company',
    description: 'Finds a company by domain and returns its description, industry, region, headcount, revenue, and founding year.',
  },
  operation: {
    inputFields: [
      {
        key: 'company_domain',
        label: 'Company Domain',
        required: true,
        helpText: 'Bare domain of the company, e.g. stripe.com (no https:// or path).',
      },
    ],
    perform,
    sample: {
      id: 'run_01J9Z8Y7X6W5V4T3S2R1Q0P9N8',
      company_domain: 'example.com',
      company_name: 'Example Inc.',
      company_description: 'Example Inc. builds software for finance teams.',
      company_industry: 'Software Development',
      company_region: 'Europe',
      headcount: '51-200',
      estimated_revenue: '$10M-$50M',
      founded_year: '2015',
      credits_spent: 1,
    },
    outputFields: [
      { key: 'id', label: 'Run ID' },
      { key: 'company_domain', label: 'Company Domain' },
      { key: 'company_name', label: 'Company Name' },
      { key: 'company_description', label: 'Description' },
      { key: 'company_industry', label: 'Industry' },
      { key: 'company_region', label: 'Region' },
      { key: 'headcount', label: 'Headcount' },
      { key: 'estimated_revenue', label: 'Estimated Annual Revenue' },
      { key: 'founded_year', label: 'Founding Year' },
      { key: 'credits_spent', label: 'Credits Spent', type: 'number' },
    ],
  },
};
