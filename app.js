var Hapi = require('hapi'),
	ghost = require('ghost'),
	path = require('path'),
	server;

server = new Hapi.Server('0.0.0.0', '8000');

//existing node application
server.route({
	method: 'GET',
	path: '/',
	handler: function(request, reply) {
		reply('hello');
	}
});

//proxy to ghost blog
server.route({
	method: 'GET',
	path: '/blog/{p*}',
	handler: {
		proxy: {
			host: '0.0.0.0',
			port: '2368'
		}
	}
});

server.start();
console.log('Hapi server listening on port 8000');

ghost({
	config: path.join(__dirname, 'config.js')
})

