import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiURL from "../../../config";
import styles from "./Article.module.css";
import ReactMarkdown from "react-markdown";
import Loading from "../Other/Loading";
import rehypeRaw from "rehype-raw";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const Article = ({ userData }) => {
  const { art_id } = useParams();
  const commentRef = useRef(null);
  const navigate = useNavigate();

  const deleteArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/article/" + art_id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);

      if (data.status == 0) {
        navigate("/");
      }
      toast(data.message);
    } catch (error) {
      toast("Error while removing article");
    }
  };
  const deleteComment = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/comment/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);

      if (data.status == 0) {
        getArticle();
      }
      toast(data.message);
    } catch (error) {
      toast("Error while removing comment");
    }
  };
  const addComment = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          art_id,
          comment: commentRef.current.value,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        getArticle();
      }
      toast(data.message);
    } catch (error) {
      toast("Error while adding comment");
    }
  };
  function formatDateTime(inputDateString) {
    const inputDate = new Date(inputDateString);
    const day = inputDate.getUTCDate().toString().padStart(2, "0");
    const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = inputDate.getUTCFullYear().toString();
    const hours = inputDate.getUTCHours().toString().padStart(2, "0");
    const minutes = inputDate.getUTCMinutes().toString().padStart(2, "0");

    const formattedDateString = `${day}-${month}-${year} ${hours}:${minutes}`;
    return formattedDateString;
  }
  const [article, setArticle] = useState(null);
  const [tags, setTags] = useState(null);
  const [comments, setComments] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const getArticle = async () => {
    try {
      const response = await fetch(apiURL + "/article/art/" + art_id);
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setArticle(data.articleDetails);
        setTags(data.tags);
        setComments(data.comments);
      } else setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't get article");
    }
  };
  useEffect(() => {
    getArticle();
  }, [art_id]);
  return loading ? (
    <Loading />
  ) : (
    <div className={styles.mainArticleDiv}>
      {article ? (
        <div className={styles.articleWrapper}>
          {userData && userData.role == 1 && (
            <div>
              <button
                style={{
                  margin: "5px",
                  background: "#f8f8ff",
                  padding: 7,
                  border: "solid transparent 1px",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "#161616",
                }}
                onClick={deleteArticle}
              >
                Delete article
              </button>
              <button
                style={{
                  margin: "5px",
                  background: "#f8f8ff",
                  padding: 7,
                  border: "solid transparent 1px",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "#161616",
                }}
                onClick={() => {
                  navigate("/edit/", { state: { article, tags } });
                }}
              >
                Edit article
              </button>
            </div>
          )}
          <span style={{ margin: "10px 0" }}>
            <Link
              style={{ fontSize: "1rem", padding: 0 }}
              to={"/sc/" + article.sc_id}
            >
              {article.subcategory}
            </Link>{" "}
            |{" "}
            <Link
              style={{ fontSize: "1rem", padding: 0 }}
              to={"/cat/" + article.cat_id}
            >
              {article.category}
            </Link>
          </span>
          <span>{"Written by: " + article.author_username}</span>
          <div className={styles.heroWrapper}>
            {article.art_img && (
              <img src={apiURL + "/uploads/" + article.art_img} />
            )}
            <div
              className={styles.titleWrapper}
              style={{
                height: !article.art_img && "300px",
                position: !article.art_img && "relative",
              }}
            >
              <span>{article.art_title}</span>
            </div>
          </div>
          <div className={styles.mdWrapper}>
            <ReactMarkdown
              children={article.art_md}
              rehypePlugins={[rehypeRaw]}
            />
          </div>
          {tags && tags.length > 0 && (
            <div style={{ width: "100%" }}>
              <span
                style={{ textAlign: "center", width: "100%", display: "block" }}
              >
                Tags
              </span>
              <div className={styles.tagsWrapper}>
                {tags.map((v) => (
                  <Link key={v} to={"/tag/" + v}>
                    {v}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {
            <div className={styles.commentsWrapper}>
              <span>Comments</span>
              {userData ? (
                <div className={styles.addCommentDiv}>
                  <textarea
                    ref={commentRef}
                    placeholder="Your comment"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment();
                      }
                    }}
                  />
                  <button onClick={addComment}>Add comment</button>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={{
                    background: "#f8f8ff",
                    color: "#161616",
                    padding: "10px",
                    width: "auto",
                    fontSize: "1rem",
                    margin: "10px 0",
                    borderRadius: 10,
                  }}
                >
                  Login to comment
                </Link>
              )}
              {comments &&
                comments.length > 0 &&
                comments.map((v) => (
                  <div key={v.comment_id} className={styles.commentDiv}>
                    <span>{v.username}</span>
                    <span>{formatDateTime(v.time)}</span>
                    <span>{v.text}</span>
                    {((userData && userData.user_id == v.user_id) ||
                      (userData && userData.role == 1)) && (
                      <button
                        className={styles.deleteCommentBtn}
                        onClick={() => {
                          deleteComment(v.comment_id);
                        }}
                      >
                        Delete comment
                      </button>
                    )}
                  </div>
                ))}
            </div>
          }
        </div>
      ) : (
        <span>Article not available</span>
      )}
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </div>
  );
};

export default Article;
