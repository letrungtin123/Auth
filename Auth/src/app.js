import express from 'express';
import morgan from 'morgan';
import connectDb from './configs/connect-db.config.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Connect Db
connectDb();

// router
app.use('/api/v1', [productRoutes, categoryRoutes, authRoutes, userRoutes]);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
