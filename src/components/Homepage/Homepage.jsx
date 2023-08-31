import { useEffect, useState } from "react";
import Hero from "./Hero/Hero";
import ShortLists from "./ShortLists/ShortLists";
import apiURL from "../../../config";
import Loading from "../Other/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Homepage = () => {
  const [categories, setCategories] = useState(null);
  const [articles, setArticles] = useState(null);
  const [latestArticles, setLatestArticles] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLatestData = async () => {
    try {
      const response = await fetch(apiURL + "/article");
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        const uniqueCategories = new Set();

        for (const article of data.latestArticlesByCategory) {
          const { cat_id, cat_name } = article;
          uniqueCategories.add(cat_id + "!#splitArray" + cat_name);
        }
        const uniqueCategoriesArray = [];
        uniqueCategories.forEach((key) => {
          const [cat_id, cat_name] = key.split("!#splitArray");
          uniqueCategoriesArray.push({ cat_id, cat_name });
        });
        setCategories(uniqueCategoriesArray);
        setArticles(data.latestArticlesByCategory);
        setLatestArticles(data.latestArticlesOverall);
      } else toast(data.message);
    } catch (error) {
      toast("Couldn't get categories");
    }
  };
  useEffect(() => {
    getLatestData();
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <>
      <Hero articles={latestArticles} />
      {categories &&
        categories.length > 0 &&
        categories.map((v) => (
          <ShortLists
            key={v.cat_id}
            v={v}
            articles={articles.filter((a) => a.cat_id == v.cat_id)}
          />
        ))}
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </>
  );
};

export default Homepage;
