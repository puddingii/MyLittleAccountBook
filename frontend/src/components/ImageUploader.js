import { memo } from 'react';
import { Button, CircularProgress, Grid, Input, styled } from '@mui/material';
import PropTypes from 'prop-types';

import defaultPreview from 'assets/images/uploadPhotoPreviewKR.png';

const Image = styled('img')({
	margin: 'auto',
	display: 'block',
	maxWidth: '100%',
	maxHeight: '100%',
});

const CustomImage = memo(({ path, state, imageSize }) => {
	const visibleStyle = { display: state === 'doing' ? 'none' : '' };
	const size = { width: '200px', height: '200px', ...imageSize };

	return <Image style={{ ...visibleStyle, ...size }} alt="CustomImage" src={path} />;
});

CustomImage.propTypes = {
	path: PropTypes.string.isRequired,
	imageSize: PropTypes.shape({
		width: PropTypes.string,
		height: PropTypes.string,
	}),
	state: PropTypes.oneOf(['done', 'doing', 'init', 'error']).isRequired,
};

const BYTE_PER_MB = 1024 * 1024;

const ImageUploader = ({
	imageInfo,
	imageSize,
	setImageInfo,
	maxImageSize,
	onImageLoad,
	onImageError,
	onImageLoadStart,
	onImageAbort,
	onExceedImageSize,
}) => {
	const handleUploadClick = event => {
		const file = event.target.files[0];
		const reader = new FileReader();
		if (!file) {
			return;
		}
		reader.readAsDataURL(file);

		reader.onloadstart = e => {
			setImageInfo({ state: 'doing', path: defaultPreview });
			onImageLoadStart && onImageLoadStart(e);
		};
		reader.onload = e => {
			if (e.total > maxImageSize * BYTE_PER_MB) {
				setImageInfo({ state: 'error', path: defaultPreview });
				onExceedImageSize(e);
				return;
			}
			setImageInfo({ state: 'done', path: e.target.result });
			onImageLoad && onImageLoad(e);
		};
		reader.onerror = error => {
			setImageInfo({ state: 'error', path: defaultPreview });
			onImageError && onImageError(error);
		};
		reader.onabort = error => {
			setImageInfo({ state: 'error', path: defaultPreview });
			onImageAbort && onImageAbort(error);
		};
	};

	return (
		<Grid sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }} container>
			<Grid item>
				<CustomImage state={imageInfo.state} path={imageInfo.path} imageSize={imageSize} />
				<CircularProgress style={{ display: imageInfo.state === 'doing' ? '' : 'none' }} color="secondary" size={100} />
			</Grid>
			<label htmlFor="contained-button-file">
				<Button disabled style={{ marginTop: '10px' }} variant="outlined" color="success" component="span">
					업데이트 예정
					<Input
						sx={{ display: 'none' }}
						disabled
						type="file"
						inputProps={{ accept: 'image/png, image/jpg, image/jpeg' }}
						id="contained-button-file"
						onInput={handleUploadClick}
					/>
				</Button>
			</label>
		</Grid>
	);
};

ImageUploader.propTypes = {
	imageInfo: PropTypes.shape({
		path: PropTypes.string.isRequired,
		state: PropTypes.oneOf(['done', 'doing', 'init', 'error']).isRequired,
	}).isRequired,
	setImageInfo: PropTypes.func.isRequired,
	maxImageSize: PropTypes.number.isRequired,
	imageSize: PropTypes.shape({
		width: PropTypes.string,
		height: PropTypes.string,
	}),
	onExceedImageSize: PropTypes.func.isRequired,
	onImageLoad: PropTypes.func,
	onImageError: PropTypes.func,
	onImageLoadStart: PropTypes.func,
	onImageAbort: PropTypes.func,
};

export default ImageUploader;
