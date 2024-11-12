import { Link, NavLink } from "@remix-run/react";
import { Avatar, Badge, Breadcrumb, Button, Col, Drawer, Dropdown, Input, List, Row, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import { FaBell, FaCircleUser, FaClock, FaCreditCard, FaFacebook, FaGear, FaMagnifyingGlass, FaSquareXTwitter, FaStar, FaToggleOff, FaWifi } from "react-icons/fa6";
import { styled } from "styled-components";
import { useGetProfile } from "~/data";

const ButtonContainer = styled.div`
  .ant-btn-primary {
    background-color: #1890ff;
  }
  .ant-btn-success {
    background-color: #52c41a;
  }
  .ant-btn-yellow {
    background-color: #fadb14;
  }
  .ant-btn-black {
    background-color: #262626;
    color: #fff;
    border: 0px;
    border-radius: 5px;
  }
  .ant-switch-active {
    background-color: #1890ff;
  }
`;

const data = [
  {
    title: "New message from Sophie",
    description: <><FaClock /> 2 days ago</>,

    avatar: "/images/dashboard/face-2.jpg",
  },
  {
    title: "New album by Travis Scott",
    description: <><FaClock /> 2 days ago</>,

    avatar: <Avatar shape="square"><FaWifi /></Avatar>,
  },
  {
    title: "Payment completed",
    description: <><FaClock /> 2 days ago</>,
    avatar: <Avatar shape="square"><FaCreditCard /></Avatar>,
  },
];

const menu = (
  <List
    min-width="100%"
    className="header-notifications-dropdown "
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar shape="square" src={item.avatar} />}
          title={item.title}
          description={item.description}
        />
      </List.Item>
    )}
  />
);

type AdminHeaderProps = {
  placement?: any | undefined,
  name: string,
  subName: string,
  onPress: () => void,
  handleSidenavColor: (color: string) => void,
  handleSidenavType: (type: string) => void,
  handleFixedNavbar: (type: boolean) => void,
}

export const AdminHeader = ({
  placement,
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}: AdminHeaderProps) => {
  const { Title, Text } = Typography;

  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");
  const profile = useGetProfile();
  const isLogin = !!profile.data?.detail?.username;

  useEffect(() => window.scrollTo(0, 0));

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return (
    <>
      <div className="setting-drwer" onClick={showDrawer}>
        <FaGear />
      </div>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/admin">Pages</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="uppercase">
              {name.replace("/", "")}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            >
              {subName.replace("/", "")}
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Badge size="small" count={4}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <a
                href="#pablo"
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <FaBell />
              </a>
            </Dropdown>
          </Badge>
          <Button type="link" onClick={showDrawer}>
            <FaGear />
          </Button>
          <Button
            type="link"
            className="sidebar-toggler"
            onClick={() => onPress()}
          >
            <FaToggleOff />
          </Button>
          <Drawer
            className="settings-drawer"
            mask={true}
            width={360}
            onClose={hideDrawer}
            placement={placement}
            open={visible}
          >
            <div>
              <div className="header-top">
                <Title level={4}>
                  Configurator
                  <Text className="subtitle">See our dashboard options.</Text>
                </Title>
              </div>

              <div className="sidebar-color">
                <Title level={5}>Sidebar Color</Title>
                <div className="theme-color mb-2">
                  <ButtonContainer>
                    <Button
                      type="primary"
                      onClick={() => handleSidenavColor("#1890ff")}
                    >
                      1
                    </Button>
                    <Button
                      type="link"
                      onClick={() => handleSidenavColor("#52c41a")}
                    >
                      1
                    </Button>
                    <Button
                      type="link"
                      onClick={() => handleSidenavColor("#d9363e")}
                    >
                      1
                    </Button>
                    <Button
                      type="link"
                      onClick={() => handleSidenavColor("#fadb14")}
                    >
                      1
                    </Button>

                    <Button
                      type="link"
                      onClick={() => handleSidenavColor("#111")}
                    >
                      1
                    </Button>
                  </ButtonContainer>
                </div>

                <div className="sidebarnav-color mb-2">
                  <Title level={5}>Sidenav Type</Title>
                  <Text>Choose between 2 different sidenav types.</Text>
                  <ButtonContainer className="trans">
                    <Button
                      type={sidenavType === "transparent" ? "primary" : "default"}
                      onClick={() => {
                        handleSidenavType("transparent");
                        setSidenavType("transparent");
                      }}
                    >
                      TRANSPARENT
                    </Button>
                    <Button
                      type={sidenavType === "white" ? "primary" : "default"}
                      onClick={() => {
                        handleSidenavType("#fff");
                        setSidenavType("white");
                      }}
                    >
                      WHITE
                    </Button>
                  </ButtonContainer>
                </div>
                <div className="fixed-nav mb-2">
                  <Title level={5}>Navbar Fixed </Title>
                  <Switch onChange={(e) => handleFixedNavbar(e)} />
                </div>
                <div className="ant-docment">
                  <ButtonContainer>
                    <Button type="link" size="large">
                      FREE DOWNLOAD
                    </Button>
                    <Button size="large">VIEW DOCUMENTATION</Button>
                  </ButtonContainer>
                </div>
                <div className="viewstar">
                  <a href="#pablo">{<FaStar />} Star</a>
                  <a href="#pablo"> 190</a>
                </div>

                <div className="ant-thank">
                  <Title level={5} className="mb-2">
                    Thank you for sharing!
                  </Title>
                  <ButtonContainer className="social">
                    <Button type="link">{<FaSquareXTwitter />}TWEET</Button>
                    <Button type="link">{<FaFacebook />}SHARE</Button>
                  </ButtonContainer>
                </div>
              </div>
            </div>
          </Drawer>
          <Link to={isLogin ? "#": "/login"} className="btn-sign-in">
            <FaCircleUser />
            {isLogin ? <span>
              {profile.data?.detail?.username}
            </span> : <span>Sign in</span>}
          </Link>
          {/* <Input
            className="header-search"
            placeholder="Type here..."
            prefix={<FaMagnifyingGlass />}
          /> */}
        </Col>
      </Row>
    </>
  )
}