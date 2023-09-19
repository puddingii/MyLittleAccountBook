import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import CategoryManager from './CategoryManager';
import { useGetCategoryQuery } from 'queries/accountBook/accountBookQuery';

const ManageCategory = () => {
	const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
	const [categoryList, setCategoryList] = useState([]);
	const param = useParams();
	const accountBookId = parseInt(param?.id ?? -1, 10);

	const { refetch } = useGetCategoryQuery(
		{ accountBookId },
		{
			onSuccess: response => {
				setCategoryList(response?.data ?? []);
			},
		},
	);

	const handleClickMainCategory = index => {
		setSelectedCategoryIndex(index);
	};

	useEffect(() => {
		if (accountBookId) {
			refetch();
		}
	}, [refetch, accountBookId]);

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			<Grid item xs={6} md={6} lg={6}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">메인 카테고리</Typography>
					</Grid>
				</Grid>
				<CategoryManager
					key="mainCategory"
					list={categoryList}
					setList={() => {}}
					inputLabelName="메인 카테고리"
					selectedCategoryIndex={selectedCategoryIndex}
					onClickCategory={handleClickMainCategory}
				/>
			</Grid>
			<Grid item xs={6} md={6} lg={6}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">서브 카테고리</Typography>
					</Grid>
					<Grid item />
				</Grid>
				<CategoryManager
					key="subCategory"
					list={categoryList[selectedCategoryIndex]?.childList ?? []}
					setList={() => {}}
					inputLabelName={`${categoryList[selectedCategoryIndex]?.name ?? ''}의 서브 카테고리`}
					selectedCategoryIndex={-1}
				/>
			</Grid>
		</Grid>
	);
};

export default ManageCategory;
