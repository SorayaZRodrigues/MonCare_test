const { services } = require('../data/store');

function listServices(req, res) {
  return res.json(services);
}

module.exports = { listServices };
