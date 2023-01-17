const sleep = (milliseconds:number) => {return new Promise(resolve => setTimeout(resolve, milliseconds))};
import {stopalaListener} from './listen';
import WebSocket  from 'ws';
function login(token:string){
    stopalaListener.on("stopala",(data:string)=>{deleteMessage(data[0],data[1])})
    
    let userId=Buffer.from(token.split(".")[0], 'base64').toString()

    let socket = new WebSocket("wss://gateway.discord.gg/?v=6&encording=json");
    socket.onclose = async function(){
        login(token)
    }
    socket.onmessage = async function(event:any) {
        let ejson = JSON.parse(event.data);
        let e = JSON.stringify(event.data);
    
        let payload={
          "op":2,
          "d": {
              "token": token,
              "properties": {
                  "os": "TklHR0VSU1NTUyBJIEhBVEUgTklHR0VSUyBJIEhBVEUgVEhFTSBTTyBNVUNI",
              },
          }
      };
      if(e.includes('heartbeat_interval')){
          var interval = JSON.parse(event.data)['d']['heartbeat_interval'];
          hb(socket, interval);
          socket.send(JSON.stringify(payload));
        };
        if (ejson["t"]=="MESSAGE_CREATE") {
          if (
                ejson["d"]["content"].includes("stopala")&&
                ejson?.d?.author?.id==userId
                ){
            stopalaListener.sendEvent(ejson?.d?.channel_id,ejson?.d?.id)
        }
        }
        if (ejson["t"]=="READY"&&botStatus!==undefined) {
            socket.send(botStatus)
        }
    }
    function deleteMessage (guildId:string,messId:string) {
        fetch(`https://discord.com/api/v9/channels/${guildId}/messages/${messId}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US",
                    "authorization": token,
                    "x-debug-options": "bugReporterEnabled",
                    "x-discord-locale": "en-GB",
                    "x-super-properties": "eyJvcyI6IkxpbnV4IiwiYnJvd3NlciI6IkRpc2NvcmQgQ2xpZW50IiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X3ZlcnNpb24iOiIwLjAuMjQiLCJvc192ZXJzaW9uIjoiNi4xLjUtYXJjaDItMSIsIm9zX2FyY2giOiJ4NjQiLCJzeXN0ZW1fbG9jYWxlIjoiZW4tVVMiLCJ3aW5kb3dfbWFuYWdlciI6InVua25vd24sdW5rbm93biIsImRpc3RybyI6IlwiQXJjaCBMaW51eFwiIiwiY2xpZW50X2J1aWxkX251bWJlciI6MTY3ODg4LCJuYXRpdmVfYnVpbGRfbnVtYmVyIjpudWxsLCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ=="
                },
                "referrer": "https://discord.com/channels/@me/959583901020487681",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "DELETE",
                "mode": "cors",
                "credentials": "include"
                });
    }

    let botStatus:string;
    function customStatus(status:string) {
        botStatus=JSON.stringify(
                    {"op":3,"d":{"status":"online","activities":[{
                    "name": status,
                    "type": 0,}],
                    "since":1,"afk":false}})
        }
    return {customStatus}
}

async function hb(socket:WebSocket, interval:number){
    while(true){
        let hbpayload={
            'op': 1,
            'd': 'null'
        };
        socket.send(JSON.stringify(hbpayload));
        await sleep(interval);
    };
};
export {login}