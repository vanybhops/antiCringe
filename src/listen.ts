import EventEmitter from 'events';
class listener extends EventEmitter{
    constructor(){
        super()
    }
    sendEvent(...message:any){}
}
const stopalaListener=new listener();
stopalaListener.setMaxListeners(1)
listener.prototype.sendEvent=(...message)=>stopalaListener.emit('stopala',message);
export {stopalaListener}