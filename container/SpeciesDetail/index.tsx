import React from "react";
import speciesData from "@/public/handledSpecies.json";
import { Button, Collapse, Divider, List, NavBar, Space } from "antd-mobile";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import BaseStats from "./component/BaseStats";

export default function SpeciesDetail({ speciesId }: { speciesId: string }) {
  const species = speciesData.find((item) => item.id === speciesId);
  const router = useRouter();

  if (!species) {
    return <div>Species not found</div>;
  }

  return (
    <div className={styles.container}>
      <NavBar className={styles["nav-bar"]} onBack={() => router.back()}>
        宝可梦详情
      </NavBar>

      <List mode="card">
        <List.Item extra={species.name}>名称</List.Item>
        <List.Item extra={species.gen}>世代</List.Item>
        <List.Item
          onClick={() => {
            router.push(`/speciesLearnset?speciesId=${species.id}`);
          }}
        >
          查看可习得招式
        </List.Item>
      </List>

      <List mode="card" header="特性">
        {species.abilities.map((ability) => (
          <List.Item
            key={ability}
            onClick={() => {
              router.push(`/abilityDetail?abilityId=${ability}`);
            }}
          >
            {ability}
          </List.Item>
        ))}
      </List>

      <BaseStats baseStats={species.baseStats} bst={species.bst} />
    </div>
  );
}
