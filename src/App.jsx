import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Editor from "./components/Admin/Editor";
import { useEffect, useState } from "react";
import apiURL from "../config";
import Category from "./components/Menus/Category";
import Subcategory from "./components/Menus/Subcategory";
import Login from "./components/Other/Login";
import jwtDecode from "jwt-decode";
import Register from "./components/Other/Register";
import NotFound from "./components/Other/NotFound";
import Article from "./components/Article/Article";
import Tag from "./components/Menus/Tag";
import Admin from "./components/Admin/Admin";
import Account from "./components/Admin/Account";
import EditArticle from "./components/Admin/EditArticle";
import Loading from "./components/Other/Loading";

const App = () => {
  const [categories, setCategories] = useState(null);
  const [subcategories, setSubcategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState(null);
  const getCategories = async () => {
    try {
      const response = await fetch(apiURL + "/category/cat");
      const data = await response.json();
      if (data.status == 0) {
        setCategories(data.categories);
        getSubcategories();
      } else setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't get categories");
    }
  };

  const getSubcategories = async () => {
    try {
      const response = await fetch(apiURL + "/category/sc", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setSubcategories(data.subcategories);
      } else setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't get subcategories");
    }
  };
  useEffect(() => {
    getCategories();
    localStorage.getItem("token") &&
      setUserData(jwtDecode(localStorage.getItem("token")));
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <Router>
      <Navbar
        getSubcategories={getSubcategories}
        getCategories={getCategories}
        subcategories={subcategories}
        categories={categories}
        setUserData={setUserData}
        userData={userData}
      />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/cat/:cat_id" element={<Category />} />
        <Route exact path="/sc/:sc_id" element={<Subcategory />} />
        <Route exact path="/tag/:tag" element={<Tag />} />
        <Route
          exact
          path="/article/:art_id"
          element={<Article userData={userData} />}
        />

        {userData && (
          <Route
            exact
            path="/account"
            element={<Account userData={userData} setUserData={setUserData} />}
          />
        )}
        {userData && userData.role == 1 && (
          <>
            <Route
              exact
              path="/admin"
              element={
                <Admin
                  getSubcategories={getSubcategories}
                  getCategories={getCategories}
                  categories={categories}
                />
              }
            />
            <Route
              exact
              path="/editor"
              element={<Editor subcategories={subcategories} />}
            />
            <Route
              exact
              path="/edit"
              element={<EditArticle subcategories={subcategories} />}
            />
          </>
        )}
        {!userData && (
          <>
            <Route
              exact
              path="/login"
              element={<Login setUserData={setUserData} />}
            />
            <Route
              exact
              path="/register"
              element={<Register setUserData={setUserData} />}
            />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
