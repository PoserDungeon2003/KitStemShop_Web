import { useLocation } from "@remix-run/react";
import { Affix, Drawer, Layout } from "antd";
import { useEffect, useState } from "react";
import { AdminSideBar } from "./AdminSideBar";
import { AdminHeader } from "./AdminHeader";
import { AdminFooter } from "./AdminFooter";

const { Header: AntHeader, Content, Sider } = Layout;

type AdminLayoutProps = {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [placement, setPlacement] = useState<string>("right");
  const [sidenavColor, setSidenavColor] = useState<string>("#1890ff");
  const [sidenavType, setSidenavType] = useState<string>("transparent");
  const [fixed, setFixed] = useState<boolean>(false);

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type: string) => setSidenavType(type);
  const handleSidenavColor = (color: string) => setSidenavColor(color);
  const handleFixedNavbar = (type: boolean) => setFixed(type);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);

  return (
    <Layout
      className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""
        } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
    >
      <Drawer
        title={false}
        placement={placement === "right" ? "left" : "right"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={placement === "right" ? "left" : "right"}
        width={250}
        className={`drawer-sidebar ${pathname === "rtl" ? "drawer-sidebar-rtl" : ""
          } `}
      >
        <Layout
          className={`layout-dashboard ${pathname === "rtl" ? "layout-dashboard-rtl" : ""
            }`}
        >
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""
              }`}
            style={{ background: sidenavType }}
          >
            <AdminSideBar color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""
          }`}
        style={{ background: sidenavType }}
      >
        <AdminSideBar color={sidenavColor} />
      </Sider>
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <AdminHeader
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <AdminHeader
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}
        <Content className="content-ant overflow-auto">{children}</Content>
        <AdminFooter />
      </Layout>
    </Layout>
  )
}