export type Post = {
  title: string;
  content: string;
  imageURL: string;
  heartCount: number;
  photoURL: string;
  username: string;
  createdAt: number;
  slug: string;
  uid: string;
  displayName: string;
  published: boolean;
};

export type User = {
  photoURL: string;
  username: string;
  displayName: string;
};
