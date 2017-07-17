module.exports = {
  servers: {
    one: {
      host: '45.32.162.29',
      username: 'root',
      password: '5wQ=a#))(Xvp5)(X',
    }
  },
  meteor: {
    name: 'Magic',
    path: 'C:/Magic',
    docker: {
		image: 'abernix/meteord:base',
		imagePort: 80,
    },
    servers: {
      one: {}
    },
    //buildOptions: {
    // serverOnly: true,
    //},
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
    deployCheckWaitTime: 6000,
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