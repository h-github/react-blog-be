import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/api", (req: express.Request, res: express.Response) => {
  res.send("Hello from NodeJs server");
});

app.listen(port, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is listening to: http://localhost:${port}`)
);
