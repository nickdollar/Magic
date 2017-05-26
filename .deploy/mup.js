module.exports = {
  servers: {
    one: {
      host: '104.131.155.67',
      username: 'root',
      password: 'MagicSit3!',
    }
  },
  meteor: {
    name: 'Magic',
    path: 'C:/Magic',
    docker: {
		image: 'abernix/meteord:base' // (optional)
    },
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://www.crowdmtg.com', // If you are using ssl, this needs to start with https
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    ssl: {
      // Enables let's encrypt (optional)
      autogenerate: {
        email: 'ivelacc@gmail.com',
        domains: 'crowdmtg.com,www.crowdmtg.com' // comma seperated list of domains
      }
    },
    deployCheckWaitTime: 60,
    deployCheckPort: 80,
    enableUploadProgressBar: true // default false.
  },

  mongo: { // (optional)
    port: 27017,
	version: '3.2.12',
    servers: {
      one: {},
    },
  },
};