var express             = require("express"),
    config              = require("./config"),
    messageModuleConfig = require("./modules/twilio/config");

var app = express();
config.configure(app);

//Database seed
if (process.argv[2] === "seed") {
  var seedDb  = require("./seeds");
  seedDb();
}

messageModuleConfig.configure(app);



var rootRoutes = require("./routes/root"),
    adminRoutes = require("./routes/admin"),
    bikeRoutes = require("./routes/bikes"),
    subscriberRoutes = require("./routes/subscribers"),
    userRoutes = require("./routes/users"),
    settingsRoutes = require("./routes/settings"),
    apiRoutes = require("./routes/api");

app.use("/", rootRoutes);
app.use("/admin", adminRoutes);
app.use("/bikes", bikeRoutes);
app.use("/subscribers", subscriberRoutes);
app.use("/users", userRoutes);
app.use("/settings", settingsRoutes);
app.use("/api", apiRoutes);


// serve '/public' folder
app.use(express.static(__dirname + "/public"));

app.listen(config.port, config.ipAddress, function () {
  console.log("Server is running at: " + config.ipAddress + ":" + config.port);
});
