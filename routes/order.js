const express = require("express");
const router = express.Router();
const moment = require("moment");
const conn = require("./db/conn");

router.all("*", (req, res, next) => {
	// 先设置响应头
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");

	// 给其他路由放行
	next();
});

// 添加用户关于订单
router.post("/adduseraboutorder", (req, res) => {
	console.log(req.body);
	let { orderno, userid,goodid } = req.body;

	if (!(orderno && userid&&goodid)) {
		res.send({
			code: 5001,
			msg: "参数错误!",
		});
		return;
	}
	const sql = `insert ignore into  useraboutorder(orderno,userid,goodid) values("${orderno}", "${userid}","${goodid}")`;
	conn.query(sql, (err, data) => {
		if (err) throw err;

		if (data.affectedRows > 0) {
			res.send({
				code: 0,
				msg: "添加用户关于订单成功!",
			});
		} else {
			res.send({
				code: 1,
				msg: "添加用户关于订单失败!",
			});
		}
	});
});

// 获取用户订单内容

router.get('/getuserordercontent', (req, res) => {
 
	let {userid}   = req.query;

	if (!userid) {
		res.send({ code: 5001, msg: '参数错误!' })
		return
	}

	const sql = `select t2.* from useraboutorder t1 inner join goods t2 on t1.goodid = t2.id where userid=${userid}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data })
	})
})
// 查看订单获取商品信息

router.post('/getordergood', (req, res) => {
 
	let {goodid}   = req.body;

	if (!goodid) {
		res.send({ code: 5001, msg: '参数错误!' })
		return
	}

	const sql = `select * from goods where id=${goodid}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data })
	})
})
// 查看单个订单


router.get('/getoneorder', (req, res) => {
 
	let {orderno}   = req.query;

	if (!orderno) {
		res.send({ code: 5001, msg: '参数错误!' })
		return
	}

	const sql = `select * from orders where orderNo=${orderno}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data })
	})
})




/* 添加商品 */
router.post("/addorder", (req, res) => {
	let {
		orderNo,
		orderTime,
		phone,
		consignee,
		deliverAddress,
		deliveryTime,
		orderAmount,
		orderState,
		remarks,
	} = req.body;

	if (
		!orderNo ||
		!orderTime ||
		!phone ||
		!consignee ||
		!deliverAddress ||
		!deliveryTime ||
		!orderAmount ||
		!orderState ||
		!remarks
	) {
		res.send({ code: 5001, msg: "参数错误!" });
		return;
	}
	try {
		console.log(deliverAddress);
		console.log("o111", orderTime);

		orderTime = moment(orderTime).format("YYYY-MM-DD HH:mm:ss");
		console.log("o22", orderTime);

		deliveryTime = moment(deliveryTime).format("YYYY-MM-DD HH:mm:ss");
		const sql = `insert into orders(orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,orderAmount,orderState,remarks) values("${orderNo}", "${orderTime}", "${phone}", "${consignee}", '${deliverAddress}', "${deliveryTime}", "${orderAmount}", "${orderState}","${remarks}")`;
		conn.query(sql, (err, data) => {
			if (err) throw err;
			if (data.affectedRows > 0) {
				res.send({ code: 0, msg: "订单成功" });
			} else {
				res.send({ code: 1, msg: "订单失败" });
			}
		});
	} catch (error) {
		console.log(error);
	}
	// console.log(deliverAddress);
	// orderTime = moment(orderTime).format("yyyy-MM-DD HH:mm:ss");
	// deliveryTime = moment(deliveryTime).format("yyyy-MM-DD HH:mm:ss");
	// const sql = `insert into orders(orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,orderAmount,orderState,remarks) values("${orderNo}", "${orderTime}", "${phone}", "${consignee}", '${deliverAddress}', "${deliveryTime}", "${orderAmount}", "${orderState}","${remarks}")`;
	// conn.query(sql, (err, data) => {
	// 	if (err) throw err;
	// 	if (data.affectedRows > 0) {
	// 		res.send({ code: 0, msg: "订单成功" });
	// 	} else {
	// 		res.send({ code: 1, msg: "订单失败" });
	// 	}
	// });
});

/* 获取订单列表 && 带查询功能 */
router.get("/list", (req, res) => {
	let { currentPage, pageSize, orderNo, consignee, phone, orderState, date } =
		req.query;
	pageSize = pageSize ? pageSize : "";
	orderNo = orderNo ? orderNo : "";
	consignee = consignee ? consignee : "";
	phone = phone ? phone : "";
	orderState = orderState ? orderState : "";
	date = date ? date : [];

	if (!(currentPage && pageSize)) {
		res.send({ code: 5001, msg: "参数错误!" });
		return;
	}

	let sql = `select * from orders where 1 = 1`;

	if (orderNo) {
		sql += ` and orderNo like "%${orderNo}%"`;
	}

	if (consignee) {
		sql += ` and consignee like "%${consignee}%"`;
	}

	if (phone) {
		sql += ` and phone like "%${phone}%"`;
	}

	if (orderState) {
		sql += ` and orderState = "${orderState}"`;
	}

	date = Array.isArray(date) ? [] : JSON.parse(date);
	if (date.length) {
		sql += ` and orderTime between "${date[0]}" and "${date[1]}"`;
	}

	sql += ` order by orderTime desc`;

	let total;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		total = data.length;

		let n = (currentPage - 1) * pageSize;
		sql += ` limit ${n}, ${pageSize}`;

		conn.query(sql, (err, data) => {
			if (err) throw err;
			res.send({
				total,
				data,
			});
		});
	});
});

/**
 * 查询
 */
router.get("/search", (req, res) => {
	let { currentPage, pageSize, orderNo, consignee, phone, orderState, date } =
		req.query;
	pageSize = pageSize ? pageSize : "";
	orderNo = orderNo ? orderNo : "";
	consignee = consignee ? consignee : "";
	phone = phone ? phone : "";
	orderState = orderState ? orderState : "";
	date = date ? date : [];

	if (!(currentPage && pageSize)) {
		res.send({ code: 5001, msg: "参数错误!" });
		return;
	}

	let sql = `select * from orders where 1 = 1`;

	if (orderNo) {
		sql += ` and orderNo like "%${orderNo}%"`;
	}

	if (consignee) {
		sql += ` and consignee like "%${consignee}%"`;
	}

	if (phone) {
		sql += ` and phone like "%${phone}%"`;
	}

	if (orderState) {
		sql += ` and orderState = "${orderState}"`;
	}

	date = Array.isArray(date) ? [] : JSON.parse(date);
	if (date.length) {
		sql += ` and orderTime between "${date[0]}" and "${date[1]}"`;
	}

	sql += ` order by orderTime desc`;

	let total;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		total = data.length;

		let n = (currentPage - 1) * pageSize;
		sql += ` limit ${n}, ${pageSize}`;

		conn.query(sql, (err, data) => {
			if (err) throw err;
			res.send({
				total,
				data,
			});
		});
	});
});

/* 获取订单详情 */
router.get("/detail", (req, res) => {
	let { id } = req.query;

	if (!id) {
		res.send({ code: 5001, msg: "参数错误!" });
		return;
	}

	const sql = `select * from orders where id=${id}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data[0] });
	});
});

/* 保存修改 */
router.post("/edit", (req, res) => {
	let {
		orderNo,
		orderTime,
		phone,
		consignee,
		deliverAddress,
		deliveryTime,
		remarks,
		orderAmount,
		orderState,
		id,
	} = req.body;

	if (
		!(
			orderNo &&
			orderTime &&
			phone &&
			consignee &&
			deliverAddress &&
			deliveryTime &&
			remarks &&
			orderAmount &&
			orderState
		)
	) {
		res.send({ code: 5001, msg: "参数错误!" });
		return;
	}

	const sql = `update orders set orderNo="${orderNo}", orderTime="${orderTime}", phone="${phone}", consignee="${consignee}", 
	deliverAddress="${deliverAddress}", deliveryTime="${deliveryTime}", remarks="${remarks}", orderAmount="${orderAmount}", 
	orderState="${orderState}" where id=${id}`;

	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({
				code: 0,
				msg: "修改订单成功!",
			});
		} else {
			res.send({
				code: 1,
				msg: "修改订单失败!",
			});
		}
	});
});

/* 首页数据统计接口 */
router.get("/totaldata", (req, res) => {
	res.send({
		totalOrder: 5486,
		totalAmount: 202466,
		todayOrder: 189,
		totayAmount: 2189,
		xData: [
			"2019/11/17",
			"2019/11/18",
			"2019/11/19",
			"2019/11/20",
			"2019/11/21",
			"2019/11/22",
			"2019/11/23",
		],
		orderData: [120, 132, 101, 134, 90, 230, 210],
		amountData: [220, 282, 191, 234, 290, 330, 310],
	});
});

/* 订单统计 */
router.get("/ordertotal", (req, res) => {
	let { date } = req.query;

	date = JSON.parse(date);

	let sql = `select orderTime, orderAmount from orders`;

	if (date && date.length) {
		sql += ` orders where orderTime between "${date[0]}" and "${date[1]}"`;
	}
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data });
	});
});

module.exports = router;
