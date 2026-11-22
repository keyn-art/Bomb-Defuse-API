const { Router } = require('express');
const controller = require('../controllers/game-session.controller');
const rules = require('../validators/game-session.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');
const playerController = require('../controllers/player.controller');
const playerRules = require('../validators/player.validator');

const router = Router();

router.post('/', requireUser('HOST', 'ADMIN'), rules.createRules, validate, controller.create);
router.get('/:code', rules.codeParam, validate, controller.get);
router.patch('/:code', requireUser('HOST', 'ADMIN'), rules.statusRules, validate, controller.changeStatus);
router.post('/:code/players', requireUser(), playerRules.joinRules, validate, playerController.join);
router.get('/:code/players', rules.codeParam, validate, playerController.list);

module.exports = router;