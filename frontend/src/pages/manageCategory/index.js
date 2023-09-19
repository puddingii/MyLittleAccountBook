import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import CategoryManager from './CategoryManager';

const ManageCategory = () => {
	const [items, setItems] = useState(0);

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			<Grid item xs={6} md={6} lg={6}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">메인 카테고리</Typography>
					</Grid>
				</Grid>
				<MainCard sx={{ mt: 2 }} content={false}>
					<Box sx={{ p: 3, pb: 0 }}>
						<Stack spacing={2}>
							<Typography variant="h6" color="textSecondary">
								This Week Statistics
							</Typography>
							<Typography variant="h3">$7,650</Typography>
						</Stack>
					</Box>
				</MainCard>
			</Grid>
			<Grid item xs={6} md={6} lg={6}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">서브 카테고리</Typography>
					</Grid>
					<Grid item />
				</Grid>
				<CategoryManager
					key={'subCategory'}
					list={Array.from({ length: 20 }, (_, idx) => ({ name: `하윙${idx}` }))}
					setList={() => {}}
					inputLabelName="누구의 서브 카테고리"
				/>
			</Grid>
		</Grid>
	);
};

export default ManageCategory;
