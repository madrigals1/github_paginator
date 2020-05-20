const dotenv = require('dotenv');

dotenv.config();
const { GITHUB_TOKEN } = process.env;

module.exports = { GITHUB_TOKEN };