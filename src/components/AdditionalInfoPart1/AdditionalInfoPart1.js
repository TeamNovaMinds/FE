import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios"; // 새로 만든 인스턴스를 import 합니다.
import styles from "./AdditionalInfoPart1.module.css";

import { ReactComponent as DefaultAvatar } from "../../assets/svgs/default-avatar.svg";
import { ReactComponent as PencilIcon } from "../../assets/svgs/pencil-icon.svg";
import { ReactComponent as ProgressBar } from "../../assets/svgs/progress-bar-step1.svg";
import { ReactComponent as JustFridgeLogo } from "../../assets/svgs/JustFridgeLogo.svg";

const AdditionalInfoPart1 = () => {
  // state와 함수 로직은 이전과 동일하게 유지합니다.
  const [nickname, setNickname] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };
  const isNicknameValid = () => {
    const regex = /^[가-힣a-zA-Z0-9_-]{2,20}$/;
    return regex.test(nickname);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNicknameValid()) {
      setError("닉네임은 2~20자의 한글, 영문, 숫자, _, -만 사용 가능합니다.");
      return;
    }
    setError("");
    const formData = new FormData();
    const nicknameData = { nickname: nickname };
    formData.append(
      "data",
      new Blob([JSON.stringify(nicknameData)], { type: "application/json" }),
    );
    if (profileImg) {
      formData.append("profileImg", profileImg);
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8080/auth/additional-info-part1",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.isSuccess) {
        navigate("/additional-info-part2");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "오류가 발생했습니다. 다시 시도해주세요.",
      );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <JustFridgeLogo />
      </header>
      {/* [수정] main 영역으로 컨텐츠를 묶습니다. */}
      <main className={styles.main}>
        <h1 className={styles.title}>추가 정보 입력</h1>
        <p className={styles.subtitle}>
          반가워요! 사용할 닉네임과 프로필 사진을 설정해주세요.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.profilePicContainer}>
            <div className={styles.avatar}>
              {previewImg ? (
                <img
                  src={previewImg}
                  alt="Profile preview"
                  className={styles.profileImage}
                />
              ) : (
                <DefaultAvatar width={120} height={120} />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className={styles.editButton}
              style={{ diplay: "flex" }}
              onClick={handleImageUploadClick}
            >
              <PencilIcon />
            </button>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="nickname" className={styles.label}>
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className={styles.input}
              placeholder="닉네임을 입력해주세요"
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isNicknameValid()}
          >
            다음
          </button>
        </form>
      </main>

      {/* [수정] footer 영역을 만들고 진행률 표시줄을 이곳으로 이동합니다. */}
      <footer className={styles.footer}>
        <ProgressBar />
      </footer>
    </div>
  );
};

export default AdditionalInfoPart1;
