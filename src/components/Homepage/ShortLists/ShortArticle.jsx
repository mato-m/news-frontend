import { useSpring, animated } from "react-spring";
import styles from "./ShortLists.module.css";
import { Link } from "react-router-dom";
import apiURL from "../../../../config";

const ShortArticle = ({ v }) => {
  const springProps = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 800 },
  });

  return (
    <Link
      to={"/article/" + v.art_id}
      key={v.art_id}
      className={styles.shortArticle}
    >
      {v.art_img && (
        <img src={apiURL + "/uploads/" + v.art_img} alt="Article" />
      )}
      <div className={styles.titleDiv}>
        <animated.span style={springProps}>{v.art_title}</animated.span>
      </div>
    </Link>
  );
};

export default ShortArticle;
