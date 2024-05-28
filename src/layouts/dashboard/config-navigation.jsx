import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name) => (
  <Iconify icon={name} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Lịch thi đấu',
    path: '/',
    icon: icon('line-md:calendar'),
    type: 'public'
  },
  {
    title: 'Lịch sử cược',
    path: '/bet-history',
    icon: icon('line-md:clipboard-list-twotone'),
    type: 'authenticated'
  },
  {
    title: 'Lịch sử nạp/rút',
    path: '/transaction-history',
    icon: icon('line-md:arrows-vertical'),
    type: 'authenticated'
  }
];

export default navConfig;
