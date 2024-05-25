import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Lịch thi đấu',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Lịch sử cược',
    path: '/bet-history',
    icon: icon('ic_user'),
  }
];

export default navConfig;
