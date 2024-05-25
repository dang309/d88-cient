import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MyTableRow({ row, handleClick }) {
  const {
    firstTeamName,
    firstTeamFlag,
    secondTeamName,
    secondTeamFlag,
    date,
    time,
    handicap,
    overUnder,
  } = row;
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} >
        <TableCell>
          <Stack direction='row' alignItems='center' spacing={2}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar alt={firstTeamName} src={firstTeamFlag} />
                <Typography variant="subtitle2" noWrap>
                  {firstTeamName}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar alt={secondTeamName} src={secondTeamFlag} />
                <Typography variant="subtitle2" noWrap>
                  {secondTeamName}
                </Typography>
              </Stack>
            </Stack>

            <Stack>
              {date} {time}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={2}>
            <Label>{handicap.threshold}</Label>
            <Stack spacing={2}>
              <Label>{handicap.firstTeamWinRate}</Label>
              <Label>{handicap.secondTeamWinRate}</Label>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={2}>
            <Label>{overUnder.threshold}</Label>
            <Stack spacing={2}>
              <Label>{overUnder.overWinRate}</Label>
              <Label>{overUnder.underWinRate}</Label>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

MyTableRow.propTypes = {
  row: PropTypes.object,
  handleClick: PropTypes.func,
};
