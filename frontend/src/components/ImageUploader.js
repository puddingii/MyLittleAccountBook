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
	imageRef,
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
			if (!e.target.result) {
				setImageInfo({ state: 'error', path: defaultPreview });
				onImageError && onImageError(new Error('onload result is undefined'));
				return;
			}
			setImageInfo({ state: 'done', path: e.target.result });
			onImageLoad && onImageLoad(e, file);
		};
		reader.onerror = error => {
			setImageInfo({ state: 'error', path: defaultPreview });
			onImageError && onImageError(error);
		};
		reader.onabort = error => {
			setImageInfo({ state: 'error', path: defaultPreview });
			onImageAbort && onImageAbort(error);
		};
		reader.readAsDataURL(file);
	};

	return (
		<Grid
			sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
			container
		>
			<Grid item>
				<CustomImage state={imageInfo.state} path={imageInfo.path} imageSize={imageSize} />
				<CircularProgress style={{ display: imageInfo.state === 'doing' ? '' : 'none' }} color="secondary" size={100} />
			</Grid>
			<label htmlFor="contained-button-file">
				<Button style={{ marginTop: '10px' }} variant="outlined" color="success" component="span" type="submit">
					변경하기
					<Input
						ref={imageRef}
						sx={{ display: 'none' }}
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
	imageRef: PropTypes.any,
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
