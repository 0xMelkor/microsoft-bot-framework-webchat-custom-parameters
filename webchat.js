/*-----------------------------------------------------------------------------
          __                 __    
  _______/  |______    ____ |  | __
 /  ___/\   __\__  \ _/ ___\|  |/ /
 \___ \  |  |  / __ \\  \___|    < 
/____  > |__| (____  /\___  >__|_ \
     \/            \/     \/     \/
                             .__                         
  ______ _____ _____    _____|  |__   ___________  ______
 /  ___//     \\__  \  /  ___/  |  \_/ __ \_  __ \/  ___/
 \___ \|  Y Y  \/ __ \_\___ \|   Y  \  ___/|  | \/\___ \ 
/____  >__|_|  (____  /____  >___|  /\___  >__|  /____  >
     \/      \/     \/     \/     \/     \/           \/ 

@authors: Andrea Simeoni <andreasimeoni84@gmail.com>
-----------------------------------------------------------------------------*/
var MyWebChat = function(params) {

    // Webchat client args
    var user = {
        id: params['userid'] || 'userid',
        name: params["username"] || 'username'
    };

    var bot = {
        id: params['botid'] || 'botid',
        name: params["botname"] || 'botname'
    };

    // Create Directline connection and application
    var botConnection = new BotChat.DirectLine({
        secret: params['s'],
        webSocket: params['webSocket'] && params['webSocket'] === "true" // defaults to true
    });

    BotChat.App({
        botConnection: botConnection,
        user: user,
        bot: bot
    }, document.getElementById(params['targetElement']));

    this.loadApplication = function() {
        /**
         * Sends store information to the chatbot 
         **/
        var sendCustomArg = function() {
            console.log('post message');
            botConnection
                .postActivity({
                    type: "event",
                    value: params['customArg'],
                    from: {
                        id: params['userid']
                    },
                    name: "baseStore"
                })
                .subscribe(id => console.log("YOUR CUSTOM ARG HAS BEEN SENT"));
        }

        sendCustomArg();

        /**
         * When window unloads send endOfConversation 
         * This event is catched by the bot that can freeup server resources
         **/
        window.onbeforeunload = function() {
            botConnection
                .postActivity({
                    type: "endOfConversation",
                    from: {
                        id: params['userid']
                    }
                })
                .subscribe(id => console.log("endOfConversation ack"));
        };
    };

    return this;
};
