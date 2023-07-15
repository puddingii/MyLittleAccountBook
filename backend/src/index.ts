import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('combined'));

const router = express.Router();
router.get('/', (req, res) => {
	res.status(200).send('hi');
});
app.use(router);

app.listen(3044, () => {
	console.log('Hello!  http://localhost:3044');
});
