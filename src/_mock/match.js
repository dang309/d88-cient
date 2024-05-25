import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const matches = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(),
  firstTeamName: faker.location.country(),
  firstTeamFlag: faker.image.avatar(),
  secondTeamName: faker.location.country(),
  secondTeamFlag: faker.image.avatar(),
  date: '15/06',
  time: '02:00',
  handicap: {
    threshold: faker.number.float({
        min: 0,
        max: 5,
        multipleOf: 0.5
    }),
    firstTeamWinRate: faker.number.float({
        min: 0,
        max: 5,
        multipleOf: 0.5
    }),
    secondTeamWinRate: faker.number.float({
        min: 0,
        max: 5,
        multipleOf: 0.5
    })

  },
  overUnder: {
    threshold: faker.number.float({
        min: 0,
        max: 5,
        multipleOf: 0.5
    }),
    overWinRate: faker.number.float({
        min: 0,
        max: 5,
        multipleOf: 0.5
    }),
    underWinRate: faker.number.float({
        min: 0,
        max: 5,
        multipleOf: 0.5
    })
  }
}));
