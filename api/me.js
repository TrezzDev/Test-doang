const { readUser } = require('../lib/auth');
module.exports = (req, res) => {
  const u = readUser(req);
  u ? res.json({ username: u }) : res.status(401).json({ error: 'Belum login' });
};
