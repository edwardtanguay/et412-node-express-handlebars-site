import express from 'express';
import * as config from './config';
import path from 'path';
import * as model from './model';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';


const app = express();
const baseDir = process.cwd();
const versionName = 'Handlebars 1.0';

Handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
	return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.engine('.hbs', engine({
	extname: '.hbs',
	defaultLayout: 'main',
	layoutsDir: path.join(baseDir, '/src/views/layouts'),
	partialsDir: path.join(baseDir, '/src/views/partials'),
}));

app.set('view engine', '.hbs');
app.set('views', path.join(baseDir, '/src/views'));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('pages/welcome', { versionName });
});

app.get('/welcome', (req, res) => {
	res.render('pages/welcome', { versionName });
});

app.get('/books', async (req, res) => {
	res.render('pages/books');
});

app.get('/book/:idCode', async (req, res) => {
	const idCode = req.params.idCode;
	const books = await model.getBooks();
	const book = books.find(m => m.idCode === idCode);
	res.render('pages/book', { book });
});

app.get('/about', (req, res) => {
	res.render('pages/about', {});
});

app.get('/api/books', async (req, res) => {
	res.json(await model.getBooks());
});

app.get('*', (req, res) => {
	res.status(404).render('pages/404');
});

app.listen(config.getPort(), () => {
	console.log(`Listening at http://localhost:${config.getPort()}`);
});