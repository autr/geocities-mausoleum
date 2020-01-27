function scale(t,e,i,s,o){return(t-e)*(o-s)/(i-e)+s}THREE.FirstPersonControls=function(t,e){function i(t){t.preventDefault()}function s(t,e){return function(){e.apply(t,arguments)}}this.object=t,this.target=new THREE.Vector3(0,0,0),this.disabled=!1,this.minimumHeight=this.object.position.y,this.maximumHeight=this.object.position.y+100,this.targetPositionY=this.object.position.y+10,this.heightDriftSpeed=4e-4,this.domElement=void 0!==e?e:document,this.enabled=!0,this.movementSpeed=6,this.lookSpeed=.06,this.lookVertical=!0,this.autoForward=!1,this.activeLook=!0,this.heightSpeed=!1,this.heightCoef=1,this.heightMin=0,this.heightMax=1,this.constrainVertical=!1,this.verticalMin=0,this.verticalMax=Math.PI,this.autoSpeedFactor=0,this.mouseX=0,this.mouseY=0,this.lat=20,this.lon=0,this.phi=0,this.theta=0,this.moveForward=!1,this.moveBackward=!1,this.moveLeft=!1,this.moveRight=!1,this.mouseDragOn=!1,this.viewHalfX=0,this.viewHalfY=0,this.wheelDelta=0,this.realMouseY=0,this.mouseXSmoothed=0,this.mouseYSmoothed=0,this.smoothHeightDrift=0,this.smoothMoveForward=0,this.smoothMoveBackward=0,this.smoothMoveLeft=0,this.smoothMoveRight=0,this.centerRect=40,this.domElement!==document&&this.domElement.setAttribute("tabindex",-1),renderer.domElement.addEventListener("mousewheel",(function(t){var e=200;_this.verticalDelta=THREE.Math.mapLinear(t.wheelDelta,-200,200,-.2,.2),_this.verticalDelta>.2&&(_this.verticalDelta=.2),_this.verticalDelta<-.2&&(_this.verticalDelta=-.2),_this.wheelDelta=t.wheelDelta}),!0),this.handleResize=function(){this.domElement===document?(this.viewHalfX=window.innerWidth/2,this.viewHalfY=window.innerHeight/2):(this.viewHalfX=this.domElement.offsetWidth/2,this.viewHalfY=this.domElement.offsetHeight/2)},this.onMouseDown=function(t){if(this.domElement!==document&&this.domElement.focus(),t.preventDefault(),t.stopPropagation(),this.activeLook)switch(t.button){case 0:this.moveForward=!0;break;case 2:this.moveBackward=!0;break}this.mouseDragOn=!0},this.onMouseUp=function(t){if(t.preventDefault(),t.stopPropagation(),this.activeLook)switch(t.button){case 0:this.moveForward=!1;break;case 2:this.moveBackward=!1;break}this.mouseDragOn=!1},this.onMouseMove=function(t){this.domElement===document?(this.mouseX=t.pageX-this.viewHalfX,this.mouseY=t.pageY-this.viewHalfY,this.realMouseY=t.pageY):(this.mouseX=t.pageX-this.domElement.offsetLeft-this.viewHalfX,this.mouseY=t.pageY-this.domElement.offsetTop-this.viewHalfY,this.realMouseY=t.pageY-this.domElement.offsetTop)},this.onKeyDown=function(t){switch(console.log(t.keyCode),t.keyCode){case 38:this.moveForward=!0;break;case 12:this.moveForward=!0;break;case 87:this.moveForward=!0;break;case 104:this.moveForward=!0;break;case 37:this.moveLeft=!0;break;case 65:this.moveLeft=!0;break;case 100:this.moveLeft=!0;break;case 39:this.moveRight=!0;break;case 68:this.moveRight=!0;break;case 54:this.moveRight=!0;break;case 40:this.moveBackward=!0;break;case 98:this.moveBackward=!0;break;case 101:this.moveBackward=!0;break;case 83:this.moveBackward=!0;break;case 82:this.moveUp=!0;break;case 70:this.moveDown=!0;break}},this.update=function(t){if(!1!==this.enabled&&!0!==this.disabled){if(this.heightSpeed){var e,i=THREE.Math.clamp(this.object.position.y,this.heightMin,this.heightMax)-this.heightMin;this.autoSpeedFactor=t*(i*this.heightCoef)}else this.autoSpeedFactor=0;var s=t*this.movementSpeed,o=.96,h=1-.96,a=this.moveForward?-s:0;this.smoothMoveForward=a*h+.96*this.smoothMoveForward,this.object.translateZ(this.smoothMoveForward);var n=this.moveBackward?s:0;this.smoothMoveBackward=n*h+.96*this.smoothMoveBackward,this.object.translateZ(this.smoothMoveBackward);var m=this.moveLeft?-s:0;this.smoothMoveLeft=m*h+.96*this.smoothMoveLeft,this.object.translateX(this.smoothMoveLeft);var r=this.moveRight?s:0;this.smoothMoveRight=r*h+.96*this.smoothMoveRight,this.object.translateX(this.smoothMoveRight),this.moveUp&&this.object.translateY(s),this.moveDown&&this.object.translateY(-s);var d=t*this.lookSpeed;this.activeLook||(actualLaookSpeed=0);var c=1;if(this.constrainVertical&&(c=Math.PI/(this.verticalMax-this.verticalMin)),this.mouseX<this.centerRect&&this.mouseX>-this.centerRect&&(this.mouseX=0),this.mouseXSmoothed=.9*this.mouseXSmoothed+.1*this.mouseX,this.lon+=this.mouseXSmoothed*d,this.mouseYSmoothed=.9*this.mouseYSmoothed+.1*this.mouseY,this.lookVertical)this.lat+=this.mouseYSmoothed*d;else{var v=0;(this.object.position.y>=this.minimumHeight&&this.mouseY<0||this.object.position.y<=this.maximumHeight&&this.mouseY>0)&&(this.mouseY>this.centerRect||this.mouseY<-this.centerRect)&&(v=this.mouseY*this.heightDriftSpeed),this.smoothHeightDrift=.9*this.smoothHeightDrift+.1*v,this.object.translateY(this.smoothHeightDrift),this.targetPositionY=20-.6*this.object.position.y}this.lat=Math.max(-85,Math.min(85,this.lat)),this.phi=THREE.Math.degToRad(90-this.lat),this.theta=THREE.Math.degToRad(this.lon),this.constrainVertical&&(this.phi=THREE.Math.mapLinear(this.phi,0,Math.PI,this.verticalMin,this.verticalMax));var l=this.target,u=this.object.position;l.x=u.x+100*Math.sin(this.phi)*Math.cos(this.theta),l.y=this.targetPositionY,l.z=u.z+100*Math.sin(this.phi)*Math.sin(this.theta),this.object.lookAt(l)}},this.dispose=function(){this.domElement.removeEventListener("contextmenu",i,!1),this.domElement.removeEventListener("mousedown",h,!1),this.domElement.removeEventListener("mousemove",o,!1),this.domElement.removeEventListener("mouseup",a,!1),window.removeEventListener("keydown",n,!1),window.removeEventListener("keyup",m,!1)};var o=s(this,this.onMouseMove),h=s(this,this.onMouseDown),a=s(this,this.onMouseUp),n=s(this,this.onKeyDown),m=s(this,this.onKeyUp);this.domElement.addEventListener("contextmenu",i,!1),this.domElement.addEventListener("mousemove",o,!1),this.domElement.addEventListener("mousedown",h,!1),this.domElement.addEventListener("mouseup",a,!1),window.addEventListener("keydown",n,!1),window.addEventListener("keyup",m,!1),this.handleResize()};