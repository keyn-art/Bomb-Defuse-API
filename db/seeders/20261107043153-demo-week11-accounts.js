'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { username: 'host_one', school_id: '2099-0001', full_name: 'Demo Host One',
        email: 'host.one@bombdefuse.test', role: 'HOST', created_at: new Date('2026-01-02T10:00:00Z') },
      { username: 'host_two', school_id: '2099-0002', full_name: 'Demo Host Two',
        email: 'host.two@bombdefuse.test', role: 'HOST', created_at: new Date('2026-01-02T10:01:00Z') },
      { username: 'player_one', school_id: '2099-1001', full_name: 'Demo Player One',
        email: 'player.one@bombdefuse.test', role: 'PLAYER', created_at: new Date('2026-01-02T10:02:00Z') },
      { username: 'player_two', school_id: '2099-1002', full_name: 'Demo Player Two',
        email: 'player.two@bombdefuse.test', role: 'PLAYER', created_at: new Date('2026-01-02T10:03:00Z') },
      { username: 'player_three', school_id: '2099-1003', full_name: 'Demo Player Three',
        email: 'player.three@bombdefuse.test', role: 'PLAYER', created_at: new Date('2026-01-02T10:04:00Z') },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'users',
      { school_id: { [Sequelize.Op.in]: ['2099-0001', '2099-0002', '2099-1001', '2099-1002', '2099-1003'] } },
      {}
    );
  },
};