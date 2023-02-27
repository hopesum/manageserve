const express = require("express");
const router = express.Router();
var multer = require("multer");

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
 * 头像上传
 */
const storage = multer.diskStorage({
 destination: "public/upload/imgs/frontuser_img", //
  filename: function (req, file, cb) {
    const fileFormat = file.originalname.split(".");
    const filename = new Date().getTime();
    cb(null, filename + "." + fileFormat[fileFormat.length - 1]); // 拼接文件名
  },
});

const upload = multer({
  storage,
});

/* 头像上传接口 */
router.post("/frontuserimg_upload", upload.single("file"), (req, res) => {
  let { filename } = req.file;
  const imgUrl = '/upload/imgs/frontuser_img/' + filename

  res.json({ code: 0, msg: "上传成功!", imgUrl });
});


router.post("/addfrontuser", (req, res) => {
console.log(req.body)
  let { account, password, type,imgUrl} = req.body;

  if (!(account && password && type)) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }
  const sql = `insert into  frontuser(account, password, type, imgUrl) values("${account}", "${password}", "${type}", "${imgUrl}")`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
   
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "添加账号成功!" });
    } else {
      res.send({ code: 1, msg: "添加账号失败!" });
    }
  });

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
    path: ["/frontuser/frontcheckLogin", "/frontuser/frontuserimg_upload","/frontuser/addfrontuser"], // 不需要验证token的地址
  })
);

// 拦截器
router.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ code: 401, msg: "无效的token" });
  }
});





  // 检查登录接口、

  router.post("/frontcheckLogin", (req, res) => {
    let { account, password ,type} = req.body;
    if (!(account && password && type)) {
      res.send({ code: 5001, msg: "参数错误!" });
      return;
    }
    const sql = `select * from frontuser where account="${account}" and password="${password}" and type="${type}"`;
    conn.query(sql, (err, data) => {
      if (err) throw err;
      if (data.length) {
        const userInfo = { ...data[0] };
        const token =
          "Bearer " +
          jwt.sign(userInfo, secretKey, {
            expiresIn: 60 * 60 * 7 * 24,
          });
  
        let role;
        if (data[0].type == 1) {
          role = "商家";
        }else if(data[0].type == 2){
          role = "顾客";
        }else {
          role = "外卖员";
        }
  
        res.send({
          code: 0,
          msg: "欢迎你，登录成功",
          token,
          role,
          data
        });
      } else {
        res.send({ code: 1, msg: "登录失败，请检查用户名或密码" });
      }
    });
  });
  


  

module.exports = router;