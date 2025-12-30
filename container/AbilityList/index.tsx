import abilityData from "@/public/handledAbilities.json";
import React, { RefObject, useMemo, useState } from "react";
import {
  Button,
  Form,
  List,
  Picker,
  PickerRef,
  Popup,
  SearchBar,
  Selector,
  Space,
} from "antd-mobile";
import TabBarWrapper from "@/component/TabBarWrapper";
import { AbilityFlagOption, genColumn } from "@/util/optionData";
import { operateData } from "@/util/filterSchema";
import { OrderedListOutlined, FilterOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { AbilityDataType } from "@/type/publicData";

interface SortState {
  key: keyof AbilityDataType;
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
  ],
  [
    { label: "升序", value: "asc" },
    { label: "降序", value: "desc" },
  ],
];

export default function AbilityListContainer() {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<QueryState>({
    name: "",
    sort: { key: "num", order: "asc" },
    filter: {},
  });

  const [isSortPickerOpen, setSortPickerOpen] = useState(false);
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);

  const displayAbilities = useMemo(() => {
    const { filter, name, sort } = queryParams;

    let result = operateData("ability", abilityData, filter);

    if (name) {
      const lowerName = name.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(lowerName)
      );
    }

    return result.sort((a, b) => {
      const valA = a[sort.key];
      const valB = b[sort.key];

      if (valA === valB) return 0;

      const comparison = valA > valB ? 1 : -1;
      return sort.order === "asc" ? comparison : -comparison;
    });
  }, [queryParams]);
  const rowCount = displayAbilities.length;

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
      title="特性列表"
      defaultActiveKey="abilityList"
      right={tabBarRightNode}
    >
      <SearchBar
        placeholder="请输入特性名称"
        clearable
        onSearch={(value) => updateQuery({ name: value })}
        onClear={() => updateQuery({ name: "" })}
      />

      <List header={`共 ${rowCount} 项结果`}>
        {displayAbilities.map((item) => (
          <List.Item
            key={item.id}
            description={item.shortDesc}
            clickable
            onClick={() => router.push(`/abilityDetail?abilityId=${item.id}`)}
          >
            {item.name}
          </List.Item>
        ))}
      </List>

      <Picker
        visible={isSortPickerOpen}
        columns={sortPickerColumns}
        onClose={() => setSortPickerOpen(false)}
        onConfirm={(value) => {
          const [key, order] = value as [keyof AbilityDataType, "asc" | "desc"];
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
          <Form.Item label="选择Flag" name="flags">
            <Selector multiple options={AbilityFlagOption} />
          </Form.Item>
        </Form>
      </Popup>
    </TabBarWrapper>
  );
}
