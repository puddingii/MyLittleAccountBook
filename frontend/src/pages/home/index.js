import { Fragment } from 'react';

import ProductCategories from './modules/views/ProductCategories';
import AppFooter from './modules/views/AppFooter';
import ProductHero from './modules/views/ProductHero';
import ProductValues from './modules/views/ProductValues';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';

const Index = () => {
	return (
		<Fragment>
			<AppAppBar />
			<ProductHero />
			<ProductValues />
			<ProductCategories />
			<ProductHowItWorks />
			<AppFooter />
		</Fragment>
	);
};

export default withRoot(Index);
