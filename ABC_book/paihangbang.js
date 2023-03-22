const cheerio = require('cheerio');
const { request, BASE_URL } = require('../request');
const { sql_addData, sql_search } = require('../data_utils');

// 方法中参数抽离
const sheetName = 'book_dushi'; // 数据库的表名
const bookType = '都市言情'; //当前book要存储什么类型，因为首页没有小说类型，进入详情一个个存储的话太慢
const targetPage = 200; // 要存储到多少页
const bookTypeId = 114; // 小说类型对应的id

// 获取ABC排行榜数据
async function getABCRanking(page) {
	try {
		if (page >= targetPage) {
			return;
		}
		const html = await request(`/paihangbang/all${bookTypeId}_${page}.html`);
		const $ = cheerio.load(html);
		$('#main .hot_sale').map(async (i, item) => {
			// 先拿到当前小说id做个判断，如果存在就不往数据库存
			let bookId = $(item).children('a').attr('href').split('/')[2];
			const isBook = await sql_search(sheetName, bookId);
			if (isBook.length) {
				console.log('当前id为' + bookId + '的书籍数据库已经存在');
				if (i === $('#main .hot_sale').length - 1) {
					getABCRanking((page += 1));
				}
			} else {
				let bookObj = {
					bookId: bookId,
					bookCover:
						BASE_URL +
						$(item).children('a').children('img').attr('data-original'),
					bookName: $(item).children('a').children('.title').text(),
					bookAuthor: $(item).children('a').children('.author').text(),
					bookDescribe: $(item).children('.review').text().trim(),
					bookType: bookType,
					currentPage: page,
				};
				await sql_addData(sheetName, bookObj);
				console.log('小说:' + bookObj.bookName + '入库成功！');

				if (i === $('#main .hot_sale').length - 1) {
					console.log(`页码为${page}完成入库，正在进入下一页`);
					let timer = setTimeout(() => {
						getABCRanking((page += 1));
						clearTimeout(timer);
					}, 1000);
				}
			}
		});
	} catch (error) {
		console.log('报错了！！！！！！！！！！！！！！！');
		getABCRanking(page);
	}
}
getABCRanking(1);
