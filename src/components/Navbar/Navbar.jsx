import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import MenuButton from "./MenuButton";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock-upgrade";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import apiURL from "../../../config";
import TrashButton from "./TrashButton";
import Loading from "../Other/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Navbar = ({
  categories,
  userData,
  setUserData,
  subcategories,
  getCategories,
  getSubcategories,
}) => {
  const categoryRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(null);
  const linkProps = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? "translateY(0)" : "translateY(-100%)",
    config: { duration: 500 },
  });

  const link2Props = useSpring({
    opacity: selectedCategory ? 1 : 0,
    transform: selectedCategory ? "translateY(0)" : "translateY(-100%)",
    config: { duration: 500 },
  });

  const removeCategory = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/category/cat/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        getCategories();
      }
      toast(data.message);
    } catch (error) {
      toast("Error while removing category");
    }
  };

  const removeSubcategory = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/category/sc/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        getSubcategories();
      }
      toast(data.message);
    } catch (error) {
      toast("Error while removing subcategory");
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY >= 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    isMenuOpen
      ? disableBodyScroll(categoryRef.current)
      : enableBodyScroll(categoryRef.current);
  }, [isMenuOpen]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <div
        className={`${styles.mainNav} ${
          scrolled || isMenuOpen ? styles.mainNavScrolled : ""
        }`}
      >
        <Link
          to="/"
          onClick={() => {
            setSelectedCategory(null);
            setIsMenuOpen(!setIsMenuOpen);
            enableBodyScroll(categoryRef.current);
          }}
        >
          Newz
        </Link>
        <MenuButton
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
      <div
        ref={categoryRef}
        className={`${styles.categoriesNavHidden} ${
          isMenuOpen && styles.categoriesNavVisible
        }`}
      >
        {categories &&
          categories.length > 0 &&
          categories.map((v) => (
            <Link
              key={v.cat_id}
              to={"/cat/" + v.cat_id}
              onClick={() => {
                setIsMenuOpen(!setIsMenuOpen);
                enableBodyScroll(categoryRef.current);
              }}
            >
              <animated.div style={linkProps}>
                <span>{v.cat_name}</span>
                {subcategories &&
                  subcategories.filter((s) => s.cat_id == v.cat_id).length >
                    0 && (
                    <svg
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCategory(v.cat_id);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  )}
                {userData && userData.role == 1 && (
                  <TrashButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeCategory(v.cat_id);
                    }}
                  />
                )}
              </animated.div>
            </Link>
          ))}
        {userData && userData.role == 1 && (
          <Link
            onClick={() => {
              setIsMenuOpen(!setIsMenuOpen);
              enableBodyScroll(categoryRef.current);
            }}
            to="/admin"
          >
            Admin
          </Link>
        )}
        {userData ? (
          <>
            <Link
              to="/account"
              onClick={() => {
                setIsMenuOpen(false);
                enableBodyScroll(categoryRef.current);
              }}
            >
              Account
            </Link>
            <Link
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                setUserData(null);
                localStorage.clear();
                enableBodyScroll(categoryRef.current);
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              enableBodyScroll(categoryRef.current);
            }}
          >
            Login
          </Link>
        )}
      </div>
      {selectedCategory &&
        subcategories &&
        subcategories.filter((s) => s.cat_id == selectedCategory).length >
          0 && (
          <div
            className={`${styles.categoriesNavHidden} ${
              selectedCategory && styles.categoriesNavVisible
            }`}
          >
            {subcategories
              .filter((s) => s.cat_id == selectedCategory)
              .map((sc) => (
                <Link
                  key={sc.sc_id}
                  to={"/sc/" + sc.sc_id}
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsMenuOpen(!setIsMenuOpen);
                    enableBodyScroll(categoryRef.current);
                  }}
                >
                  <animated.div style={link2Props}>
                    {sc.sc_name}
                    {userData && userData.role == 1 && (
                      <TrashButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeSubcategory(sc.sc_id);
                        }}
                      />
                    )}
                  </animated.div>
                </Link>
              ))}
          </div>
        )}
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </>
  );
};

export default Navbar;
