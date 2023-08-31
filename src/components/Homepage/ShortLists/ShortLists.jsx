import { Link } from "react-router-dom";
import ShortArticle from "./ShortArticle";
import styles from "./ShortLists.module.css";
const ShortLists = ({ v, articles }) => {
  return (
    <div className={styles.shortWrapper}>
      <span>{v.cat_name}</span> <Link to={"/cat/" + v.cat_id}>See more</Link>
      {articles && articles.length > 0 && (
        <div className={styles.listWrapper}>
          {articles.map((v) => (
            <ShortArticle key={v.art_id} v={v} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShortLists;
