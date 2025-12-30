import React from "react";
import { TabBar, NavBar } from "antd-mobile";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

const TabBarWrapper = ({
  defaultActiveKey,
  title,
  children,
  right,
}: {
  defaultActiveKey: string;
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <div className={styles.app}>
      <div className={styles.top}>
        <NavBar onBack={() => router.back()} right={right}>
          {title}
        </NavBar>
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.bottom}>
        <TabBar
          defaultActiveKey={defaultActiveKey}
          onChange={(value) => router.push(`/${value}`)}
        >
          <TabBar.Item key="speciesList" title="species" />
          <TabBar.Item key="moveList" title="move" />
          <TabBar.Item key="abilityList" title="ability" />
        </TabBar>
      </div>
    </div>
  );
};

export default TabBarWrapper;
