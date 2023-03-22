// mysql 查询 插入方法封装
const { connection } = require('./data_bank');
// 根据id查询
function sql_search(tableName, id) {
	return new Promise((resolve, reject) => {
		connection.query(
			`select * from ${tableName} where bookId = ${id}`,
			(err, res, fields) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			}
		);
	});
}

// 封装插入方法
function sql_addData(tableName, data) {
	return new Promise((resolve, reject) => {
		let kes = Object.keys(data);
		let values = Object.values(data);
		let keyArr = [];
		kes.forEach((item) => keyArr.push('?'));
		connection.query(
			`INSERT INTO ${tableName} (${kes.join()}) values (${keyArr.join()})`,
			values,
			(err, res, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			}
		);
	});
}

module.exports = {
	sql_search,
	sql_addData,
};
