import * as dotenv from 'dotenv';

import {
	loginValidate,
	registerValidate,
} from '../validates/authen.validate.js';

import { HTTP_STATUS } from '../common/http-status.common.js';
import User from '../schemas/user.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

export const userControler = {

	register: async (req, res) => {
		try {

			const body = req.body;


			const { error } = registerValidate.validate(body, { abortEarly: false });
			if (error) {
				const errors = error.details.map((item) => item.message);
				return res
					.status(HTTP_STATUS.BAD_REQUEST)
					.json({ message: errors, success: false });
			}

			const isExitsUser = await User.findOne({ email: body.email });
			if (isExitsUser) {
				return res
					.status(HTTP_STATUS.BAD_REQUEST)
					.json({ message: 'Email đã tồn tại', success: false });
			}

			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(body.password, salt);
			const newUser = await User.create({
				...body,
				password: hashPassword,
			});
			if (!newUser) {
				return res
					.status(HTTP_STATUS.BAD_REQUEST)
					.json({ message: 'Register failed', success: false });
			}

			const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, {
				expiresIn: '1d',
			});

			return res.status(HTTP_STATUS.CREATED).json({
				message: 'Register successfully',
				success: true,
				accessToken: token,
			});
		} catch (error) {
			return res
				.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
				.json({ message: error.message, success: false });
		}
	},

	login: async (req, res) => {
		try {
			const body = req.body;

			const { error } = loginValidate.validate(body, { abortEarly: false });
			if (error) {
				const errors = error.details.map((item) => item.message);
				return res
					.status(HTTP_STATUS.BAD_REQUEST)
					.json({ message: errors, success: false });
			}
			const isExitsUser = await User.findOne({ email: body.email });
			if (!isExitsUser) {
				return res
					.status(HTTP_STATUS.BAD_REQUEST)
					.json({ message: 'Email không tồn tại', success: false });
			}

			if (!isExitsUser) {
				return res
					.status(HTTP_STATUS.BAD_REQUEST)
					.json({ message: 'Email không tồn tại', success: false });
			}

			const isValidPassword = await bcrypt.compare(
				body.password,
				isExitsUser.password
			);

			if (!isValidPassword) {
				return res.BAD_REQUEST.json({
					message: 'Mật khẩu or Tài khoản không chính xác',
					success: false,
				});
			}

			if (isExitsUser && isValidPassword) {
				const token = jwt.sign(
					{ _id: isExitsUser._id },
					process.env.TOKEN_SECRET,
					{
						expiresIn: '1d',
					}
				);

				console.log({ ...isExitsUser });
				const { password, ...user } = isExitsUser._doc;
				return res.status(HTTP_STATUS.OK).json({
					message: 'Login successfully',
					success: true,
					accessToken: token,
					email: user.email,
					id: user._id,
					avatar: user.avatar,
				});
			}
		} catch (error) {
			return res
				.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
				.json({ message: error.message, success: false });
		}
	},
};

export const getDetailUser = async (req, res) => {
	const id = req.userId;

	const user = await User.findById(id);

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	return res.json(user);
};
