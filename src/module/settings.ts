import { debug, log, setDebugLevel, warn, i18n } from '../health-monitor';
//@ts-ignore
import ColorSetting from '../../colorsettings/colorSetting.js';
export const MODULE_NAME = 'health-monitor';

export const registerSettings = function () {

  game.settings.register(MODULE_NAME, 'npc_name', {
		name: 'Hide name of npc/monster',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Hide name of npc/monster'
	});
	game.settings.register(MODULE_NAME, 'GM_Vision', {
		name: 'GM Vision',
		default: true,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Display notification only to GM'
	});
	game.settings.register(MODULE_NAME, 'show_to_players_the_player_updates', {
		name: 'Show to players the player updates',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Show to players the player updates'
	});
	// game.settings.register(MODULE_NAME, 'Enable_Disable', {
	// 	name: 'Enable/Disable',
	// 	default: true,
	// 	type: Boolean,
	// 	scope: 'world',
	// 	config: true,
	// 	hint: 'Enable/Disable chat messages'
	// });

}

// function setup(templateSettings) {
// 	templateSettings.settings().forEach(setting => {
// 		let options = {
// 			name: i18n(templateSettings.name()+"."+setting.name+'.Name'),
// 			hint: i18n(`${templateSettings.name()}.${setting.name}.Hint`),
// 			scope: setting.scope,
// 			config: true,
// 			default: setting.default,
// 			type: setting.type,
// 			choices: {}
// 		};
// 		if (setting.choices) options.choices = setting.choices;
// 		game.settings.register(templateSettings.name(), setting.name, options);
// 	});
// }
