import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name) => (
  <Iconify icon={name} sx={{ width: 24, height: 24 }} />
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
    title: 'Sảnh danh vọng',
    path: '/hall-of-fame',
    icon: icon('line-md:star-pulsating-filled-loop'),
    type: 'authenticated',
  },
  {
    title: 'Lịch sử nạp/rút',
    path: '/transaction-history',
    icon: icon('line-md:arrows-vertical'),
    type: 'authenticated'
  },
  {
    title: 'Mini Game',
    path: '/mini-game',
    icon: icon('line-md:emoji-smile-twotone'),
    type: 'authenticated'
  }
];

export default navConfig;
