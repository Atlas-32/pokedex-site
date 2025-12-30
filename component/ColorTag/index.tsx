import React from "react";
import { Tag } from "antd-mobile";
import { typeColor } from "@/styles/typeColor";

export const TypeColorTag = ({ type }: { type: string }) => {
  const color = typeColor[type.toLowerCase()] || "#777777";
  return (
    <Tag style={{ marginLeft: 8 }} color={color}>
      {type}
    </Tag>
  );
};

export const MoveCategoryColorTag = ({ category }: { category: string }) => {
  let color = "";
  switch (category.toLowerCase()) {
    case "physical":
    case "物理":
      color = "#FF6F61";
      break;
    case "special":
    case "特殊":
      color = "#4D96FF";
      break;
    case "status":
    case "变化":
      color = "#FFD93B";
      break;
    default:
      color = "#777777";
  }
  return (
    <Tag style={{ marginLeft: 8 }} color={color}>
      {category}
    </Tag>
  );
};
