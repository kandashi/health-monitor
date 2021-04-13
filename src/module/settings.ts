import { debug, log, setDebugLevel, warn, i18n } from '../health-monitor';
//@ts-ignore
import ColorSetting from '../../colorsettings/colorSetting.js';
export const MODULE_NAME = 'health-monitor';

/**
 * Because typescript doesn’t know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it’s typed as declare let canvas: Canvas | {ready: false}.
 * That’s why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because a „no canvas“ mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
 export function getCanvas(): Canvas {
	if (!(canvas instanceof Canvas) || !canvas.ready) {
		throw new Error("Canvas Is Not Initialized");
	}
	return canvas;
}

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
  game.settings.register(MODULE_NAME, 'showImmunitiesAndResistances', {
		name: 'Show Immunities and Resistances',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Show Immunities and Resistances'
	});

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
