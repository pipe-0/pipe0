'use strict';

const { API_BASE } = require('./lib/pipe0');

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true,
      helpText:
        'Create an API key in your pipe0 dashboard under **API and MCP** > **API keys**. [Learn more](https://pipe0.com/docs/authentication).',
    },
  ],
  // Cheap authenticated GET that fails on a bad key.
  test: {
    url: `${API_BASE}/credit-balance`,
    method: 'GET',
  },
  connectionLabel: 'pipe0',
};
