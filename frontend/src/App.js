import React, { useState, useEffect } from "react";
import { Layout, Button, message, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Login from "./pages/Login";
import ItemList from "./components/ItemList";

const { Header, Content } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    message.success("Đăng xuất thành công!");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isAuthenticated ? (
        <>
          <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", padding: "0 20px", height:50 }}>
            <h2 style={{ color: "white" }}>Admin</h2>
            <Dropdown overlay={menu} trigger={['click']}>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <span style={{ color: "white" }}>{user?.fullName}</span>
              </div>
            </Dropdown>
          </Header>
          <Content>
            <ItemList />
          </Content>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Layout>
  );
};

export default App;
