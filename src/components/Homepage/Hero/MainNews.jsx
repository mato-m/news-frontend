import { useSpring, animated } from "react-spring";
import styles from "./Hero.module.css";
import apiURL from "../../../../config";
import { Link } from "react-router-dom";

const MainNews = ({ v }) => {
  const springProps = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 800 },
  });

  return (
    <Link
      to={"/article/" + v.art_id}
      style={{
        position: "relative",
        width: "100%",
        padding: 0,
        display: "block",
        height: "100%",
      }}
    >
      {v.art_img && <img src={apiURL + "/uploads/" + v.art_img} />}
      <div
        className={styles.titleDiv}
        style={{
          position: v.art_img ? "absolute" : "relative",
        }}
      >
        <animated.span style={springProps}>{v.art_title}</animated.span>
      </div>
    </Link>
  );
};

export default MainNews;
