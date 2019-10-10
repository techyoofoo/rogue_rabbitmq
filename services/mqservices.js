var rabbitConn = require('../connection/mqconnection');
let ch = null;
let connection = null;
rabbitConn(function(conn){
    connection = conn;
    conn.createChannel(function (err, channel) {
         if (err) {
            throw new Error(err)
          }
        ch = channel;
    }, {noAck: true});
});

export const publishToQueue = async (queueName, data) => {
    ch.sendToQueue(queueName, new Buffer(data), {persistent: true});
}

export const consume = (queueName, res) => {
    console.log("Waiting for messages in %s.", queueName);
    //var q = queueName;
    //ch.noAck = true;
    ch.assertQueue(queueName, {durable: true}, function(err, status) {
        if (err) {
            throw new Error(err)
        }
        else if (status.messageCount === 0) {
              res.send('{"messages": 0}')
        } else {
              var numChunks = 0;
              res.writeHead(200, {"Content-Type": "application/json"})
              res.write('{"messages": [')
              ch.consume(queueName.que, function(msg) {
                var resChunk = msg.content.toString()
                res.write(resChunk)
                numChunks += 1
                numChunks < status.messageCount && res.write(',')
                if (numChunks === status.messageCount) {
                  res.write(']}')
                  res.end()
                  //ch.close(function() {connection.close()})
                }
            })
        }
    })
}

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});