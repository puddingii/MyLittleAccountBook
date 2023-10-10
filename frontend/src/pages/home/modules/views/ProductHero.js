import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';

import backgroundImage from 'assets/images/home/mainLogo.jpg';

const ProductHero = () => {
	return (
		<ProductHeroLayout
			sxBackground={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundColor: '#7fc7d9',
				backgroundPosition: 'center',
			}}
		>
			<img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" />
			<Typography color="inherit" align="center" variant="h2" marked="center">
				WA! 그룹 가계부?!
			</Typography>
			<Typography color="inherit" align="center" variant="h5" sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}>
				혼자서 관리하는 가계부 따윈 저리가라! 이젠 그룹 가계부다!
			</Typography>
			<Button color="secondary" variant="contained" size="large" component="a" href="/login" sx={{ minWidth: 200 }}>
				지금 당장 맛보러 가기 {'>'}
			</Button>
			<Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
				가계부를 적어 갓생살자! 끼얏호우!
			</Typography>
		</ProductHeroLayout>
	);
};

export default ProductHero;
