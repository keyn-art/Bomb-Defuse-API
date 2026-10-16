'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'demo_alice',
        role: 'player',
        created_at: new Date('2026-01-01T10:00:00Z'),
      },
      {
        username: 'demo_bob',
        role: 'player',
        created_at: new Date('2026-01-01T10:01:00Z'),
      },
      {
        username: 'demo_carla',
        role: 'player',
        created_at: new Date('2026-01-01T10:02:00Z'),
      },
      {
        username: 'demo_dylan',
        role: 'player',
        created_at: new Date('2026-01-01T10:03:00Z'),
      },
      {
        username: 'demo_host',
        role: 'host',
        created_at: new Date('2026-01-01T10:04:00Z'),
      },
    ]);
  },

async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      username: [
        'demo_alice',
        'demo_bob',
        'demo_carla',
        'demo_dylan',
        'demo_host',
      ],
    });
  },
};
