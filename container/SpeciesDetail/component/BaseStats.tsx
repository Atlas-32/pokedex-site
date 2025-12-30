import React from "react";
import styles from "../index.module.scss";
import { ProgressBar } from "antd-mobile";

const MAX_BASE_STAT = 255;
const MAX_BST = 780;

const getPercent = (num: number, max: number) =>
  (Math.min(num, max) / max) * 100;

const BaseStats = ({
  baseStats,
  bst,
}: {
  baseStats: Record<string, number>;
  bst: number;
}) => {
  return (
    <div className={styles["description-container"]}>
      <div className={styles["base-stat-item"]}>
        <div className={styles["base-stat-label"]}>HP</div>
        <ProgressBar
          className={styles["base-stat-progress"]}
          percent={getPercent(baseStats.hp, MAX_BASE_STAT)}
          text={baseStats.hp}
        />
      </div>
      <div className={styles["base-stat-item"]}>
        <div className={styles["base-stat-label"]}>ATK</div>
        <ProgressBar
          className={styles["base-stat-progress"]}
          percent={getPercent(baseStats.atk, MAX_BASE_STAT)}
          text={baseStats.atk}
        />
      </div>
      <div className={styles["base-stat-item"]}>
        <div className={styles["base-stat-label"]}>DEF</div>
        <ProgressBar
          className={styles["base-stat-progress"]}
          percent={getPercent(baseStats.def, MAX_BASE_STAT)}
          text={baseStats.def}
        />
      </div>
      <div className={styles["base-stat-item"]}>
        <div className={styles["base-stat-label"]}>SPA</div>
        <ProgressBar
          className={styles["base-stat-progress"]}
          percent={getPercent(baseStats.spa, MAX_BASE_STAT)}
          text={baseStats.spa}
        />
      </div>
      <div className={styles["base-stat-item"]}>
        <div className={styles["base-stat-label"]}>SPD</div>
        <ProgressBar
          className={styles["base-stat-progress"]}
          percent={getPercent(baseStats.spd, MAX_BASE_STAT)}
          text={baseStats.spd}
        />
      </div>
      <div className={styles["base-stat-item"]}>
        <div className={styles["base-stat-label"]}>SPE</div>
        <ProgressBar
          className={styles["base-stat-progress"]}
          percent={getPercent(baseStats.spe, MAX_BASE_STAT)}
          text={baseStats.spe}
        />
      </div>
      <div className={styles["base-stat-item"]}>
        <div className={styles["base-stat-label"]}>BST</div>
        <ProgressBar
          className={styles["base-stat-progress"]}
          percent={getPercent(bst, MAX_BST)}
          text={bst}
        />
      </div>
    </div>
  );
};

export default BaseStats;
