import { Alert, Grid, Snackbar, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import CategoryManager from './CategoryManager';
import { useGetCategoryQuery } from 'queries/accountBook/accountBookQuery';

const ManageCategory = () => {
	const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
	const [categoryList, setCategoryList] = useState([]);
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });
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

	const handleCloseSnackbar = useCallback(() => {
		setSnackbarInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
	}, [setSnackbarInfo]);

	const updateMainCategory = useCallback(
		/** @param {'add' | 'edit' | 'delete'} type  */
		(info, type) => {
			const updateManager = {
				/**
				 * id, childList의 경우 Server에서 받은 데이터로 설정해야 함
				 * @param { {id: number; name: string; parentId: null; childList: Array<{id: number; name: string; parentId: number;}>}} info
				 */
				add: info => {
					setCategoryList(beforeList => {
						const copiedList = [...beforeList];
						copiedList.push(info);

						return copiedList;
					});
					setSnackbarInfo({ isOpen: true, message: '추가되었습니다.', severity: 'success' });
				},
				/**
				 * @param { {id: number; name: string; }} info
				 */
				edit: info => {
					setCategoryList(beforeList => {
						const copiedList = [...beforeList];
						const idx = copiedList.findIndex(beforeInfo => beforeInfo.id === info.id);
						if (idx === -1) {
							return copiedList;
						}
						copiedList[idx] = { ...copiedList[idx], ...info };

						return copiedList;
					});
					setSnackbarInfo({ isOpen: true, message: '수정되었습니다.', severity: 'success' });
				},
				/**
				 * @param {{id: number;}} info
				 */
				delete: info => {
					setCategoryList(beforeList => {
						return beforeList.filter(beforeInfo => beforeInfo.id !== info.id);
					});
					setSnackbarInfo({ isOpen: true, message: '삭제되었습니다.', severity: 'success' });
				},
			};

			return updateManager[type](info);
		},
		[setCategoryList, setSnackbarInfo],
	);

	const updateSubCategory = useCallback(
		/** @param {'add' | 'edit' | 'delete'} type  */
		(info, type) => {
			const getMainCategoryIndex = (list, parentId) => {
				return list.findIndex(mainInfo => mainInfo.id === parentId);
			};
			const updateManager = {
				/**
				 * id의 경우 Server에서 받은 데이터로 설정해야 함
				 * @param { {id: number; name: string; parentId: number; }} info
				 */
				add: info => {
					setCategoryList(beforeList => {
						const copiedList = [...beforeList];
						const idx = getMainCategoryIndex(copiedList, info.parentId);

						if (idx === -1) {
							return copiedList;
						}
						copiedList[idx].childList.push(info);

						return copiedList;
					});
					setSnackbarInfo({ isOpen: true, message: '추가되었습니다.', severity: 'success' });
				},
				/**
				 * @param { {id: number; name: string; parentId: number; }} info
				 */
				edit: info => {
					setCategoryList(beforeList => {
						const copiedList = [...beforeList];
						const idx = getMainCategoryIndex(copiedList, info.parentId);
						if (idx === -1) {
							return copiedList;
						}

						const childIdx = copiedList[idx].childList.findIndex(childInfo => childInfo.id === info.id);
						if (childIdx === -1) {
							return copiedList;
						}

						copiedList[idx].childList[childIdx] = { ...copiedList[idx].childList[childIdx], ...info };

						return copiedList;
					});
					setSnackbarInfo({ isOpen: true, message: '수정되었습니다.', severity: 'success' });
				},
				/**
				 * @param {{id: number;}} info
				 */
				delete: info => {
					setCategoryList(beforeList => {
						const copiedList = [...beforeList];
						const idx = getMainCategoryIndex(copiedList, info.parentId);
						if (idx === -1) {
							return copiedList;
						}

						copiedList[idx].childList = copiedList[idx].childList.filter(childInfo => childInfo.id !== info.id);

						return copiedList;
					});
					setSnackbarInfo({ isOpen: true, message: '삭제되었습니다.', severity: 'success' });
				},
			};

			return updateManager[type](info);
		},
		[setCategoryList, setSnackbarInfo],
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
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackbarInfo.isOpen}
				onClose={handleCloseSnackbar}
				autoHideDuration={5000}
				key={'CreateGroupModalSnackbar'}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
					{snackbarInfo.message}
				</Alert>
			</Snackbar>
			<Grid item xs={6} md={6} lg={6}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">메인 카테고리</Typography>
					</Grid>
				</Grid>
				<CategoryManager
					key="mainCategory"
					list={categoryList}
					setList={updateMainCategory}
					inputLabelName="메인 카테고리"
					selectedCategoryIndex={selectedCategoryIndex}
					maxLength={15}
					setSnackbarInfo={setSnackbarInfo}
					accountBookId={accountBookId}
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
					setList={updateSubCategory}
					inputLabelName={`${categoryList[selectedCategoryIndex]?.name ?? ''}의 서브 카테고리`}
					maxLength={10}
					setSnackbarInfo={setSnackbarInfo}
					accountBookId={accountBookId}
					parentId={categoryList[selectedCategoryIndex]?.id ?? -1}
				/>
			</Grid>
		</Grid>
	);
};

export default ManageCategory;
