import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';

import createGroupImage from 'assets/images/home/createGroup.png';
import editAccountBookImage from 'assets/images/home/editAccountBook.png';
import editCategoryImage from 'assets/images/home/editCategory.png';
import editProfile from 'assets/images/home/editProfile.png';
import inviteImage from 'assets/images/home/invite.png';
import mainImage from 'assets/images/home/main.png';
import writeImage from 'assets/images/home/write.png';

const ImageBackdrop = styled('div')(({ theme }) => ({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	background: '#000',
	opacity: 0.5,
	transition: theme.transitions.create('opacity'),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
	position: 'relative',
	display: 'block',
	padding: 0,
	borderRadius: 0,
	height: '40vh',
	[theme.breakpoints.down('md')]: {
		width: '100% !important',
		height: 100,
	},
	'&:hover': {
		zIndex: 1,
	},
	'&:hover .imageBackdrop': {
		opacity: 0.15,
	},
	'&:hover .imageMarked': {
		opacity: 0,
	},
	'&:hover .imageTitle': {
		border: '4px solid currentColor',
	},
	'& .imageTitle': {
		position: 'relative',
		padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
	},
	'& .imageMarked': {
		height: 3,
		width: 18,
		background: theme.palette.common.white,
		position: 'absolute',
		bottom: -2,
		left: 'calc(50% - 9px)',
		transition: theme.transitions.create('opacity'),
	},
}));

const images = [
	{
		url: mainImage,
		title: 'Today 요약',
		width: '50%',
	},
	{
		url: writeImage,
		title: '가계부 작성',
		width: '50%',
	},
	{
		url: editAccountBookImage,
		title: '가계부 정보 수정',
		width: '24%',
	},
	{
		url: editCategoryImage,
		title: '카테고리 수정',
		width: '38%',
	},
	{
		url: editProfile,
		title: '유저정보 수정',
		width: '38%',
	},
	{
		url: inviteImage,
		title: '유저초대',
		width: '40%',
	},
	{
		url: createGroupImage,
		title: '새 그룹 만들기',
		width: '20%',
	},
	{
		url: 'https://images.unsplash.com/photo-1518136247453-74e7b5265980?auto=format&fit=crop&w=400',
		title: '추가 예정',
		width: '40%',
	},
];

const ProductCategories = () => {
	return (
		<Container component="section" sx={{ mt: 8, mb: 4 }}>
			<Typography variant="h4" marked="center" align="center" component="h2">
				미리 보기
			</Typography>
			<Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap' }}>
				{images.map(image => (
					<ImageIconButton
						key={image.title}
						style={{
							width: image.width,
							border: '1px solid #363636',
						}}
					>
						<Box
							sx={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								backgroundSize: 'cover',
								backgroundPosition: 'center 40%',
								backgroundImage: `url(${image.url})`,
							}}
						/>
						<ImageBackdrop className="imageBackdrop" />
						<Box
							sx={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'common.white',
							}}
						>
							<Typography component="h3" variant="h6" color="inherit" className="imageTitle">
								{image.title}
								<div className="imageMarked" />
							</Typography>
						</Box>
					</ImageIconButton>
				))}
			</Box>
		</Container>
	);
};

export default ProductCategories;
