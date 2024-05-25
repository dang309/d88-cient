import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { Empty } from 'src/components/common';

// ----------------------------------------------------------------------

export default function MyTableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={8} sx={{ py: 2 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
            <Empty />

          <Typography variant="h6" paragraph sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Không có dữ liệu
          </Typography>

          {/* <Typography variant="body2">
            No results found for &nbsp;
            <strong>&quot;{query}&quot;</strong>.
            <br /> Try checking for typos or using complete words.
          </Typography> */}
        </Paper>
      </TableCell>
    </TableRow>
  );
}

MyTableNoData.propTypes = {
  query: PropTypes.string,
};
