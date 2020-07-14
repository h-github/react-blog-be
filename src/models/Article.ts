import Comment from "./Comment";

class Article {
  name: string;
  upvotes: number;
  comments: Comment[];

  constructor({
    name,
    upvotes,
    comments,
  }: {
    name: string;
    upvotes: number;
    comments: Comment[];
  }) {
    this.name = name;
    this.upvotes = upvotes;
    this.comments = comments;
  }
}

export default Article;
