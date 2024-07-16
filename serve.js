const express = require("express");
const path = require("path");
// 解决跨域的中间件
const cors = require("cors");

const app = express();
const prot = 5000;
// 引入文件上传的库
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload/");
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname.split(".")[1];
    cb(null, file.fieldname + "-" + Date.now() + fileName);
  },
});
// 设置文件上传的目录
const upload_img = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // 只允许上传图片文件
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = "Only image files are allowed!";
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/files");
  },
  filename: (req, file, cb) => {
    let fileName = decodeURIComponent(file.originalname);
    // console.log(fileName);
    let name = fileName.split(".");
    file.originalname = fileName;
    // console.log(name);
    cb(null, file.fieldname + "-" + Date.now() + "." + name[name.length - 1]);
  },
});

const upload_word = multer({ storage: storage1 });

// express框架解决跨域
app.use(cors());

// 如果返回的是携带json格式的请求体(Content-Type:application/json)将json解析为js对象
// 解析完会将值放在req.body中
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "public")));

app.post("/upload-image", upload_img.single("image"), (req, res) => {
  try {
    let date = new Date();
    while (new Date() - date < 3000) {}
    let file = req.file;
    // console.log(file);
    if (!file) {
      return res.status(400).json({
        status: 400,
        message: "头像上传失败",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "头像上传成功",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "服务器出现问题",
    });
  }
});

app.post("/upload-word", upload_word.array("words"), (req, res) => {
  try {
    let date = new Date();
    while (new Date() - date < 3000) {}
    // console.log(req);
    let file = req.files;
    // console.log("ffffffff", file);
    if (!file) {
      return res.status(400).json({
        status: 400,
        message: "头像上传失败",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "头像上传成功",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "服务器出现问题",
    });
  }
});

app.listen(prot, () => {
  //函数体
  console.log(`服务器启动成功http://localhost:${prot}`);
});
