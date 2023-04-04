const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const conn = require("./db/conn");

/* 设置CROS 解决跨域 */
router.all("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

/* 上传图片 */
const storage = multer.diskStorage({
  destination: "public/upload/imgs/goods_img",
  filename: function (req, file, cb) {
    const fileFormat = file.originalname.split(".");
    const filename = new Date().getTime();
    cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
  },
});
const upload = multer({
  storage,
});

router.post("/goods_img_upload", upload.single("file"), (req, res) => {
  let { filename } = req.file;
  res.send({ code: 0, msg: "上传成功!", imgUrl: '/upload/imgs/goods_img/' + filename });
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
    path: ["/goods/goods_img_upload", "/goods/list","/goods/catelist","/goods/goods_list","/goods/getgood"], // 不需要验证token的地址
  })
);

// 拦截器
router.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ code: 401, msg: "无效的token" });
  }
});
// 获取商品


router.get('/getgood', (req, res) => {
 
	let {id}   = req.query;

	if (!id) {
		res.send({ code: 5001, msg: '参数错误!' })
		return
	}

	const sql = `select * from goods where id=${id}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		res.send({ data: data })
	})
})


/* 添加商品 */
router.post("/add", (req, res) => {
  let { name, category, price, imgUrl, goodsDesc } = req.body;

  if (!name || !category || !price || !imgUrl || !goodsDesc) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }
  let num=Math.random()*20
  let username=['匿名用户','coderwhy','BLUE','yolo','Nuyoah','自救者天救','圣经','吃货',"且听风","铃微光倾城","偷得浮生","雨晨的清风","烛光里的愿紫","色的彩虹","伊人泪满面青丝","茧微醉阳光","山月","山月不知心底事","秋日薄暮","秋日薄暮用","菊花煮竹叶青","人与海棠俱醉","星霜荏苒","星辰一年一循环","指岁月渐渐流逝","绛橘色的日落","温柔的人","森林","天空","孤鲸","晚风","萤火","星河","万顷","糖","香料","绛橘色的日落","闪耀旳白梦"]
  let comment=['很喜欢的粥','超级好吃',"价格贵",'分量少','不推荐了，超级难吃',"味道真的不错，朋友都喜欢吃。","包装感觉干净卫生，外卖小哥送餐速度快，","实在是忍不住夸赞一下，色泽比较好，而且价格优惠价格实惠，","外卖打包的真的是非常的干净整洁，色味俱佳。","今天点的这家，没想到这么实惠的东西，好特别的非常的美味可口，没错！真的是特别的美味！","你没有听错，香味也非常的独特，是我吃到的非常优秀的食物，我以后还会再来购买的！","很不错的饭菜，价格未免也太实惠了吧，","味道超级无敌可以的，，数量足，快递也贼快，","整体还是非常不错的，超级满足，下次再来，实在是太好吃了，","这么良心的商家太少有了。"]
   let png=['http://127.0.0.1:5000/avatar/1.jpg','http://127.0.0.1:5000/avatar/2.jpg','http://127.0.0.1:5000/avatar/3.jpg','http://127.0.0.1:5000/avatar/4.jpg','http://127.0.0.1:5000/avatar/5.jpg','http://127.0.0.1:5000/avatar/6.jpg','http://127.0.0.1:5000/avatar/7.jpg','http://127.0.0.1:5000/avatar/8.jpg','http://127.0.0.1:5000/avatar/9.jpg','http://127.0.0.1:5000/avatar/0.jpg']
  let resultarr=[]
  
  for(var i=0;i<=num;i++){
   const obj= {
      username:username[Math.floor(Math.random()*39)],
      rateTime:1680057011103*Math.random()*2,
      rateType: 0,
      text: comment[Math.floor(Math.random()*16)],
      avatar:png[Math.floor(Math.random()*11)],
    }
    resultarr.push(obj)
  }
  
  // let ratings = [
  //   {
  //     username:username[Math.floor(Math.random()*39)],
  //     rateTime:1680057011103*Math.round(Math.random()),
  //     rateType: 0,
  //     text: "很喜欢的粥",
  //     avatar:
  //       "http://static.galileo.xiaojukeji.com/static/tms/default_header.png",
  //   },
  //   {
  //     username: "286451",
  //     rateTime: 1469271264000,
  //     rateType: 0,
  //     text: "",
  //     avatar:
  //       "http://static.galileo.xiaojukeji.com/static/tms/default_header.png",
  //   },
  //   {
  //     username: "3***b",
  //     rateTime: 1469261964000,
  //     rateType: 1,
  //     text: "",
  //     avatar:
  //       "http://static.galileo.xiaojukeji.com/static/tms/default_header.png",
  //   },
  // ];
  let ratings=resultarr
  ratings = JSON.stringify(ratings);
  let sellCount = Math.random() * 500;

  const sql = `insert into goods(name, category, price, imgUrl, goodsDesc, rating, ratings, sellCount) values("${name}", "${category}", ${price}, "${imgUrl}", "${goodsDesc}", 100, '${ratings}', ${sellCount})`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "添加商品成功" });
    } else {
      res.send({ code: 1, msg: "添加商品失败" });
    }
  });
});

/* 获取商品列表 */
router.get("/list", (req, res) => {
  let { currentPage, pageSize, name, category } = req.query;

  if (!currentPage || !pageSize) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  let sql = `select * from goods where 1 = 1`;
  let total;

  if (name) {
    sql += ` and name like "%${name}%"`;
  }

  if (category) {
    sql += ` and category like "%${category}%"`
  }

  sql += ` order by ctime desc`;

  console.log(sql)

  conn.query(sql, (err, data) => {
    if (err) throw err;
    total = data.length;
  });

  let n = (currentPage - 1) * pageSize;
  sql += ` limit ${n}, ${pageSize}`;

  conn.query(sql, (err, data) => {
    if (err) throw err;

    data.forEach(v => {
      v.imgUrl = '/upload/imgs/goods_img/' + v.imgUrl
    })

    res.send({ total, data });
  });
});

/* 删除商品 */
router.get("/del", (req, res) => {
  let { id } = req.query;
  if (!id) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }
  const sql = `delete from goods where id = ${id}`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "删除成功!" });
    } else {
      res.send({ code: 1, msg: "删除失败！" });
    }
  });
});

// 修改商品
router.post("/edit", (req, res) => {
  let { id, name, category, price, imgUrl, goodsDesc } = req.body;

  if (!(id && name && category && price && imgUrl && goodsDesc)) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  const sql = `update goods set name="${name}", category="${category}", price='${price}',
	 imgUrl="${imgUrl}", goodsDesc="${goodsDesc}" where id=${id}`;

  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "修改商品成功!" });
    } else {
      res.send({ code: 1, msg: "修改商品失败!" });
    }
  });
});

/* 添加商品分类 */
router.post("/addcate", (req, res) => {
  let { cateName, state } = req.body;
  if (!cateName || ![1, 0,"0","1"].includes(state)) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  const sql = `insert into goods_cate(cateName, state) values("${cateName}", ${state})`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "添加商品分类成功" });
    } else {
      res.send({ code: 1, msg: "添加商品分类失败" });
    }
  });
});

/* 查询所有商品分类 */
router.get("/catelist", (req, res) => {
  let { currentPage, pageSize } = req.query;

  if (!currentPage || !pageSize) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  let sql = `select * from goods_cate order by id desc`;
  let total;

  conn.query(sql, (err, data) => {
    if (err) throw err;
    total = data.length;
  });
  let n = (currentPage - 1) * pageSize;
  sql += ` limit ${n}, ${pageSize}`;

  conn.query(sql, (err, data) => {
    if (err) throw err;
    res.send({ total, data });
  });
});

/* 删除商品分类 */
router.get("/delcate", (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  const sql = `delete from goods_cate where id=${id}`;

  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "删除商品分类成功" });
    } else {
      res.send({ code: 1, msg: "删除商品分类失败" });
    }
  });
});

/* 修改商品分类 */
router.post("/editcate", (req, res) => {
  let { id, cateName, state } = req.body;

  if (!id || !cateName || ![1, 0].includes(state)) {
    res.send({ code: 5001, msg: "参数错误!" });
    return;
  }

  const sql = `update goods_cate set cateName="${cateName}", state=${state} where id=${id}`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ code: 0, msg: "修改商品分类成功" });
    } else {
      res.send({ code: 1, msg: "修改商品分类失败" });
    }
  });
});

/* 查询所有商品分类的名称 */
router.get("/categories", (req, res) => {
  let sql = `select cateName from goods_cate where state = 1`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

/* App端商品数据*/
router.get("/goods_list", (req, res) => {
  const sql = `select * from goods order by ctime desc`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    const categoryName = [...new Set(data.map((v) => v.category))].reverse();

    const arr = [];
    categoryName.forEach((cate) => {
      const obj = {
        name: "",
        foods: [],
      };
      data.forEach((v) => {
        if (v.category === cate) {
          obj.name = v.category;
          obj.foods.push(v);
        }
      });
      arr.push(obj);
    });

    for (let v of arr) {
      for (let food of v.foods) {
        food.imgUrl =
          "http://127.0.0.1:5000/upload/imgs/goods_img/" + food.imgUrl;
        food.ratings = JSON.parse(food.ratings);
      }
    }

    res.send({ goodsList: arr.reverse() });
  });
});

module.exports = router;
