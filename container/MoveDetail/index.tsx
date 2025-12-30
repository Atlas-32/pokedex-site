import React from "react";
import moveData from "@/public/handledMoves.json";
import { Divider, List, NavBar, Space } from "antd-mobile";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

export default function MoveDetail({ moveId }: { moveId: string }) {
  const move = moveData.find((item) => item.id === moveId);
  const router = useRouter();

  if (!move) {
    return <div>Move not found</div>;
  }

  return (
    <div className={styles.container}>
      <NavBar className={styles["nav-bar"]} onBack={() => router.back()}>
        招式详情
      </NavBar>

      <List mode="card">
        <List.Item extra={move.name}>名称</List.Item>
        <List.Item extra={move.gen}>世代</List.Item>
        <List.Item extra={move.type}>属性</List.Item>
        <List.Item extra={move.category}>类型</List.Item>
        <List.Item extra={move.basePower}>威力</List.Item>
        <List.Item extra={move.accuracy}>命中率</List.Item>
        <List.Item extra={move.pp}>PP</List.Item>
        <List.Item extra={move.target}>目标</List.Item>
        <List.Item extra={move.priority}>优先级</List.Item>
        <List.Item
          onClick={() => {
            router.push(`/speciesList?moveId=${moveId}`);
          }}
        >
          拥有该招式的宝可梦
        </List.Item>
      </List>

      <div className={styles["description-container"]}>
        {move.shortDesc}
        <Divider />
        {move.desc}
      </div>
    </div>
  );
}
