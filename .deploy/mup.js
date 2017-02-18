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
    path: 'C:/Magic',
	
    servers: {
      one: {}
    },
	docker: {
      image: 'abernix/meteord:base'
	},
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://www.crowdmtg.com',
      MONGO_URL: 'mongodb://localhost.com/meteor'
    },
    deployCheckWaitTime: 600,
	 ssl: {
		crt: './bundle.crt', // this is a bundle of certificates
		key: './private.key', // this is the private key of the certificate
		port : 443
	},
	enableUploadProgressBar: true
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
