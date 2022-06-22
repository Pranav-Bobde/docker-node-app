const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
  legacyMode: true
})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

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

app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: toString(SESSION_SECRET),
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 300000
  }
}))
app.use(express.json())

app.get("/", (req, res) => {
  res.send("<h2> Hi there!!!</h2>");
});

//localhost:3000/posts
app.use("/posts", postRouter)
app.use("/users", userRouter)
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
