import busboy from 'busboy';
import { NextFunction, Request, Response } from 'express';

import appendField from '@/util/append-field';

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
	bb.on('field', function (fieldname, val, info) {
		if (info.nameTruncated || info.valueTruncated) {
			return;
		}

		appendField(req.body, fieldname, val);
	});

	bb.on('file', function (...fileInfo) {
		const name = fileInfo[0];
		const stream = fileInfo[1];
		const { encoding, filename, mimeType } = fileInfo[2];

		const chunkList = [] as Uint8Array[];
		req.file = {
			name,
			stream,
			encoding,
			filename,
			mimeType,
			size: 0,
			buffer: Buffer.concat(chunkList),
		};

		/**
		 * chunk.length === n bytes
		 * https://nodejs.org/api/stream.html#event-data
		 */
		stream.on('data', function (chunk) {
			if (req.file && chunk.length) {
				req.file.size += chunk.length;
				chunkList.push(chunk as Uint8Array);
			}
		});

		stream.on('end', function () {
			if (req.file) {
				req.file.buffer = Buffer.concat(chunkList);
			}
		});
	});

	req.pipe(bb);
};
