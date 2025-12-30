import moveData from "@/public/handledMoves.json";
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
  Tag,
} from "antd-mobile";
import TabBarWrapper from "@/component/TabBarWrapper";
import {
  genColumn,
  MoveCategoryOption,
  MovePriorityOption,
  MoveTargetOption,
  TypeOption,
} from "@/util/optionData";
import { operateData } from "@/util/filterSchema";
import { OrderedListOutlined, FilterOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { MoveCategoryColorTag, TypeColorTag } from "@/component/ColorTag";
import { MoveDataType } from "@/type/publicData";

interface SortState {
  key: keyof MoveDataType;
  order: "asc" | "desc";
}

interface FilterState {
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
    { label: "威力", value: "basePower" },
    { label: "命中", value: "accuracy" },
    { label: "PP", value: "pp" },
  ],
  [
    { label: "升序", value: "asc" },
    { label: "降序", value: "desc" },
  ],
];

export default function MoveListContainer() {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<QueryState>({
    name: "",
    sort: { key: "num", order: "asc" },
    filter: {},
  });

  const [isSortPickerOpen, setSortPickerOpen] = useState(false);
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);

  const displayMoves = useMemo(() => {
    const { filter, name, sort } = queryParams;

    let result = operateData("move", moveData, filter);

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
  const rowCount = displayMoves.length;

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
      title="招式列表"
      defaultActiveKey="moveList"
      right={tabBarRightNode}
    >
      <SearchBar
        placeholder="请输入招式名称"
        clearable
        onSearch={(value) => updateQuery({ name: value })}
        onClear={() => updateQuery({ name: "" })}
      />

      <List header={`共 ${rowCount} 项结果`}>
        {displayMoves.map((item) => (
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
        ))}
      </List>

      <Picker
        visible={isSortPickerOpen}
        columns={sortPickerColumns}
        onClose={() => setSortPickerOpen(false)}
        onConfirm={(value) => {
          const [key, order] = value as [keyof MoveDataType, "asc" | "desc"];
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
          <Form.Item label="选择类型" name="category">
            <Selector options={MoveCategoryOption} />
          </Form.Item>
          <Form.Item label="选择属性" name="type">
            <Selector options={TypeOption} />
          </Form.Item>
          <Form.Item
            label="选择招式目标"
            name="target"
            trigger="onConfirm"
            onClick={(_, ref: RefObject<PickerRef>) => ref.current?.open()}
            getValueProps={(value) => ({ value: value && [value] })}
            normalize={(value) =>
              value && value.length > 0 ? value[0] : value
            }
          >
            <Picker columns={[MoveTargetOption]}>
              {(value) => (value && value.length > 0 ? value[0]?.label : "")}
            </Picker>
          </Form.Item>
          <Form.Item
            label="选择优先级"
            name="priority"
            trigger="onConfirm"
            onClick={(_, ref: RefObject<PickerRef>) => ref.current?.open()}
            getValueProps={(value) => ({ value: value && [value] })}
            normalize={(value) =>
              value && value.length > 0 ? value[0] : value
            }
          >
            <Picker columns={[MovePriorityOption]}>
              {(value) => (value && value.length > 0 ? value[0]?.label : "")}
            </Picker>
          </Form.Item>
        </Form>
      </Popup>
    </TabBarWrapper>
  );
}
