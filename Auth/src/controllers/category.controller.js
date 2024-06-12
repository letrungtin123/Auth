import Category from '../schemas/category.schema.js';
import { HTTP_STATUS } from '../common/http-status.common.js';
import { handleAsync } from '../utils/trycatch.js';

export const createCategory = handleAsync(async (req, res) => {
	const body = req.body;
	const category = await Category.create(body);

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'create category failed' });
	}

	return res.status(HTTP_STATUS.CREATED).json({
		message: 'create category successfully',
		data: category,
	});
});

export const getCategoty = handleAsync(async (req, res) => {
	const params = req.query;
	console.log('🚀 ~ getCategoty ~ params:', params);

	const { _page = 1, _limit = 10, q } = params;

	const options = {
		page: _page,
		limit: _limit,
		populate: [{ path: 'productIds', select: '-categoryId -category' }],
	};

	const query = q
		? {
				$and: [
					{
						$or: [
							{ nameCategory: { $regex: new RegExp(q), $options: 'i' } }, 
							{ image: { $regex: new RegExp(q), $options: 'i' } },
						],
					},
				],
		  }
		: {};

	const category = await Category.paginate(query, options);
	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'get category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'get category sucessfully',
		...category,
	});
});

export const getCategotyById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findById(id).populate({
		path: 'productIds',
		select: '-categoryId -category',
	});

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'get category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'get category sucessfully',
		data: category,
	});
});


export const deleteCategory = handleAsync(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findByIdAndDelete(id);

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'delete category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'delete category sucessfully',
		data: category,
	});
});


export const updateCategoryById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const body = req.body;
	const category = await Category.findByIdAndUpdate(id, body, { new: true });

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'update category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'update category sucessfully',
		data: category,
	});
});
