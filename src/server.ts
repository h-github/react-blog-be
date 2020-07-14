import express from "express";
import { MongoClient, Db } from "mongodb";

import Comment from "./models/Comment";
import Article from "./models/Article";

const app = express();
const port = process.env.PORT || 8080;
const CONNECTION_STR = "mongodb://localhost:27017/";
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req: express.Request, res: express.Response) => {
  res.send("Hello from NodeJs server");
});

const withDb = async (operations: (db: Db) => void, res: express.Response) => {
  try {
    const client = await MongoClient.connect(CONNECTION_STR, {
      useNewUrlParser: true,
    });

    const db = client.db("my-blog");

    await operations(db);

    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to db 1", error });
  }
};

app.get(
  "/api/articles/:name",
  async (req: express.Request, res: express.Response) => {
    withDb(async db => {
      const articleName = req.params.name;
      const articleInfo = await db
        .collection<Article>("articles")
        .findOne<Article>({ name: articleName });

      res.status(200).json(articleInfo);
    }, res);
  }
);

app.post(
  "/api/articles/:name/upvote",
  async (req: express.Request, res: express.Response) => {
    withDb(async db => {
      const articleName = req.params.name;

      const articleInfo = await db
        .collection<Article>("articles")
        .findOne<Article>({ name: articleName });

      await db
        .collection<Article>("articles")
        .updateOne(
          { name: articleName },
          { $set: { upvotes: articleInfo.upvotes + 1 } }
        );

      const updatedArticleInfo = await db
        .collection<Article>("articles")
        .findOne<Article>({ name: articleName });

      res.status(200).json(updatedArticleInfo);
    }, res);
  }
);

app.post(
  "/api/articles/:name/add-comment",
  async (req: express.Request, res: express.Response) => {
    withDb(async db => {
      const articleName = req.params.name;
      const newComment = new Comment(req.body);

      const articleInfo = await db
        .collection<Article>("articles")
        .findOne<Article>({ name: articleName });

      await db
        .collection<Article>("articles")
        .updateOne(
          { name: articleName },
          { $set: { comments: [...articleInfo.comments, newComment] } }
        );

      const updatedArticleInfo = await db
        .collection<Article>("articles")
        .findOne<Article>({ name: articleName });

      res.status(200).json(updatedArticleInfo);
    }, res);
  }
);

app.listen(port, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is listening to: http://localhost:${port}`)
);
