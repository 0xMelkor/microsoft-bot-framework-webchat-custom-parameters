# Web chat custom parameters via Directline API
This repo shares knowledge about sending custom parameters from a Microsoft Bot Framework web chat to the server side bot.
It uses the DirectLine [backchannel](https://github.com/Microsoft/BotFramework-WebChat#the-backchannel) to convey information.

## Client side

Send the custom parameter
```
botConnection.postActivity({
                    type: "event",
                    value: params['customArg'],
                    from: {id: params['userid']},
                    name: "customArgName"
                })
                .subscribe(id => console.log("YOUR CUSTOM ARG HAS BEEN SENT"));


```

## Bot side
**How do we map custom parameters to the user's session?**
Our bot will have a object that stores pairs like <conversationId, customArg>
```
// Will store techical info received from the backchannel
var conversationMap = {};
```

**How do we track custom parameters for a given session?**
Each ```session``` is relative to a ```conversation``` object. 
```event``` objects are related to a ```conversation``` object as well
```
/**
 * Gets "custom args" from the webchat backchannel 
 * This info is send from the webchat as soon as it gets loaded
 **/
bot.on("event", function (event) {
    if (event.name === "customArgName") {
        // Get conversation id
        var conversationId = event.address.conversation.id
        // Store custom argument for the current conversation
        conversationMap[conversationId] = event.value;
    }
});
```
```
/**
* Shows how to get custom parameters for the current session
**/
bot.dialog('/', function(session){
  var conversationId = session.message.address.conversation.id;
  // GET THE CUSTOM ARGUMENT FOR THIS SESSION
  var customArg = conversationMap[conversationId];
});
```

## Remember to freeup resources on session end

### Client side
```
/**
 * When window unloads send endOfConversation 
 * activity to freeup server resources
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
```

### Bot side
```
bot.on('endOfConversation', function(event){
    // Sent from the client when the chat window gets unloaded
    // When conversation ends we must remove the conversationMap key
    var conversationId = event.address.conversation.id;
    delete conversationMap[conversationId];
});
```

