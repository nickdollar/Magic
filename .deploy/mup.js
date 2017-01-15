module.exports = {
  servers: {
    one: {
      host: '104.131.155.67',
      username: 'root',
      // pem:
      password: 'MagicSit3!'
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'Magic',
    path: 'C:/Users/Nicholas/sites/Magic',
	
    servers: {
      one: {}
    },
	volumes : {
		"/root/images":"/bundle/bundle/programs/web.browser/app/cards/"
	},
	docker: {
      image: 'abernix/meteord:base'
	},
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://www.crowdmtg.com',
      MONGO_URL: 'mongodb://localhost.com/meteor'
    },
    deployCheckWaitTime: 600,
	ssl: {
		port: 443,
        crt: "./bundle.crt",
		key: "./private.key"
    },
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
