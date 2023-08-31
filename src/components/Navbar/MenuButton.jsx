import { useSpring, animated } from "react-spring";
import styles from "./Navbar.module.css";

const MenuButton = ({
  isMenuOpen,
  setIsMenuOpen,
  selectedCategory,
  setSelectedCategory,
}) => {
  const pathProps = useSpring({
    d: isMenuOpen
      ? "M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7"
      : "M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7",
    config: { duration: 300 },
  });

  return (
    <div
      style={{ padding: "0px 10px" }}
      onClick={() => {
        selectedCategory
          ? setSelectedCategory(null)
          : setIsMenuOpen(!isMenuOpen);
      }}
    >
      <animated.svg
        className={styles.hb}
        viewBox="0 0 10 10"
        stroke="#eee"
        strokeWidth=".6"
      >
        <animated.path d={pathProps.d} />
      </animated.svg>
    </div>
  );
};

export default MenuButton;
