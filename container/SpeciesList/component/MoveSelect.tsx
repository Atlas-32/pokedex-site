import React, { useMemo, useState } from "react";
import moveData from "@/public/handledMoves.json";
import { CheckList, Popup, SearchBar } from "antd-mobile";
import styles from "../index.module.scss";

const moves = moveData.map((move) => ({
  label: move.name,
  value: move.id,
}));

export default function MoveSelect({
  visible,
  setVisible,
  value,
  onChange,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [searchText, setSearchText] = useState("");

  const searchedMoves = useMemo(() => {
    if (!searchText) {
      return moves;
    }

    const lowerSearchText = searchText.toLowerCase();

    const matched = [];
    const selectedButNotMatched = [];
    const rest = [];

    for (const move of moves) {
      const isSelected = value.includes(move.value);
      const isMatched = move.label.toLowerCase().includes(lowerSearchText);

      if (isMatched) {
        matched.push(move);
      } else if (isSelected) {
        selectedButNotMatched.push(move);
      } else {
        rest.push(move);
      }
    }

    return [...matched, ...selectedButNotMatched, ...rest];
  }, [value, searchText]);

  return (
    <>
      {value.join(",")}
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
      >
        <div className={styles["searchbar-container"]}>
          <SearchBar
            placeholder="输入文字过滤选项"
            value={searchText}
            onChange={(v) => {
              setSearchText(v);
            }}
          />
        </div>
        <div className={styles["checklist-container"]}>
          <CheckList
            multiple
            className={styles["checklist"]}
            value={value}
            onChange={(val) => {
              onChange(val as string[]);
            }}
          >
            {searchedMoves.map((item) => (
              <CheckList.Item
                key={item.value}
                value={item.value}
                disabled={
                  searchText
                    ? !item.label
                        .toLocaleLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                    : false
                }
              >
                {item.label}
              </CheckList.Item>
            ))}
          </CheckList>
        </div>
      </Popup>
    </>
  );
}
