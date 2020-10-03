import { message } from 'antd';
import jsonp from 'jsonp';
/*
 * 所有接口请求函数模块
 */

import ajax from './ajax';

export const reqLogin = (username: string, password: string): Promise<any> => ajax<any>('/login', { username, password });

export const reqAddUser = (user: any) => ajax('/manage/user/add', user, 'POST');

export const reqWheater = (city: string):Promise<{ dayPictureUrl:any, weather:any }> => {
	return new Promise((resolve, reject) => {
		jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, (err, data: any) => {
			if (!err && data.status === 'success') {
				const { dayPictureUrl, weather } = data.results[0].weather_data[0];
				resolve({ dayPictureUrl, weather });
			} else {
				message.error('获取天气信息失败!');
			}
		});
	});
};

reqWheater('常州');
