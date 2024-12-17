const express = require("express");
const admin_route = express();
const session = require("express-session");
const config = require("../config/config");
const body_parser = require("body-parser");
const admin_controller = require("../controllers/admin_controller");
const auth = require("../middleware/admin_auth");
const multer = require("multer");
const path = require("path");

admin_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/user_images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

admin_route.use(body_parser.json());

admin_route.use(body_parser.urlencoded({ extended: true }));

admin_route.use(session({ secret: config.sessionSecretKey }));

admin_route.set("view engine", "ejs");

admin_route.set("views", "./views/admin");

admin_route.get(
  "/",
  auth.is_logout,
  auth.clearCache,
  admin_controller.login_load
);

admin_route.post("/", admin_controller.verifyLogin);

admin_route.get(
  "/home",
  auth.is_login,
  auth.clearCache,
  admin_controller.dash_board
);

admin_route.get(
  "/logout",
  auth.is_login,
  auth.clearCache,
  admin_controller.load_logout
);

admin_route.get(
  "/dashboard",
  auth.is_login,
  auth.clearCache,
  admin_controller.admin_dashboard
);

admin_route.get(
  "/new_user",
  auth.is_login,
  auth.clearCache,
  admin_controller.load_new_user
);

admin_route.post("/addUser", upload.single("image"), admin_controller.add_user);

admin_route.get(
  "/new_user",
  auth.is_login,
  auth.clearCache,
  admin_controller.admin_dashboard
);

admin_route.post("/new_user", admin_controller.admin_dashboard);

admin_route.get(
  "/edit_user",
  auth.is_login,
  auth.clearCache,
  admin_controller.load_edit_user
);

admin_route.post("/edit_user", admin_controller.load_edit_update_users);

admin_route.get(
  "/delete_user",
  auth.clearCache,
  admin_controller.load_delete_user
);

admin_route.get("*", function (req, res) {
  res.redirect("/admin");
});

module.exports = admin_route;
