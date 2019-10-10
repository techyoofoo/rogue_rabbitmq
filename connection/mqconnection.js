var amqp = require('amqplib/callback_api')

var opts = {
  cert: "",
  key: "",
  passphrase: "",
  ca: ""
}

module.exports = function(cb) {
    amqp.connect('amqp://localhost',
    opts, function(err, conn) {
      if (err) {
        throw new Error(err)
      }
      cb(conn)
    })
}