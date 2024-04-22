const shortid = require("shortid");
const URL = require("../models/url");
async function handlegeneratenewshorturl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }
  const shortID = shortid();
  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visithistory: [],
    // this user coming from middleware auth.js
    createdBy: req.user._id,
  });
  return res.render("home", {
    id: shortID,
  });
  // return res.json({ id: shortID });
}
async function handlegetanalytics(req, res) {
  const shortID = req.params.shortID;
  const result = await URL.findOne({ shortID });
  return res.json({
    totalClicks: result.visithistory.length,
    analytics: result.visithistory,
  });
}
module.exports = {
  handlegeneratenewshorturl,
  handlegetanalytics,
};
