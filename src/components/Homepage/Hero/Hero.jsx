import styles from "./Hero.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import MainNews from "./MainNews";

const Hero = ({ articles }) => {
  return (
    <div className={styles.heroMainDiv}>
      {articles && articles.length > 0 ? (
        <Carousel
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={50}
          interval={5000}
          transitionTime={1000}
          stopOnHover={false}
          infiniteLoop
          autoPlay
          showStatus={false}
          showThumbs={false}
        >
          {articles.map((v) => (
            <MainNews key={v.art_id} v={v} />
          ))}
        </Carousel>
      ) : (
        <span>No articles available</span>
      )}
    </div>
  );
};

export default Hero;
