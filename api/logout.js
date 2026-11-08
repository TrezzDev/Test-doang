const { setCookie } = require('../lib/auth');
module.exports = (req, res) => { setCookie(res, ''); res.json({ ok: true }); };
