import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { authenticateAdmin } from "./middleware/auth.js";
import dbConnect from "./config/db.js";
import productRouter from "./routes/productRoute.js";
import storeRouter from "./routes/storeRoute.js";
import homeRouter from "./routes/homeRoute.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";

// load environment variables as early as possible
dotenv.config();

const app = express();

// trust reverse proxies when running behind a load balancer (e.g. Heroku)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// middleware
// request logging (skip during tests)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("tiny"));
}

app.use(helmet());
app.use(cors());
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_in_prod",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // send only over HTTPS in prod
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/auth", authRouter);
app.use("/store", storeRouter);
app.use("/", authenticateAdmin, homeRouter);
app.use("/products", authenticateAdmin, productRouter);
app.use("/users", authenticateAdmin, userRouter);

// basic 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});

// error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).render("error", { error: err });
});

const startServer = async () => {
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    console.warn("⚠️  SESSION_SECRET is not set. Sessions will be insecure.");
  }

  try {
    await dbConnect();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    // if database connection fails we should exit
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
