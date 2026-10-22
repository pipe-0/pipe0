'use strict';

const { version: platformVersion } = require('zapier-platform-core');
const { version } = require('./package.json');

const authentication = require('./authentication');
const { addAuthHeader, handleErrors } = require('./lib/pipe0');

const findWorkEmail = require('./searches/find_work_email');
const findCompany = require('./searches/find_company');
const verifyEmail = require('./creates/verify_email');
const runPipe = require('./creates/run_pipe');

module.exports = {
  version,
  platformVersion,

  authentication,
  beforeRequest: [addAuthHeader],
  afterResponse: [handleErrors],

  triggers: {},

  searches: {
    [findWorkEmail.key]: findWorkEmail,
    [findCompany.key]: findCompany,
  },

  creates: {
    [verifyEmail.key]: verifyEmail,
    [runPipe.key]: runPipe,
  },

  resources: {},
};
