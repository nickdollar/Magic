module.exports = {
  servers: {
    one: {
      host: '138.197.202.193',
      username: 'root',
      // pem:
      password: 'F0caliz4r'
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'Magic',
    path: 'C:/Users/Nicholas/sites/Magic',
	
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
    deployCheckWaitTime: 600
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};