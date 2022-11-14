/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

import {
	Math as _Math,
	Spherical,
	Vector3
} from "../../../build/three.module.js";

var FirstPersonControls = function ( object, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.' );
		domElement = document;

	}

	this.object = object;
	this.domElement = domElement;

	// API

	this.enabled = true;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.mouseDragOn = false;

	// internals

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.moveUp = false;
	this.moveDown = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;


	this.smoothMouseX = 0;
	this.smoothMouseY = 0;

	// private variables

	var lat = 0;
	var lon = 0;

	var lookDirection = new Vector3();
	var spherical = new Spherical();
	var target = new Vector3();

	//

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

		this.smoothMouseX = this.mouseX;
		this.smoothMouseY = this.mouseY;

	};


	this.lookAt = function ( x, y, z ) {

		if ( x.isVector3 ) {

			target.copy( x );

		} else {

			target.set( x, y, z );

		}

		this.object.lookAt( target );

		setOrientation( this );

		return this;

	};

	this.update = function () {

		var targetPosition = new Vector3();


		return function update( delta ) {


			if ( this.enabled === false ) return;

			if ( this.heightSpeed ) {

				var y = _Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;

				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			var actualMoveSpeed = delta * this.movementSpeed;

			if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
			if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

			if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
			if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

			if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
			if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

			var actualLookSpeed = delta * this.lookSpeed;

			if ( ! this.activeLook ) {

				actualLookSpeed = 0;

			}

			var verticalLookRatio = 1;

			if ( this.constrainVertical ) {

				verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

			}

			lon -= this.smoothMouseX * actualLookSpeed;
			if ( this.lookVertical ) lat -= this.smoothMouseY * actualLookSpeed * verticalLookRatio;

			lat = Math.max( - 85, Math.min( 85, lat ) );

			var phi = _Math.degToRad( 90 - lat );
			var theta = _Math.degToRad( lon );

			if ( this.constrainVertical ) {

				phi = _Math.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );

			}

			var position = this.object.position;

			targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

			this.object.lookAt( targetPosition );

		};

	}();

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {

		document.removeEventListener( 'contextmenu', contextmenu, false );
		document.removeEventListener( 'mousedown', _onMouseDown, false );
		// document.removeEventListener( 'mousemove', _onMouseMove, false );
		// document.removeEventListener( 'mouseup', _onMouseUp, false );

		// window.removeEventListener( 'keydown', _onKeyDown, false );
		// window.removeEventListener( 'keyup', _onKeyUp, false );

	};

	var _onMouseMove = bind( this, this.onMouseMove );
	// var _onMouseDown = bind( this, this.onMouseDown );
	// var _onMouseUp = bind( this, this.onMouseUp );
	// var _onKeyDown = bind( this, this.onKeyDown );
	// var _onKeyUp = bind( this, this.onKeyUp );

	document.addEventListener( 'contextmenu', contextmenu, false );
	document.addEventListener( 'mousemove', _onMouseMove, false );
	// document.addEventListener( 'mousedown', _onMouseDown, false );
	// document.addEventListener( 'mouseup', _onMouseUp, false );


	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	function setOrientation( controls ) {

		var quaternion = controls.object.quaternion;

		lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
		spherical.setFromVector3( lookDirection );

		lat = 90 - _Math.radToDeg( spherical.phi );
		lon = _Math.radToDeg( spherical.theta );

	}

	this.handleResize();

	setOrientation( this );

};

export { FirstPersonControls };
