import React, { useRef, useState } from "react";
import styles from "./Admin.module.css";
import apiURL from "../../../config";
import { Link } from "react-router-dom";
import Loading from "../Other/Loading";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const Admin = ({ categories, getCategories, getSubcategories }) => {
  const catNameRef = useRef(null);
  const scNameRef = useRef(null);
  const catRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const addCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/category/cat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cat_name: catNameRef.current.value,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        getCategories();
      }
      toast(data.message);
    } catch (error) {
      toast("Error while adding category");
    }
  };
  const addSubcategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/category/sc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sc_name: scNameRef.current.value,
          cat_id: catRef.current.value,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        getSubcategories();
      }
      toast(data.message);
    } catch (error) {
      toast("Error while adding subcategory");
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className={styles.adminMainDiv}>
      <div>
        <input
          style={{ margin: "5px 0" }}
          type="text"
          ref={catNameRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addCategory();
            }
          }}
          placeholder="New category name"
        />
        <button onClick={addCategory}>Add</button>
      </div>
      {categories && categories.length > 0 && (
        <div>
          <input
            ref={scNameRef}
            type="text"
            placeholder="New subcategory name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addSubcategory();
              }
            }}
          />
          <select
            defaultValue={categories[0].cat_id}
            ref={catRef}
            style={{ margin: "5px 0" }}
          >
            {categories.map((v) => (
              <option key={v.cat_id} value={v.cat_id}>
                {v.cat_name}
              </option>
            ))}
          </select>

          <button onClick={addSubcategory}>Add</button>
        </div>
      )}
      <Link to="/editor" style={{ textAlign: "center", width: "auto" }}>
        Editor
      </Link>
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </div>
  );
};

export default Admin;
