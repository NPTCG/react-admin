import React, { Component } from 'react';
import LinkButton from '../../components/link-button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Cascader, Form, Input, message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { CategoryModel } from '../category/Model';
import { reqCategorys } from '../../api';
import { ResponseValue } from '../../api/Model';

interface Options {
	value: string;
	label: string;
	isLeaf: boolean;
}

interface ProductAddUpdateState {
	options: Options[];
}

interface ProductAddUpdateProps {}

type ProductAddUpdateRouteProps = ProductAddUpdateProps & RouteComponentProps;

class ProductAddUpdate extends Component<ProductAddUpdateRouteProps, ProductAddUpdateState> {
	constructor(props: ProductAddUpdateRouteProps) {
		super(props);

		this.state = {
			options: [],
		};
	}

	/**
	 * @name: From完成提交回调
	 * @test: test font
	 * @msg:
	 * @param {any}
	 * @return {void}
	 */
	private onFinish = (values: any): void => {};

	/**
	 * @name: From提交失败回调
	 * @test: test font
	 * @msg:
	 * @param {*}
	 * @return {*}
	 */
	private onFinishFailed = (errorInfo: any): void => {};

	/**
	 * @name: 价格验证器
	 * @test: test font
	 * @msg: 价格不能小于0
	 * @param { RuleObject , StoreValue}
	 * @return {Promise<any>}
	 */
	private validatePrice = (rule: RuleObject, value: StoreValue): Promise<any> => {
		if (Number.parseInt(value) <= 0) {
			return Promise.reject('价格必须大于0');
		}
		return Promise.resolve();
	};

	/**
	 * @name: Lazy Cascader 数据加载方法
	 * @test: test font
	 * @msg: 用于Lazy Cascader 数据加载
	 * @param { CascaderOptionType[]}
	 * @return {void}
	 */
	private loadData = async (selectedOptions?: CascaderOptionType[]): Promise<any> => {
		if (selectedOptions === undefined) {
			return;
		}
		const targetOption = selectedOptions[0];
		targetOption.loading = true;
		const subCategorys = await this.getCategorys(targetOption.value as string);
		targetOption.loading = false; 
		if (subCategorys && subCategorys.length > 0) {
			const childOptions = subCategorys.map((c) => ({
				value: String(c.id),
				label: c.name,
				isLeaf: true,
			}));
			targetOption.children = childOptions;
		} else {
			targetOption.isLeaf = true;
		}
		this.setState({
			options: [...this.state.options],
		});
	};

	private onChange = (value: CascaderValueType, selectedOptions?: CascaderOptionType[]): void => {};

	private getCategorys = async (parentId: string): Promise<CategoryModel[] | undefined> => {
		const result: ResponseValue<CategoryModel> = await reqCategorys(parentId);
		if (result.status === 0) {
			const categorys: CategoryModel[] | undefined = result.data;
			if (parentId === '0') {
				this.initOptions(categorys);
			} else {
				return categorys;
			}
		}
	};

	/**
	 * @name: initOptions
	 * @test: test font
	 * @msg: 初始化Cascader状态数据
	 * @param {*}
	 * @return {*}
	 */
	private initOptions = (categorys: CategoryModel[] | undefined) => {
		const options: Options[] | undefined = categorys?.map((c) => ({
			value: String(c.id),
			label: c.name,
			isLeaf: false,
		}));
		this.setState({
			options: options ?? [],
		});
	};

	componentDidMount() {
		this.getCategorys('0');
	}

	render() {
		const { options } = this.state;

		const formItemLayout = {
			labelCol: { span: 1 },
			wrapperCol: { span: 8 },
		};

		const title = (
			<span>
				<LinkButton
					style={{ fontSize: 20 }}
					onClick={() => {
						this.props.history.goBack();
					}}
				>
					<ArrowLeftOutlined style={{ margin: 5 }} />
				</LinkButton>
				<span>添加商品</span>
			</span>
		);
		return (
			<div>
				<Card title={title}>
					<Form
						{...formItemLayout}
						initialValues={{ remember: true }}
						onFinish={this.onFinish}
						onFinishFailed={this.onFinishFailed}
					>
						<Form.Item name="name" label="商品名称" rules={[{ required: true, message: '必须输入商品名称' }]}>
							<Input placeholder="请输入商品名称"></Input>
						</Form.Item>
						<Form.Item name="desc" label="商品描述" rules={[{ required: true, message: '必须输入商品描述' }]}>
							<Input.TextArea placeholder="请输入商品描述" autoSize />
						</Form.Item>
						<Form.Item
							name="price"
							label="商品价格"
							rules={[
								{ required: true, message: '必须输入商品价格' },
								{
									validator: this.validatePrice,
								},
							]}
						>
							<Input type="number" placeholder="请输入商品价格" addonAfter="元"></Input>
						</Form.Item>
						<Form.Item name="category" label="商品分类">
							<Cascader
								options={options}
								loadData={this.loadData}
								onChange={this.onChange}
								changeOnSelect
								placeholder="请选择"
							></Cascader>
						</Form.Item>
						<Form.Item name="picture" label="商品图片"></Form.Item>
						<Form.Item name="detail" label="商品详情">
							<div>商品详情</div>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								提交
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</div>
		);
	}
}

export default withRouter(ProductAddUpdate);
