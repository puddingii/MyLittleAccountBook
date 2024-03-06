/* eslint-disable no-unused-vars */
export const enum FileSize {
	BYTE = 1,
	KB = 1024,
	MB = 1048576,
	GB = 1073741824,
}

export const enum FileMaximumSize {
	AccountBookImage = FileSize.MB * 2,
	UserImage = FileSize.MB * 2,
}
