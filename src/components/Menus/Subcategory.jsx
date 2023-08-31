import React, { useEffect, useState } from "react";
import styles from "./Category.module.css";
import apiURL from "../../../config";
import { useParams } from "react-router-dom";
import ShortArticle from "../Homepage/ShortLists/ShortArticle";
import Loading from "../Other/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Subcategory = () => {
  const { sc_id } = useParams();
  const [articles, setArticles] = useState(null);
  const [SCName, setSCName] = useState(null);
  const [loading, setLoading] = useState(true);
  const getArticles = async () => {
    try {
      const response = await fetch(apiURL + "/article/sc/" + sc_id);
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setArticles(data.articles);
        setSCName(data.subcategoryName);
      } else toast(data.message);
    } catch (error) {
      toast("Couldn't get articles");
    }
  };
  useEffect(() => {
    getArticles();
  }, [sc_id]);
  return loading ? (
    <Loading />
  ) : (
    <div className={styles.catMain}>
      {SCName && <span>{SCName}</span>}
      {articles && articles.length > 0 ? (
        <div className={styles.articleDiv}>
          {articles.map((v) => (
            <ShortArticle v={v} key={v.art_id} />
          ))}
        </div>
      ) : (
        <span>No articles available</span>
      )}
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </div>
  );
};

export default Subcategory;
