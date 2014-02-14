var credentials = require('../credentials');

// the database url to connect
// module.exports = {

// dbPath : 'mongodb://localhost:27017/pricing'

// }


module.exports = {

dbPath : "mongodb://" + credentials.user + ":" + credentials.passwd + "@troup.mongohq.com:10031/db-ca-water-pricing"

}

