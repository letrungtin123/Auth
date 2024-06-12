import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const useSchema = new mongoose.Schema(
	{
		username: {
			type: String,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		address: {
			type: String,
		},
		avatar: {
			type: String,
		},
		number: {
			type: String,
		},
		role: {
			type: String,
			enum: ['user', 'admin', 'staff'],
			default: 'user',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

useSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', useSchema);

export default User;

// https://viblo.asia/p/phan-biet-su-khac-nhau-giua-authentication-va-authorization-Eb85oad4Z2G
// authentication: xác thực người dùng, xác thực người dùng là việc xác định xem người dùng đó là ai.
// authorization: ủy quyền, ủy quyền là việc xác định xem người dùng đó có quyền truy cập vào tài nguyên đó không.
// token: chuỗi ký tự được tạo ra từ server, dùng để xác thực người dùng, thông thường được lưu trữ ở phía client.
