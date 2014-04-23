var credentials = require('../credentials');

// local

// module.exports = {
// 	dbPath : 'mongodb://localhost:27017/pricing'
// }

// sandbox

// module.exports = {
// 	dbPath : "mongodb://" + credentials.user + ":" + credentials.passwd + "@troup.mongohq.com:10031/db-ca-water-pricing"
// }

// production

module.exports = {
	dbPath : "mongodb://" + credentials.user + ":" + credentials.passwd + "@emma.mongohq.com:10009/db-ca-water-pricing_production"
}