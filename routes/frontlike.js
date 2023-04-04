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
    path: ["/frontlike/addlike","/frontlike/getuserlike","/frontlike/dellike"], // 不需要验证token的喜欢
  })
);
router.post("/addlike", (req, res) => {
  console.log(req.body);
  let {
  goodid,
    userid
  } = req.body;

  if (!(goodid &&   userid)) {
    res.send({
      code: 5001,
      msg: "参数错误!"
    });
    return;
  }
  const sql = `insert ignore into  frontlike(goodid,userid) values("${goodid}", "${userid}")`;
  conn.query(sql, (err, data) => {
    if (err) throw err;

    if (data.affectedRows > 0) {
      res.send({
        code: 0,
        msg: "添加喜欢成功!"
      });
    } else {
      res.send({
        code: 1,
        msg: "添加喜欢失败!"
      });
    }
  });
});



router.get('/getuserlike', (req, res) => {
 
	let {userid}   = req.query;

	if (!userid) {
		res.send({ code: 5001, msg: '参数错误!' })
		return
	}

	const sql = `select t2.* from frontlike t1 inner join goods t2 on t1.goodid = t2.id where userid=${userid}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data })
	})
})

// 修改喜欢
// router.post('/editlike', (req, res) => {
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

// 	const sql = `update frontlike set name="${name}", phone="${phone}", province="${province}", county="${county}", 
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



/* 删除喜欢 */
router.get("/dellike", (req, res) => {
  let { id } = req.query;
  if (!id) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }
  const sql = `delete from frontlike where goodid = ${id}`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "收藏已取消!" });
    } else {
      res.send({ code: 1, msg: "收藏取消失败!" });
    }
  });
});
module.exports = router;