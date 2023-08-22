import { useState } from 'react';

// material-ui
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';

// project import
import MainCard from 'components/MainCard';

// assets
import WriterCard from './WriterCard';
import TableManager from './TableManager';
import { useGetCategoryQuery } from 'queries/accountBook/accountBookQuery';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const SpendingAndIncomeManageBoard = () => {
	const [writeType, setWriteType] = useState('nf');
	const [manageType, setManageType] = useState('nf');
	const param = useParams();
	const accountBookId = parseInt(param?.id ?? -1, 10);

	const { data: response } = useGetCategoryQuery(accountBookId);
	const categoryList = response?.data ?? [];

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			<Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

			<Grid item xs={12} sm={12} md={12} lg={12}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">수입/지출 기록</Typography>
					</Grid>
					<Grid item />
					<Grid item>
						<Stack direction="row" alignItems="center" spacing={0}>
							<Button
								size="small"
								onClick={() => setWriteType('nf')}
								color={writeType === 'nf' ? 'primary' : 'secondary'}
								variant={writeType === 'nf' ? 'outlined' : 'text'}
							>
								변동
							</Button>
							<Button
								size="small"
								onClick={() => setWriteType('f')}
								color={writeType === 'f' ? 'primary' : 'secondary'}
								variant={writeType === 'f' ? 'outlined' : 'text'}
							>
								고정
							</Button>
						</Stack>
					</Grid>
				</Grid>
				<WriterCard accountBookId={accountBookId} writeType={writeType} categoryList={categoryList} />
			</Grid>

			<Grid item xs={12} md={12} lg={12}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">수입/지출 관리</Typography>
					</Grid>
					<Grid item />
					<Grid item>
						<Stack direction="row" alignItems="center" spacing={0}>
							<Button
								size="small"
								onClick={() => setManageType('nf')}
								color={manageType === 'nf' ? 'primary' : 'secondary'}
								variant={manageType === 'nf' ? 'outlined' : 'text'}
							>
								변동
							</Button>
							<Button
								size="small"
								onClick={() => setManageType('f')}
								color={manageType === 'f' ? 'primary' : 'secondary'}
								variant={manageType === 'f' ? 'outlined' : 'text'}
							>
								고정
							</Button>
						</Stack>
					</Grid>
				</Grid>
				<MainCard sx={{ mt: 2 }} content={false}>
					<TableManager manageType={manageType} accountBookId={accountBookId} categoryList={categoryList} />
				</MainCard>
			</Grid>
		</Grid>
	);
};

export default SpendingAndIncomeManageBoard;
