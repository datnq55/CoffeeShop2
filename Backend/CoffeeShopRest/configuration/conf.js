
// database constants
const DbConfig = {
	// DB URL
	DB_URL: 'mongodb://101PublicBu10:27017/coffeeshop2',

	// Collection names
	COLLECTION_USER : 'user',
	COLLECTION_TABLE: 'table',
	COLLECTION_ORDER: 'order',
	COLLECTION_FOOD : 'food'
};

module.exports = {
	db: DbConfig
};