import React from "react";
import abilityData from "@/public/handledAbilities.json";
import { Button, Divider, List, NavBar, Space } from "antd-mobile";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

export default function AbilityDetail({ abilityId }: { abilityId: string }) {
  const ability = abilityData.find((item) => item.id === abilityId);
  const router = useRouter();

  if (!ability) {
    return <div>Ability not found</div>;
  }

  return (
    <div className={styles.container}>
      <NavBar className={styles["nav-bar"]} onBack={() => router.back()}>
        特性详情
      </NavBar>

      <List mode="card">
        <List.Item extra={ability.name}>名称</List.Item>
        <List.Item extra={ability.gen}>世代</List.Item>
        <List.Item
          onClick={() => {
            router.push(`/speciesList?abilityId=${abilityId}`);
          }}
        >
          拥有该特性的宝可梦
        </List.Item>
      </List>

      <div className={styles["description-container"]}>
        {ability.shortDesc}
        <Divider />
        {ability.desc}
      </div>
    </div>
  );
}
