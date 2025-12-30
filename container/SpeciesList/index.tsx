import speciesData from "@/public/handledSpecies.json";
import learnsetData from "@/public/handledLearnset.json";
import React, { RefObject, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  List,
  Picker,
  PickerRef,
  Popup,
  Radio,
  SearchBar,
  Selector,
  Space,
} from "antd-mobile";
import TabBarWrapper from "@/component/TabBarWrapper";
import {
  AbilityFlagOption,
  genColumn,
  SpeciesTagOption,
  TypeOption,
} from "@/util/optionData";
import { operateData } from "@/util/filterSchema";
import { OrderedListOutlined, FilterOutlined } from "@ant-design/icons";
import { TypeColorTag } from "@/component/ColorTag";
import { useRouter } from "next/router";
import AbilitySelect from "./component/AbilitySelect";
import MoveSelect from "./component/MoveSelect";
import {
  BaseStatsType,
  LearnsetDataType,
  SpeciesDataType,
} from "@/type/publicData";

interface SortState {
  key: keyof SpeciesDataType | keyof BaseStatsType;
  order: "asc" | "desc";
}

interface FilterState {
  gen?: string[];
  flags?: string[];
  [key: string]: any;
}

interface QueryState {
  name: string;
  sort: SortState;
  filter: FilterState;
}

const sortPickerColumns = [
  [
    { label: "编号", value: "num" },
    { label: "名称", value: "name" },
    { label: "总种族值", value: "bst" },
    { label: "HP", value: "hp" },
    { label: "攻击", value: "atk" },
    { label: "防御", value: "def" },
    { label: "特攻", value: "spa" },
    { label: "特防", value: "spd" },
    { label: "速度", value: "spe" },
  ],
  [
    { label: "升序", value: "asc" },
    { label: "降序", value: "desc" },
  ],
];

const baseStatKeys = ["hp", "atk", "def", "spa", "spd", "spe"];

export default function SpeciesListContainer({
  abilityId,
  moveId,
}: {
  abilityId?: string;
  moveId?: string;
}) {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<QueryState>({
    name: "",
    sort: { key: "num", order: "asc" },
    filter: {
      forme: "1",
      evos: "0",
      abilities: abilityId ? [abilityId] : [],
      moves: moveId ? [moveId] : [],
      movesMode: "1",
    },
  });

  const [isSortPickerOpen, setSortPickerOpen] = useState(false);
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);
  const [isAbilitySelectOpen, setAbilitySelectOpen] = useState(false);
  const [isMoveSelectOpen, setMoveSelectOpen] = useState(false);

  const displaySpecies = useMemo(() => {
    const { filter, name, sort } = queryParams;

    let result = operateData("species", speciesData, filter);

    if (name) {
      const lowerName = name.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(lowerName)
      );
    }

    if (filter.moves.length > 0) {
      result = result.filter((item) => {
        const speciesLearnset =
          (learnsetData as LearnsetDataType)[item.id] || [];
        switch (filter.movesMode) {
          case "0": // 包含所有招式
            return filter.moves.every((move: string) =>
              speciesLearnset.includes(move)
            );
          case "1": // 包含任一招式
            return filter.moves.some((move: string) =>
              speciesLearnset.includes(move)
            );
          default:
            return true;
        }
      });
    }

    return result.sort((a, b) => {
      let valA, valB;
      if (baseStatKeys.includes(sort.key)) {
        valA = a.baseStats[sort.key as keyof BaseStatsType];
        valB = b.baseStats[sort.key as keyof BaseStatsType];
      } else {
        valA = a[sort.key as keyof SpeciesDataType];
        valB = b[sort.key as keyof SpeciesDataType];
      }

      if (valA === valB) return 0;

      const comparison = valA! > valB! ? 1 : -1;
      return sort.order === "asc" ? comparison : -comparison;
    });
  }, [queryParams]);
  const rowCount = displaySpecies.length;

  const updateQuery = (updates: Partial<QueryState>) => {
    setQueryParams((prev) => ({ ...prev, ...updates }));
  };

  const tabBarRightNode = (
    <Space style={{ fontSize: 18 }}>
      <div onClick={() => setSortPickerOpen(true)}>
        <OrderedListOutlined />
      </div>
      <div onClick={() => setFilterPopupOpen(true)}>
        <FilterOutlined />
      </div>
    </Space>
  );

  return (
    <TabBarWrapper
      title="宝可梦列表"
      defaultActiveKey="speciesList"
      right={tabBarRightNode}
    >
      <SearchBar
        placeholder="请输入宝可梦名称"
        clearable
        onSearch={(value) => updateQuery({ name: value })}
        onClear={() => updateQuery({ name: "" })}
      />

      <List header={`共 ${rowCount} 项结果`}>
        {displaySpecies.map((item) => (
          <List.Item
            key={item.id}
            description={`${item.baseStats.hp}/${item.baseStats.atk}/${item.baseStats.def}/${item.baseStats.spa}/${item.baseStats.spd}/${item.baseStats.spe}/${item.bst}`}
            clickable
            onClick={() => router.push(`/speciesDetail?speciesId=${item.id}`)}
          >
            {item.name}
            {item.types.map((type) => (
              <TypeColorTag key={type} type={type} />
            ))}
          </List.Item>
        ))}
      </List>

      <Picker
        visible={isSortPickerOpen}
        columns={sortPickerColumns}
        onClose={() => setSortPickerOpen(false)}
        onConfirm={(value) => {
          const [key, order] = value as [
            keyof SpeciesDataType | keyof BaseStatsType,
            "asc" | "desc"
          ];
          updateQuery({ sort: { key, order } });
          setSortPickerOpen(false);
        }}
      />

      <Popup
        position="right"
        visible={isFilterPopupOpen}
        bodyStyle={{ width: "100%" }}
        onMaskClick={() => setFilterPopupOpen(false)}
      >
        <Form
          layout="horizontal"
          initialValues={queryParams.filter}
          footer={
            <Button block type="submit" color="primary" size="large">
              提交
            </Button>
          }
          onFinish={(values) => {
            updateQuery({ filter: values });
            setFilterPopupOpen(false);
          }}
        >
          <Form.Item
            label="选择世代"
            name="gen"
            trigger="onConfirm"
            onClick={(_, ref: RefObject<PickerRef>) => ref.current?.open()}
            getValueProps={(value) => ({ value: value && [value] })}
            normalize={(value) =>
              value && value.length > 0 ? value[0] : value
            }
          >
            <Picker columns={[genColumn]}>
              {(value) => (value && value.length > 0 ? value[0]?.label : "")}
            </Picker>
          </Form.Item>
          <Form.Item label="选择属性" name="types">
            <Selector multiple options={TypeOption} />
          </Form.Item>
          <Form.Item label="是否可以孵化" name="canHatch">
            <Checkbox.Group>
              <Space>
                <Checkbox value="true">是</Checkbox>
                <Checkbox value="false">否</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="仅查看默认形态" name="forme">
            <Radio.Group>
              <Space>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="仅查看最终进化型" name="evos">
            <Radio.Group>
              <Space>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="选择Tag" name="tags">
            <Selector multiple options={SpeciesTagOption} />
          </Form.Item>
          <Form.Item
            label="选择特性"
            name="abilities"
            onClick={(e) => {
              e.preventDefault();
              setAbilitySelectOpen(true);
            }}
          >
            <AbilitySelect
              visible={isAbilitySelectOpen}
              setVisible={setAbilitySelectOpen}
            />
          </Form.Item>
          <Form.Item
            label="选择招式"
            name="moves"
            onClick={(e) => {
              e.preventDefault();
              setMoveSelectOpen(true);
            }}
          >
            <MoveSelect
              visible={isMoveSelectOpen}
              setVisible={setMoveSelectOpen}
            />
          </Form.Item>
          <Form.Item label="招式筛选模式" name="movesMode">
            <Radio.Group>
              <Space>
                <Radio value="1">或模式</Radio>
                <Radio value="0">与模式</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Popup>
    </TabBarWrapper>
  );
}
