const express = require("express");
const router = express.Router();

const conn = require("./db/conn");
/**
 * 设置CROS允许跨域
 */
router.all("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

/**
 * token鉴权
 */
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const secretKey = "itsource";

router.use(
  expressJwt({
    secret: secretKey,
  }).unless({
    path: ["/frontaddress/addaddress","/frontaddress/getuseraddress","/frontaddress/editaddress","/frontaddress/deladdress"], // 不需要验证token的地址
  })
);
router.post("/addaddress", (req, res) => {
  console.log(req.body);
  let {
    name,
    phone,
    province,
    city,
    county,
    village,
    userid
  } = req.body;

  if (!(name && phone && province && county && city && village && userid)) {
    res.send({
      code: 5001,
      msg: "参数错误!"
    });
    return;
  }
  const sql = `insert ignore into  frontaddress(name,phone,province,city,county,village,userid) values("${name}", "${phone}", "${province}", "${city}", "${county}", "${village}","${userid}")`;
  conn.query(sql, (err, data) => {
    if (err) throw err;

    if (data.affectedRows > 0) {
      res.send({
        code: 0,
        msg: "添加地址成功!"
      });
    } else {
      res.send({
        code: 1,
        msg: "添加地址失败!"
      });
    }
  });
});



router.get('/getuseraddress', (req, res) => {
 
	let {userid}   = req.query;

	if (!userid) {
		res.send({ code: 5001, msg: '参数错误!' })
		return
	}

	const sql = `select * from frontaddress where userid=${userid}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data })
	})
})

// 订单编辑
router.post('/editaddress', (req, res) => {
  let {
    name,
    phone,
    province,
    city,
    county,
    village,
    userid,
    id
  } = req.body;
	if (!(name && phone && province && county && city && village && userid&&id)) {
		res.send({ code: 5001, msg: "参数错误!" })
		return;
	}

	const sql = `update frontaddress set name="${name}", phone="${phone}", province="${province}", county="${county}", 
	city="${city}", village="${village}" where id=${id}`;


	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({
				code: 0,
				msg: '修改地址成功!'
			})
		} else {
			res.send({
				code: 1,
				msg: '修改地址失败!'
			})
		}
	})
})



/* 删除地址 */
router.get("/deladdress", (req, res) => {
  let { id } = req.query;
  if (!id) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }
  const sql = `delete from frontaddress where id = ${id}`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "地址删除成功!" });
    } else {
      res.send({ code: 1, msg: "地址删除失败!" });
    }
  });
});
module.exports = router;