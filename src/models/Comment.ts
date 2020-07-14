class Comment {
  username: string;
  text: string;

  constructor({ username, text }: { username: string; text: string }) {
    this.username = username || "";
    this.text = text || "";
  }
}

export default Comment;
