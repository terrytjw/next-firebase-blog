import React from "react";

type UsernameMessageProps = {
  username: string;
  isValid: boolean;
  loading: boolean;
};
const UsernameMessage = ({
  username,
  isValid,
  loading,
}: UsernameMessageProps) => {
  if (loading) {
    return <p className="ml-1 h-14 py-2 text-sm text-warning">Checking...</p>;
  } else if (isValid) {
    return (
      <p className="ml-1 h-14 py-2 text-sm text-success">
        <span className="underline">@{username}</span> is available!
      </p>
    );
  } else if (username && !isValid) {
    return (
      <p className="ml-1 h-14 py-2 text-sm text-error">
        That username is taken!
      </p>
    );
  } else {
    return <p className="h-14 py-2"></p>;
  }
};

export default UsernameMessage;
