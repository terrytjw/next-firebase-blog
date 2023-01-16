import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Post } from "../types";

type PostContentProps = {
  post: Post;
};
// UI component for main post content
const PostContent = ({ post }: PostContentProps) => {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : // @ts-ignore
        post.createdAt.toDate();

  return (
    <div className="">
      <h1 className="py-2 text-3xl font-bold">{post?.title}</h1>
      <div className="mb-10 opacity-70">
        Written by <Link href={`/${post.username}/`}>@{post.username}</Link> on{" "}
        {createdAt.toDateString()}
      </div>
      <div className="py-2">
        <ReactMarkdown className="prose prose-slate">
          {post?.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PostContent;
