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

const ROOT_PATH = 'R6rWab14FTA7PouFWe9K';

export const enum FilePath {
	Image = `${ROOT_PATH}/image`,
	Video = `${ROOT_PATH}/vidoe`,
}
export const FILE_NAME_LENGTH = 32;

export const IMAGE_TOPIC = 'image-topic';
