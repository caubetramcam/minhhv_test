import React, { useState } from "react";
import { Form, Input, Button, Card, message, Alert } from "antd";
import baseAPI from "../helper/base.api";
import { getErrorMessage } from "../helper/helper";

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [msgError, setMsgError] = useState("");

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const data = await baseAPI.post(`/auth/login`, values);
      localStorage.setItem("token", data);
      const profile = await baseAPI.get(`/auth/profile`, {
        headers: {
          Authorization: `Bearer ${data}`,
        },
      });
      localStorage.setItem("user", JSON.stringify(profile));
      onLogin(profile);
    } catch (error) {
      setMsgError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card title="Login" style={{ width: 400 }}>
        {msgError ? (
          <Alert
            message={msgError}
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
            closable
            onClose={() => setMsgError("")}
          />
        ) : null}
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
