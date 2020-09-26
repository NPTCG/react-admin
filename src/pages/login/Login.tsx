import React, { Component } from 'react';
import './login.less';
import logo from './images/logo.png';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';

/**
 *  登录的路由组件
 *  Author: MFine
 */

export default class Login extends Component {
	// onFinish = (values: { username: string; password: string }) => {
	// 	console.log(values);
	// };

	validatePwd = (rule: RuleObject, value: StoreValue) => {
		if (!value) {
			return Promise.reject('密码必须输入');
		} else if (value.length < 3 || value.length > 12) {
			return Promise.reject('密码长度不能小于4位或大于12位');
		} else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
			return Promise.reject('密码必须是英文，数字和下划线组成');
		} else {
			return Promise.resolve();
		}
	};
	onFinishFailed = (errorInfo: any) => {
    
	};
	onFinish = (values: { username: string; password: string }) => {

  };

	private loginFromCom() {
		return (
			<Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} name="normal_login" className="login-form" initialValues={{ remember: true }}>
				<Form.Item
					name="username"
					rules={[
						{ required: true, whitespace: true, message: '请输入您的用户名' },
						{ max: 12, message: '用户名最多十二位' },
						{ min: 3, message: '用户名至少三位' },
						{ pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文,数字和下划线组成' },
					]}
				>
					<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
				</Form.Item>
				<Form.Item name="password" rules={[{ validator: this.validatePwd }]}>
					<Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button">
						Log in
					</Button>
				</Form.Item>
			</Form>
		);
	}

	render() {
		return (
			<div className="login">
				<header className="login-header">
					<img src={logo} alt="logo"></img>
					<h1>React项目:后台管理系统</h1>
				</header>
				<section className="login-content">
					<h2>用户登录</h2>
					{this.loginFromCom()}
				</section>
			</div>
		);
	}
}
