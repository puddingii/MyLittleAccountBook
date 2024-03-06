import busboy from 'busboy';
import { NextFunction, Request, Response } from 'express';

export const decodeMultipartFormdata = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const bb = busboy({ headers: req.headers });

	bb.on('error', function (error) {
		next(error);
	});

	bb.on('close', function () {
		next();
	});

	// handle text field data (code taken from multer.js)
	bb.on('field', function (fieldname, val) {
		if (Object.hasOwn(req.body, fieldname)) {
			if (Array.isArray(req.body[fieldname])) {
				req.body[fieldname].push(val);
			} else {
				req.body[fieldname] = [req.body[fieldname], val];
			}
		} else {
			req.body[fieldname] = val;
		}
	});

	bb.on('file', function (...fileInfo) {
		const name = fileInfo[0];
		const stream = fileInfo[1];
		const { encoding, filename, mimeType } = fileInfo[2];

		req.file = { name, stream, encoding, filename, mimeType, size: 0 };

		/**
		 * chunk.length === n bytes
		 * https://nodejs.org/api/stream.html#event-data
		 */
		stream.on('data', function (chunk) {
			if (req.file && chunk.length) {
				req.file.size += chunk.length;
			}
		});
	});

	req.pipe(bb);
};
