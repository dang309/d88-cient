import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Empty } from 'src/components/common';

// ----------------------------------------------------------------------

export default function MyTableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={8} sx={{ py: 2 }}>
        <Empty />
      </TableCell>
    </TableRow>
  );
}

MyTableNoData.propTypes = {
  query: PropTypes.string,
};
