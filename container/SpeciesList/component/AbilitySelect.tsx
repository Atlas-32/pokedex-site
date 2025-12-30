import React, { useMemo, useState } from "react";
import abilityData from "@/public/handledAbilities.json";
import { CheckList, Popup, SearchBar } from "antd-mobile";
import styles from "../index.module.scss";

const abilities = abilityData.map((ability) => ({
  label: ability.name,
  value: ability.id,
}));

export default function AbilitySelect({
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

  const searchedAbilitis = useMemo(() => {
    if (!searchText) {
      return abilities;
    }

    const lowerSearchText = searchText.toLowerCase();

    const matched = [];
    const selectedButNotMatched = [];
    const rest = [];

    for (const ability of abilities) {
      const isSelected = value.includes(ability.value);
      const isMatched = ability.label.toLowerCase().includes(lowerSearchText);

      if (isMatched) {
        matched.push(ability);
      } else if (isSelected) {
        selectedButNotMatched.push(ability);
      } else {
        rest.push(ability);
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
            {searchedAbilitis.map((item) => (
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
