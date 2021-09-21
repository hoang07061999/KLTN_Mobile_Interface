class Tracking{constructor(hooks){this.queue=[]
this.debug=hooks.debug||false
this.registeredEvents={}
hooks.handlers.bind(this)()}
setQueue(queue){this.queue=queue
return this}
processQueue(){this.queue.forEach(event=>{this.emit(event.event,event.payload)})
return this}
emit(eventName,payload){let handlers=this.registeredEvents[eventName]
if(this.debug){console.log(eventName)}
if(handlers){handlers.forEach(handler=>{try{handler({ga,fbq,gtag,},payload)}catch(err){console.error(err)}})}
return this}
on(eventName,handler){if(!Array.isArray(this.registeredEvents[eventName])){this.registeredEvents[eventName]=[]}
this.registeredEvents[eventName].push(handler)
return this}}