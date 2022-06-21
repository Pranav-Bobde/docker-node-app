const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");

const postRouter = require("./routes/postRoutes")

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
  })
  .then(() => console.log("successfully connected to DB"))
  .catch((e) => console.log(e));

app.use(express.json())

app.get("/", (req, res) => {
  res.send("<h2> Hi there!!!</h2>");
});

//localhost:3000/posts
app.use("/posts", postRouter)
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
