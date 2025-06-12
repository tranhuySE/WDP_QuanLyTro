import { Breadcrumb, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { side_nav } from "../routes/data_link";

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

const BreadcrumbLayout = () => {
    const location = useLocation();
    const { pathname } = location;

    const breadcrumbItems = findBreadcrumbPath(pathname);

    if (breadcrumbItems.length === 0) return null;

    return (
        <Container className="my-3">
            <Breadcrumb>
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
        </Container>
    );
};

export default BreadcrumbLayout;
