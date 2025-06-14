// src/components/AdditionalInfoPart2/AdditionalInfoPart2.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios"; // ✅ axios 인스턴스 사용 (added)
import styles from "./AdditionalInfoPart2.module.css";

// ✅ 모든 카테고리 아이콘 import (added)
import IconKorean from "../../assets/svgs/icon-korean.svg";
import IconChinese from "../../assets/svgs/icon-chinese.svg";
import IconJapanese from "../../assets/svgs/icon-japanese.svg";
import IconHonbap from "../../assets/svgs/icon-honbap.svg";
import IconHamburger from "../../assets/svgs/icon-hamburger.svg";
import IconWestern from "../../assets/svgs/icon-western.svg";
import IconChicken from "../../assets/svgs/icon-chicken.svg";
import IconDessert from "../../assets/svgs/icon-dessert.svg";
import IconFruit from "../../assets/svgs/icon-fruit.svg";
import IconSalad from "../../assets/svgs/icon-salad.svg";
import IconHealthy from "../../assets/svgs/icon-healthy.svg";
import IconNoodle from "../../assets/svgs/icon-noodle.svg";

import { ReactComponent as JustFridgeLogo } from "../../assets/svgs/JustFridgeLogo.svg";
import { ReactComponent as ProgressBar } from "../../assets/svgs/progress-bar-step2.svg";

// ✅ 카테고리 데이터 (백엔드 DTO와 매핑된 데이터) (added)
const displayCategories = [
  { value: "KOREAN", Icon: IconKorean },
  { value: "CHINESE", Icon: IconChinese },
  { value: "JAPANESE", Icon: IconJapanese },
  { value: "QUICK", Icon: IconHonbap }, // '혼밥' -> QUICK (간편요리)
  { value: "SNACK", Icon: IconHamburger }, // '햄버거' -> SNACK (간식)
  { value: "WESTERN", Icon: IconWestern },
  { value: "PARTY", Icon: IconChicken }, // '치킨' -> PARTY (파티요리)
  { value: "DESSERT", Icon: IconDessert }, // '후식' -> DESSERT (디저트)
  { value: "OTHER", Icon: IconFruit }, // '과일' -> OTHER (기타)
  { value: "VEGAN", Icon: IconSalad }, // '채식' -> VEGAN (비건)
  { value: "DIET", Icon: IconHealthy }, // '건강식' -> DIET (다이어트)
  { value: "NOODLE", Icon: IconNoodle },
];
const AdditionalInfoPart2 = () => {
  // state와 함수 로직은 그대로 유지됩니다.
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = (categoryValue) => {
    setError("");
    setSelectedCategories((prev) => {
      if (prev.includes(categoryValue)) {
        return prev.filter((c) => c !== categoryValue);
      }
      if (prev.length < 3) {
        return [...prev, categoryValue];
      }
      setError("관심 카테고리는 최대 3개까지 선택할 수 있습니다.");
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      setError("관심 카테고리를 1개 이상 선택해주세요.");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/additional-info-part2", {
        interestCategories: selectedCategories,
      });
      if (response.data.isSuccess) {
        alert("회원가입이 완료되었습니다!");
        navigate("/");
      } else {
        setError(response.data.message || "정보 저장에 실패했습니다.");
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
      <header
        className={styles.header}
        style={{ margin: "0 auto", padding: "36px 16px" }}
      >
        <JustFridgeLogo />
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>관심 카테고리 선택</h1>
        <p className={styles.subtitle}>
          선호하는 음식 카테고리를 선택해주세요. (최대 3개)
        </p>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.categoryGrid}>
          {displayCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.value);
            // ✅ Icon 변수에는 이제 이미지 경로 문자열이 담깁니다.
            const { Icon } = category;
            return (
              <button
                key={category.value}
                className={`${styles.categoryButton} ${isSelected ? styles.selected : ""}`}
                onClick={() => handleCategoryClick(category.value)}
                type="button"
              >
                {/* ✅ <Icon /> 컴포넌트 대신 <img /> 태그를 사용합니다. */}
                <img
                  src={Icon}
                  alt={category.value}
                  className={styles.categoryIcon}
                />
              </button>
            );
          })}
        </div>

        <div className={styles.selectionInfo}>
          <span>{selectedCategories.length}/3 선택됨</span>
        </div>

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={selectedCategories.length === 0}
          type="button"
        >
          완료
        </button>
      </main>
      <footer className={styles.footer}>
        <ProgressBar />
      </footer>
    </div>
  );
};

export default AdditionalInfoPart2;
