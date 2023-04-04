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
    path: ["/frontcart/addcart","/frontcart/getusercart","/frontcart/delcart","/frontcart/batchdelcart","/frontcart/clearcart"], // 不需要验证token的喜欢
  })
);
router.post("/addcart", (req, res) => {
  console.log(req.body);
  let {
  goodid,
    userid
  } = req.body;

  if (!(goodid && userid)) {
    res.send({
      code: 5001,
      msg: "参数错误!"
    });
    return;
  }
  const sql = `insert ignore into  frontcart(goodid,userid) values("${goodid}", "${userid}")`;
  conn.query(sql, (err, data) => {
    if (err) throw err;

    if (data.affectedRows > 0) {
      res.send({
        code: 0,
        msg: "添加购物车成功!"
      });
    } else {
      res.send({
        code: 1,
        msg: "添加购物车失败!"
      });
    }
  });
});




/* 清空*/
router.get("/clearcart", (req, res) => {
  let { userid } = req.query;

  if (!userid) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  const sql = `delete from frontcart where userid = ${userid}`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({
        code: 0,
        msg: "清空购物车成功!",
      });
    } else {
      res.send({
        code: 1,
        msg: "清空购物车失败!",
      });
    }
  });
});
/* 批量删除 */
router.post("/batchdelcart", (req, res) => {
  console.log("🚀 ~ file: frontcart.js:88 ~ router.get ~ req, res:", req, res)
  let { ids } = req.body;
  console.log(ids,'*********************************')
  if (!ids) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  const sql = `delete from frontcart where goodid in (${JSON.parse(ids).join(",")})`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({
        code: 0,
        msg: "批量删除成功!",
      });
    } else {
      res.send({
        code: 1,
        msg: "批量删除失败!",
      });
    }
  });
});


router.get('/getusercart', (req, res) => {
 
	let {userid}   = req.query;

	if (!userid) {
		res.send({ code: 5001, msg: '参数错误!' })
		return
	}

	const sql = `select t2.* from frontcart t1 inner join goods t2 on t1.goodid = t2.id where userid=${userid}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data })
	})
})

// 修改喜欢
// router.post('/editcart', (req, res) => {
//   let {
//     name,
//     phone,
//     province,
//     city,
//     county,
//     village,
//     userid,
//     id
//   } = req.body;
// 	if (!(name && phone && province && county && city && village && userid&&id)) {
// 		res.send({ code: 5001, msg: "参数错误!" })
// 		return;
// 	}

// 	const sql = `update frontcart set name="${name}", phone="${phone}", province="${province}", county="${county}", 
// 	city="${city}", village="${village}" where id=${id}`;


// 	conn.query(sql, (err, data) => {
// 		if (err) throw err;
// 		if (data.affectedRows > 0) {
// 			res.send({
// 				code: 0,
// 				msg: '修改喜欢成功!'
// 			})
// 		} else {
// 			res.send({
// 				code: 1,
// 				msg: '修改喜欢失败!'
// 			})
// 		}
// 	})
// })



/* 删除单个 */
router.get("/delcart", (req, res) => {
  let { id } = req.query;
  if (!id) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }
  const sql = `delete from frontcart where goodid = ${id}`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "购物车删除该商品成功!" });
    } else {
      res.send({ code: 1, msg: "购物车删除该商品失败!" });
    }
  });
});
module.exports = router;