import { Link, useLocation, useNavigate } from "@remix-run/react"
import { Menu } from "antd"
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import _ from "lodash";
import { FaCircleUser, FaCreditCard, FaFlag, FaHouseUser, FaRightToBracket, FaTable } from "react-icons/fa6";
import { IoAddCircle, IoListOutline } from "react-icons/io5";
import { Role, useGetProfile } from "~/data";

type AdminSideBarProps = {
  color: string;
}

export const AdminSideBar = ({ color }: AdminSideBarProps) => {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const navigate = useNavigate();
  const profile = useGetProfile();

  const dashboard = [
    <FaHouseUser />,
  ];

  const tables = [
    <FaTable />,
  ];

  const billing = [
    <FaCreditCard />,
  ];

  const rtl = [
    <FaFlag />,
  ];

  const signin = [
    <FaRightToBracket />,
  ];

  const navbar = [
    {
      title: 'Dashboard',
      icon: dashboard,
      to: '/dashboard',
    },
    {
      title: 'Combo',
      icon: dashboard,
      to: '/admin/combo',
    },
    {
      title: 'Kit',
      icon: dashboard,
      to: '/admin/kit',
    },
    {
      title: 'Tables',
      icon: tables,
      to: '/tables',
    },
    {
      title: 'Billing',
      icon: billing,
      to: '/billing',
    },
    {
      title: 'RTL',
      icon: rtl,
      to: '/rtl',
    },
    {
      title: 'Profile',
      icon: <FaCircleUser />,
      to: '/profile',
    }
  ]

  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: 'dashboard',
      icon: dashboard,
      label: 'Dashboard',
      onClick: () => {
        navigate('/admin/dashboard');
      },
    },
    {
      key: 'combo',
      icon: dashboard,
      label: 'Combo',
      children: [
        {
          key: "view-combo",
          icon: <IoListOutline />,
          label: "View Combo",
          onClick: () => {
            navigate('/admin/combo');
          },
        },
        {
          key: "create-combo",
          icon: <IoAddCircle />,
          label: "Create Combo",
          onClick: () => {
            navigate('/admin/combo/create');
          },
        },
      ],
    },
    {
      key: 'kit',
      icon: dashboard,
      label: 'Kit',
      children: [
        {
          key: "view-kits",
          icon: <IoListOutline />,
          label: "View Kits",
          onClick: () => {
            navigate('/admin/kit');
          },
        },
        {
          key: "create-kit",
          icon: <IoAddCircle />,
          label: "Create Kit",
          onClick: () => {
            navigate('/admin/kit/create');
          },
        },
      ],
    },
    {
      key: 'lab',
      icon: dashboard,
      label: 'Lab',
      children: [
        {
          key: "view-labs",
          icon: <IoListOutline />,
          label: "View Labs",
          onClick: () => {
            navigate('/admin/lab');
          },
        },
        {
          key: "create-lab",
          icon: <IoAddCircle />,
          label: "Create Lab",
          onClick: () => {
            navigate('/admin/lab/create');
          },
        },
      ],
    },
    {
      key: 'item',
      icon: dashboard,
      label: 'Item',
      children: [
        {
          key: "view-items",
          icon: <IoListOutline />,
          label: "View Items",
          onClick: () => {
            navigate('/admin/item');
          },
        },
        {
          key: "create-item",
          icon: <IoAddCircle />,
          label: "Create Item",
          onClick: () => {
            navigate('/admin/item/create');
          },
        },
      ],
    },
    {
      key: 'blog',
      icon: dashboard,
      label: 'Blog',
      children: [
        {
          key: "view-blog",
          icon: <IoListOutline />,
          label: "View Blog",
          onClick: () => {
            navigate('/admin/blog');
          },
        },
        {
          key: "create-blog",
          icon: <IoAddCircle />,
          label: "Create Blog",
          onClick: () => {
            navigate('/admin/blog/create');
          },
        },
      ],
    },
    {
      key: 'category',
      icon: dashboard,
      label: 'Category',
      children: [
        {
          key: "view-category",
          icon: <IoListOutline />,
          label: "View Category",
          onClick: () => {
            navigate('/admin/category');
          },
        },
      ],
    },
    {
      key: 'support',
      icon: dashboard,
      label: 'Support',
      children: [
        {
          key: "view-support",
          icon: <IoListOutline />,
          label: "View Support",
          onClick: () => {
            navigate('/admin/support');
          },
        },
      ],
    },
    {
      key: 'order',
      icon: dashboard,
      label: 'Order',
      children: [
        {
          key: "view-order",
          icon: <IoListOutline />,
          label: "View Order",
          onClick: () => {
            navigate('/admin/order');
          },
        },
      ],
    },
  ]
  const getFilteredMenuItems = (role: Role) => {
    const rolePermissions = {
      Admin: ['dashboard', 'combo', 'kit', 'lab', 'item', 'blog', 'category', 'support', 'order'],
      Manager: ['dashboard', 'combo', 'kit', 'lab', 'item', 'support', 'blog', 'order'],
      Staff: ['dashboard', 'support', 'category'],
      Customer: [''],
    };
  
    return _.filter(menuItems, (item) => rolePermissions[role].includes(item?.key?.toString() || ''));
  };

  const filteredMenuItems = getFilteredMenuItems(profile.data?.detail?.role || 'Customer');

  return (
    <>
      <div className="brand">
        <img src="/images/logo.jpg" alt="logo" />
        <span>KitStemShop Dashboard</span>
      </div>
      <hr />
      <Menu items={filteredMenuItems} theme="light" mode="inline">
      </Menu>
      <div className="aside-footer">
        <Link to="/logout?redirectTo=/?action=logout" className="text-center">
          Logout
        </Link>
        {/* <div
          className="footer-box"
          style={{
            background: color,
          }}
        >
          <span key={"icon"} className="icon" style={{ color }}>
            {dashboard}
          </span>
          <h6>Need Help?</h6>
          <p>Please check our docs</p>
          <Button type="primary" className="ant-btn-sm ant-btn-block">
            DOCUMENTATION
          </Button>
        </div> */}
      </div>
    </>
  )
}