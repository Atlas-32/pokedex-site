import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import learnsetData from "@/public/handledLearnset.json";
import moveData from "@/public/handledMoves.json";
import { List, NavBar, Picker } from "antd-mobile";
import { MoveCategoryColorTag, TypeColorTag } from "@/component/ColorTag";
import { OrderedListOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { LearnsetDataType } from "@/type/publicData";

const sortPickerColumns = [
  [
    { label: "编号", value: "num" },
    { label: "名称", value: "name" },
    { label: "威力", value: "basePower" },
    { label: "命中", value: "accuracy" },
    { label: "PP", value: "pp" },
  ],
  [
    { label: "升序", value: "asc" },
    { label: "降序", value: "desc" },
  ],
];

const initLearnset = (speciesId: string) => {
  let learnset: string[] = (learnsetData as LearnsetDataType)[speciesId] || [];
  let moveLearnset: any[] = [];

  learnset.forEach((moveid) => {
    const m = moveData.find((move) => move.id === moveid);
    if (!m) {
      console.warn(`Move ID ${moveid} not found for species ${speciesId}`);
    } else {
      moveLearnset.push(m);
    }
  });
  return moveLearnset;
};

export default function SpeciesLearnset({ speciesId }: { speciesId: string }) {
  const router = useRouter();
  const [isSortPickerOpen, setSortPickerOpen] = useState(false);
  const [sortParam, setSortParam] = useState({ key: "name", order: "asc" });

  const learnset = useMemo(() => initLearnset(speciesId), [speciesId]);

  const displayMoves = useMemo(() => {
    return learnset.sort((a, b) => {
      const valA = a[sortParam.key];
      const valB = b[sortParam.key];

      if (valA === valB) return 0;

      const comparison = valA > valB ? 1 : -1;
      return sortParam.order === "asc" ? comparison : -comparison;
    });
  }, [speciesId, sortParam]);

  return (
    <div className={styles.container}>
      <NavBar
        className={styles["nav-bar"]}
        onBack={() => router.back()}
        right={
          <div onClick={() => setSortPickerOpen(true)}>
            <OrderedListOutlined />
          </div>
        }
      >
        可习得招式
      </NavBar>
      <List className={styles["list-container"]}>
        {displayMoves.map((item) => {
          return (
            <List.Item
              key={item.id}
              description={item.shortDesc}
              clickable
              onClick={() => router.push(`/moveDetail?moveId=${item.id}`)}
              extra={`${item.basePower}/${
                item.accuracy === true ? "-" : item.accuracy
              }/${item.pp}`}
            >
              {item.name}
              <TypeColorTag type={item.type} />
              <MoveCategoryColorTag category={item.category} />
            </List.Item>
          );
        })}
      </List>

      <Picker
        visible={isSortPickerOpen}
        columns={sortPickerColumns}
        onClose={() => setSortPickerOpen(false)}
        onConfirm={(value) => {
          const [key, order] = value as [string, "asc" | "desc"];
          setSortParam({ key, order });
        }}
      />
    </div>
  );
}
