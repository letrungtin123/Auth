import Category from '../schemas/category.schema.js';
import { HTTP_STATUS } from '../common/http-status.common.js';
import Product from '../schemas/product.schema.js';
import { handleAsync } from '../utils/trycatch.js';
import { isObjectIdOrHexString } from 'mongoose';

export const createProduct = handleAsync(async (req, res) => {
	const body = req.body; 

	const newProduct = await Product.create(body);

	if (!newProduct) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'Create product failed' });
	}

	const isExistCategory = await Category.findById({ _id: body.categoryId });

	if (!isExistCategory) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Category not found',
		});
	}
	const category = await Category.findByIdAndUpdate(
		{ _id: body.categoryId },
		{ $addToSet: { productIds: newProduct._id } }, 
		{ new: true }
	);

	if (!category) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Add product to category failed',
		});
	}

	return res.status(HTTP_STATUS.CREATED).json({
		message: 'Create product successfully',
		data: newProduct,
	});
});


export const getProduct = handleAsync(async (req, res) => {
	const { _page = 1, _limit = 10, q } = req.query;

	const options = {
		page: _page,
		limit: _limit,
		populate: [{ path: 'categoryId', select: '-productIds' }],
	};

	let query = {};

	if (q) {
		query = {
			$and: [
				{
					$or: [{ name: { $regex: new RegExp(q), $options: 'i' } }],
				},
			],
		};
	}

	const products = await Product.paginate(query, options);

	if (!products) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'Get product failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'Get product sucessfully',
		...products,
	});
});


export const getProductById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id).populate({
		path: 'categoryId',
		select: '-productIds',
	});

	if (!product) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Get product fail',
		});
	}
	return res
		.status(HTTP_STATUS.OK)
		.json({ message: 'Get product succesfully', data: product });
});


export const deleteProduct = handleAsync(async (req, res) => {
	const { id } = req.params;


	if (!isObjectIdOrHexString(id)) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Invalid id',
		});
	}

	const isExitProduct = await Product.findById({ _id: id });
	if (!isExitProduct) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Product not found',
		});
	}

	const isExistCategory = await Category.findById({
		_id: isExitProduct.categoryId,
	});

	if (!isExistCategory) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Category not found',
		});
	}
	const category = await Category.findByIdAndUpdate(
		{ _id: isExistCategory._id },
		{ $pull: { productIds: isExitProduct._id } }, 
		{ new: true }
	);

	if (!category) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Add product to category failed',
		});
	}

	const product = await Product.findByIdAndDelete(id);

	if (!product) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Delete product fail',
		});
	}

	return res
		.status(HTTP_STATUS.OK)
		.json({ message: 'Delete product succesfully', data: product });
});

export const updateProductById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const body = req.body;

	if (!isObjectIdOrHexString(id)) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Invalid id',
		});
	}

	const isExitProduct = await Product.findById({ _id: id });
	if (!isExitProduct) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Product not found',
		});
	}

	const isExistCategory = await Category.findById({
		_id: isExitProduct.categoryId,
	});

	if (!isExistCategory) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Category not found',
		});
	}
	const category = await Category.findByIdAndUpdate(
		{ _id: isExistCategory._id },
		{ $pull: { productIds: isExitProduct._id } }, 
		{ new: true }
	);

	if (!category) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Add product to category failed',
		});
	}

	const product = await Product.findByIdAndUpdate(id, body, { new: true });

	if (!product) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'update product failed' });
	}

	const isExistCategoryUpdate = await Category.findById({
		_id: body.categoryId,
	});

	if (!isExistCategoryUpdate) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Category not found',
		});
	}
		const categoryUpdate = await Category.findByIdAndUpdate(
		{ _id: body.categoryId },
		{ $addToSet: { productIds: product._id } }, 
		{ new: true }
	);

	if (!categoryUpdate) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: 'Add product to category failed',
		});
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'update product sucessfully',
		data: product,
	});
});


