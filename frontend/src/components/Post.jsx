import { useState } from "react";

function Post({ post, onPostUpdated }) {
  const token = localStorage.getItem("token");

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.like_count || 0
  );

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const [showComments, setShowComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  const handleLike = async () => {
    if (loadingLike) return;

    setLoadingLike(true);

    try {
      if (!liked) {
        const response = await fetch(
          "http://127.0.0.1:8000/api/likes/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              post: post.id,
            }),
          }
        );

        if (response.ok) {
          setLiked(true);
          setLikeCount((count) => count + 1);
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:8000/api/likes/",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              post: post.id,
            }),
          }
        );

        if (response.ok) {
          setLiked(false);
          setLikeCount((count) =>
            Math.max(0, count - 1)
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLike(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/comments/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        const postComments = data.filter(
          (item) => item.post === post.id
        );

        setComments(postComments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      await fetchComments();
    }

    setShowComments((value) => !value);
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    setLoadingComment(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/comments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            post: post.id,
            content: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setComment("");

        setComments((oldComments) => [
          data,
          ...oldComments,
        ]);

        setShowComments(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <div className="post-card">

      <div className="post-header">

        <div className="post-avatar">
          {post.author_username
            ? post.author_username
                .charAt(0)
                .toUpperCase()
            : "U"}
        </div>

        <div>
          <strong>
            @{post.author_username}
          </strong>

          <small>
            {new Date(post.created_at).toLocaleString()}
          </small>
        </div>

      </div>

      <div className="post-content">
        {post.content}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="post-image"
        />
      )}

      <div className="post-actions">

        <button
          onClick={handleLike}
          disabled={loadingLike}
          className={liked ? "liked-button" : ""}
        >
          {liked ? "❤️" : "♡"} {likeCount}
        </button>

        <button onClick={toggleComments}>
          💬 Comments
        </button>

      </div>

      {showComments && (
        <div className="comments-section">

          <form
            onSubmit={handleComment}
            className="comment-form"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
            />

            <button
              type="submit"
              disabled={loadingComment}
            >
              {loadingComment ? "..." : "Send"}
            </button>
          </form>

          <div className="comments-list">

            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((item) => (
                <div
                  key={item.id}
                  className="comment"
                >
                  <strong>
                    @{item.author_username}
                  </strong>

                  <p>{item.content}</p>
                </div>
              ))
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Post;