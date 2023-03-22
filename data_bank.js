const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'dai19981215',
	database: 'pencil_book',
});
connection.connect();

module.exports = {
	connection,
};
