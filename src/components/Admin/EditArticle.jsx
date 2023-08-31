import React, { useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styles from "./Admin.module.css";
import apiURL from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import Switch from "react-switch";
import Loading from "../Other/Loading";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const EditArticle = ({ subcategories }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const tagsRef = useRef(null);
  const subcatRef = useRef(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [md, setMd] = useState(state.article.art_md);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };
  const editArticle = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("art_title", titleRef.current.value);
    formData.append("art_md", md);
    formData.append("art_sc", subcatRef.current.value);
    formData.append("tags", tagsRef.current.value);
    formData.append("art_img", selectedImage);
    formData.append("delete_image", String(removePhoto));
    try {
      const response = await fetch(
        apiURL + "/article/" + state.article.art_id,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setLoading(false);
      setSelectedImage(null);
      if (data.status == 0) {
        toast("Succesfully edited article");
        navigate("/article/" + state.article.art_id);
      } else {
        toast("Couldn't edit article");
      }
    } catch (error) {
      toast("Couldn't edit article");
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div
      className={styles.adminMainDiv}
      style={{ justifyContent: "flex-start" }}
    >
      <input
        type="text"
        placeholder="Title"
        ref={titleRef}
        defaultValue={state.article.art_title}
      />
      <span style={{ marginTop: 10 }}>
        {removePhoto ? "Remove" : "Keep / change"} photo
      </span>
      <Switch onChange={setRemovePhoto} checked={removePhoto} />
      {!removePhoto && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ margin: "10px 0" }}
        />
      )}
      <MDEditor
        style={{ width: "95%", background: "#161616" }}
        value={md}
        onChange={setMd}
      />
      {subcategories && subcategories.length > 0 && (
        <select defaultValue={state.article.sc_id} ref={subcatRef}>
          {subcategories
            .sort((a, b) => a.sc_name.localeCompare(b.sc_name))
            .map((v) => (
              <option key={v.sc_id} value={v.sc_id}>
                {v.sc_name}
              </option>
            ))}
        </select>
      )}
      <input
        defaultValue={state.tags}
        type="text"
        placeholder="Tags"
        style={{ margin: "10px 0" }}
        ref={tagsRef}
      />
      <button onClick={editArticle}>Edit article</button>
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </div>
  );
};

export default EditArticle;
