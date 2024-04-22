const express = require("express");
const path = require("path");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const { connectToMongoDB } = require("./connect");
const app = express();
const PORT = 8001;
connectToMongoDB("mongodb://localhost:27017/short-url").then(() => {
  console.log("mongodb connected");
});

// server side rendering we need to install ejs and then tell express which engine we are using
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.get("/test", async (req, res) => {
//   const allUrls = await URL.find({});
//   return res.render("home", {
//     // here urls is array
//     urls: allUrls,
//   });
//   // return res.end(`
//   // <html>
//   // <head></head>
//   // <body>
//   // <ol>
//   // ${allUrls
//   //   .map(
//   //     (url) =>
//   //       `<li>${url.shortID} - ${url.redirectURL} - ${url.visithistory.length}</li>`
//   //   )
//   //   .join("")}
//   // </ol>
//   // </body>
//   // </html>
//   // `);
// });
// on /url use restrictToLoggedinUserOnly middleware so that login only when allowed

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/", checkAuth, staticRouter);
app.use("/user", userRoute);
app.get("/url/:shortID", async (req, res) => {
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    {
      shortID,
    },
    {
      $push: {
        visithistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
