import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { side_nav } from "../navigation/data_link";

const findBreadcrumbPath = (path, menu = side_nav, parents = []) => {
  for (let item of menu) {
    if (item.path === path) {
      return [...parents, item];
    }
    if (item.children && item.children.length > 0) {
      const found = findBreadcrumbPath(path, item.children, [...parents, item]);
      if (found.length > 0) return found;
    }
  }
  return [];
};

const Breakcum = () => {
  const location = useLocation();
  const { pathname } = location;

  const breadcrumbItems = findBreadcrumbPath(pathname);

  if (breadcrumbItems.length === 0) return null;

  return (
    <Breadcrumb className="my-3">
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item
          key={item.path}
          linkAs={Link}
          linkProps={{ to: item.path }}
          active={index === breadcrumbItems.length - 1}
        >
          {item.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breakcum;
