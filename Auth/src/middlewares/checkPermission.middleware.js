import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../common/http-status.common.js';
import User from '../schemas/user.schema.js';

export const checkPermission = async (req, res, next) => {
	let token = req.headers['authorization'];
	if (!token) {
		return res
			.status(HTTP_STATUS.UNAUTHORIZED)
			.json({ message: 'Access denied', success: false });
	}

	token = token.split(' ')[1];

	if (!token) {
		return res
			.status(HTTP_STATUS.UNAUTHORIZED)
			.json({ message: 'UNAUTHORIZED', success: false });
	}

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

		const user = await User.findById(decoded._id);

		if (!user) {
			return res
				.status(HTTP_STATUS.UNAUTHORIZED)
				.json({ message: 'UNAUTHORIZED', success: false });
		}

		if (user.role !== 'admin') {
			return res
				.status(HTTP_STATUS.FORBIDDEN)
				.json({ message: 'Bạn không có quyền truy cập', success: false });
		}

		next();
	} catch (error) {
		return res
			.status(HTTP_STATUS.UNAUTHORIZED)
			.json({ message: 'UNAUTHORIZED', success: false });
	}
};

export const checkAuth = async (req, res, next) => {
	let token = req.headers['authorization'];
	if (!token) {
		return res
			.status(HTTP_STATUS.UNAUTHORIZED)
			.json({ message: 'Access denied', success: false });
	}

	token = token.split(' ')[1];

	if (!token) {
		return res
			.status(HTTP_STATUS.UNAUTHORIZED)
			.json({ message: 'UNAUTHORIZED', success: false });
	}

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

		req.userId = decoded._id;

		next();
	} catch (error) {
		return res
			.status(HTTP_STATUS.UNAUTHORIZED)
			.json({ message: 'UNAUTHORIZED', success: false });
	}
};
