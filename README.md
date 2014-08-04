Running Ghost on a /blog Subdirectory
======================================

This is a quick guide/example for how to run a Ghost instance on a /blog sub-directory of your own application. This example uses Hapi.js as the main application server, but the same Ghost config approach should work with any Node server framework. This approach should allow you to run Ghost as part of a bigger Node.js application, and to separate Ghost's config and content from the node_modules folder completely.

This demo uses wildcard URL to make it easy to try out on a local machine. The assumption is that the reader will know how to configure their own production URL instead, as well as other non-Ghost specific parameters.

To try this repo out
---------------------

    $ npm install
    $ node app.js


To replicate for your own app
------------------------------

Follow these steps substituting where it makes sense.

1) Install Hapi.js and Ghost (or ignore this step and replace Hapi with whatever server framework you're already using)

    $ npm install hapi
    $ npm install ghost

2) Copy the Ghost `content` folder and `config.example.js` file into the root of your project

    $ cp -R node_modules/ghost/content content
    $ cp node_modules/ghost/config.example.js config.js

3) Create a simple server in `app.js`, configuring your Ghost instance to consume the `config.js` file which you copied to your root directory in step 2. 

    $ touch app.js

    var Hapi = require('hapi'),
    	ghost = require('ghost'),
    	path = require('path'),
    	server;

    server = new Hapi.Server('0.0.0.0', '8000');

    // existing node application
    server.route({
    	method: 'GET',
    	path: '/',
    	handler: function(request, reply) {
    		reply('hello');
    	}
    });

    // proxy to ghost blog
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

4) Change the `url` key in config.js under both `development` and `production` to match what you used in app.js.

    url: 'http://0.0.0.0/blog'

4) Run `app.js` and visit the site at `http://localhost:8000/blog/` - it should proxy correctly to Ghost.

Please file an issue if you have any problems!


More Information
-----------------


- https://github.com/TryGhost/Ghost/wiki/Using-Ghost-as-an-NPM-module
- https://ghost.org/forum/using-ghost/15521-getting-ghost-working-in-a-sub-director-e-g-blog/
- http://www.allaboutghost.com/how-to-install-ghost-in-a-subdirectory/


