import { warn, error, debug, i18n } from "../health-monitor";
import { MODULE_NAME } from "./settings";

export let readyHooks = async () => {

// setup all the hooks

//spam in chat if token (NPC) is updated

Hooks.on("preUpdateToken", async (scene, tokenData, update, options) => {

	let gm = game.user === game.users.find((u) => u.isGM && u.active)
  if (!gm && game.settings.get(MODULE_NAME, 'GM_Vision')){
    return;
  }

	let hp = getProperty(update, "actorData.data.attributes.hp");

	if (hp !== undefined) {
		let actor = game.actors.get(tokenData.actorId)
		let data = {
			actorHP: getProperty(tokenData, "actorData.data.attributes.hp.value"),
			actorTemp: getProperty(tokenData, "actorData.data.attributes.hp.temp"),
			updateHP: update.actorData.data.attributes.hp.value,
			updateTemp: getProperty(update, "actorData.data.attributes.hp.temp")
		}
		if(isNaN(data.actorTemp)){
      data.actorTemp = 0;
    }
		if (isNaN(data.updateTemp)){
      data.updateTemp = data.actorTemp;
    }
		if(isNaN(data.updateHP)){
      data.updateHP = data.actorHP;
    }

		let change = (data.updateHP + data.updateTemp) - (data.actorHP + data.actorTemp);
  
    let resWeakImmun = "";
    if(tokenData?.actorData?.data?.traits){
      resWeakImmun += tokenData.actorData.data.traits.di.value.length == 0 ? '': '<br/>Immunity:' +tokenData.actorData.data.traits.di.value.toString();
      resWeakImmun += tokenData.actorData.data.traits.dr.length == 0 ? '': '<br/>Resistance:' +Object.values(tokenData.actorData.data.traits.dr.value).map((a:any)=> a).join(",");
      resWeakImmun += tokenData.actorData.data.traits.dv.length == 0 ? '': '<br/>Vulnerable:' +Object.values(tokenData.actorData.data.traits.dv.value).map((a:any)=> a).join(",");
    }
		MessageCreate(
      change, 
      actor.data.name, 
      false, 
      game.settings.get(MODULE_NAME, 'npc_name'),
      resWeakImmun 
    );
    
	}
});

//spam in chat if the actor is updated

Hooks.on('preUpdateActor', async (actor, update, options, userId) => {

	let gm = game.user === game.users.find((u) => u.isGM && u.active)
  if (!gm && game.settings.get(MODULE_NAME, 'GM_Vision')){
    return;
  }

	let hp = getProperty(update, "data.attributes.hp");

	if (hp !== undefined) {
		let data = {
			actor: actor,
			actorHP: actor.data.data.attributes.hp.value,
			actorTemp: actor.data.data.attributes.hp.temp,
			updateHP: update.data.attributes.hp.value,
			updateTemp: getProperty(update, "data.attributes.hp.temp"),
		};
		if (isNaN(data.updateTemp)) {
      data.updateTemp = data.actorTemp;
    }
		if(isNaN(data.updateHP)) {
      data.updateHP = data.actorHP;
    }

		let change = (data.updateHP + data.updateTemp)- (data.actorHP + data.actorTemp);

    let resWeakImmun = "";
    if(actor?.data?.data?.traits){
      resWeakImmun += actor.data.data.traits.di.value.length == 0 ? '': '<br/>Immunity:' + actor.data.data.traits.di.value.toString();
      resWeakImmun += actor.data.data.traits.dr.length == 0 ? '': '<br/>Resistance:' + Object.values(actor.data.data.traits.dr.value).map((a:any)=> a).join(",");
      resWeakImmun += actor.data.data.traits.dv.length == 0 ? '': '<br/>Vulnerable:' + Object.values(actor.data.data.traits.dv.value).map((a:any)=> a).join(",");
    }
		MessageCreate(
      change, 
      data.actor.data.name, 
      true, 
      !game.settings.get(MODULE_NAME, 'show_to_players_the_player_updates'),
      resWeakImmun 
    );
	}
});

}

export let initHooks = () => {
  warn("Init Hooks processing");


}

// This is for chat styling

function MessageCreate(hpChange, name, isPlayer, hideName, resWeakImmun ) {

  let content = "";
	if (hpChange > 0) {
		if (hideName && !isPlayer) {
			content = '<span class="hm_messageheal">' + ' Unknown entity' + ' heals ' + hpChange + ' damage ' +resWeakImmun +'</span>'
		}
		else {
			content = '<span class="hm_messageheal">' + name + ' heals ' + hpChange + ' damage ' +resWeakImmun +'</span>'
		}
	}
	if (hpChange < 0) {
		hpChange = -hpChange
		if (hideName && !isPlayer) {
			content = '<span class="hm_messagetaken">' + ' Unknown entity' + ' takes ' + hpChange + ' damage ' +resWeakImmun +'</span>'
		}
		else {
			content = '<span class="hm_messagetaken">' + name + ' takes ' + hpChange + ' damage ' +resWeakImmun +'</span>'
		}
	}
	let recipient;
	if (game.settings.get(MODULE_NAME, 'GM_Vision')){
		recipient = game.users.find((u) => u.isGM && u.active).id;
	}
	let chatData = {
		type: 4,
		user: recipient,
		speaker: { alias: "Health Monitor" },
		content: content,
		whisper: [recipient]

	};

	//chatData.whisper = game.users.entities.filter(u => u.isGM).map(u => u._id);

	ChatMessage.create({},chatData);
	// if((chatData)!== '' && game.settings.get(MODULE_NAME, 'Enable_Disable')) {
	// 	ChatMessage.create(chatData, {});	
	// }
}

Hooks.on("renderChatMessage", (app, html, data) => {
	if (html.find(".hm_messageheal").length) {
		html.css("background", "#06a406");
		html.css("text-shadow", "-1px -1px 0 #000 , 1px -1px 0 #000 , -1px 1px 0 #000 , 1px 1px 0 #000");
		html.css("color", "white");
		html.css("text-align", "center");
		html.css("font-size", "12px");
		html.css("margin", "2px");
		html.css("padding", "2px");
		html.css("border", "2px solid #191813d6");
		html.find(".message-sender").text("");
		html.find(".message-metadata")[0].style.display = "none";
	}
	if (html.find(".hm_messagetaken").length) {
		html.css("background", "#c50d19");
		html.css("text-shadow", "-1px -1px 0 #000 , 1px -1px 0 #000 , -1px 1px 0 #000 , 1px 1px 0 #000");
		html.css("color", "white");
		html.css("text-align", "center");
		html.css("font-size", "12px");
		html.css("margin", "2px");
		html.css("padding", "2px");
		html.css("border", "2px solid #191813d6");
		html.find(".message-sender").text("");
		html.find(".message-metadata")[0].style.display = "none";
	}
	
});

// Hooks.on('renderSceneControls', (controls, html) => {
// 	let gm = game.user === game.users.find((u) => u.isGM && u.active)
// 	if (gm) {
// 		const hmBtn = $(
// 		`<li class="control-tool toggle" data-control="hm" data-canvas-layer="hmlayer" title="hm Controls">
// 				<i class="fas fa-heartbeat"></i>
// 				</li>`
// 		);
// 		html.append(hmBtn);
// 		hmBtn[0].addEventListener('click', evt => {
// 			evt.stopPropagation();
// 			hmBtn.toggleClass("active");
// 			if (game.settings.get(MODULE_NAME, 'Enable_Disable')){
// 				game.settings.get(MODULE_NAME, 'Enable_Disable') = false;
// 			}else{
// 				game.settings.get(MODULE_NAME, 'Enable_Disable') = true;
// 			}
// 			//console.log(spamcontrol);
// 		});
// 	}
// });	
