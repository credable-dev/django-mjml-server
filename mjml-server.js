'use strict';


var host = '127.0.0.1',
    port = '28101',
    touchstop_fn = null,
    argv = process.argv.slice(2);


switch (argv.length) {
    case 0:
        break;
    case 1:
        port = argv[0];
        break;
    case 2:
        port = argv[0];
        host = argv[1];
        break;
    case 3:
        port = argv[0];
        host = argv[1];
        touchstop_fn = argv[2];
        break;
    default:
        console.log('Run command: NODE_PATH=node_modules node tcpserver.js 28101 127.0.0.1 /tmp/mjmltcpserver.stop');
}


var mjml = require('mjml'),
    net = require('net'),
    fs = require('fs'),
    server = net.createServer();


function handleConnection(conn) {
    conn.setEncoding('utf8');
    conn.setNoDelay(true);

    var msgLen = 0,
        buffer = '';

    conn.on('data', function(d) {
      buffer = buffer + d;

      if(msgLen === 0 && buffer.length >= 9){
        msgLen = parseInt(buffer.slice(0, 9)) + 9;
        console.log('expect << ', msgLen)
      }

      if(buffer.length >= msgLen && msgLen > 0){
        console.log('got << ', buffer.length);
        var result;
        try {
            result = mjml.mjml2html(buffer.slice(9).toString());
            if (typeof result === 'object') result = result.html;
            console.log('output >> ', Buffer.byteLength(result))
            conn.write('0');
        } catch (err) {
            result = err.message;
            conn.write('1');
        }
        conn.write(('000000000' + Buffer.byteLength(result).toString()).slice(-9));
        conn.write(result);
        conn.end();
      }

    });
    conn.once('close', function() {
      console.log('Connection closed');
    });
    conn.on('error', function(err) {
      console.error('Connection error', err);
    });
}


server.on('connection', handleConnection);
server.listen(port, host, function () {
    console.log('RUN SERVER %s:%s', host, port);
});


if (touchstop_fn) {
    try {
        fs.statSync(touchstop_fn);
    } catch (e) {
        fs.closeSync(fs.openSync(touchstop_fn, 'w'));
    }

    fs.watchFile(touchstop_fn, function() {
        server.close();
        process.exit();
    });
}