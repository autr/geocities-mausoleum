import * as THREE from '../three.js-r112/build/three.module.js';

function Sites() {
  var _this = this;
  var url, model, w, h, depth, size;
  var log = true;

  this.size = 10;
  this.depth = _this.size * 0.1;
  this.w = _this.size * 0.5;
  this.h = _this.size;
  this.image = null;
  this.website = null;
  this.loadingTexture = false;
  this.loader = new THREE.TextureLoader();
  this.tex;
  this.rise = function(texture) {
    _this.h = (_this.w / 800) * texture.image.height;
    _this.model.geometry = new THREE.BoxGeometry( _this.w, _this.h, _this.depth);

    var tweenPosition = new TWEEN.Tween(_this.model.position)
      .to({ y: (_this.h/2)+0.5 }, 6000)
      .onUpdate(function() {
      })
      .onComplete(function() {

        _this.loadingTexture = false;

      })
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

  };

  this.init = function(x, z, scene) {

    var initPromise = new Promise(function(resolve, reject) {

        _this.geometry = new THREE.BoxGeometry( _this.w, _this.h, _this.depth);
        _this.model = new THREE.Mesh(_this.geometry);
        _this.model.position.y = -_this.h/2;
        _this.model.position.x = x;
        _this.model.position.z = z;
        _this.model.rotation.y = 90  * Math.PI / 180;
        _this.model.receiveShadow = true;
        _this.model.castShadow = true;

        scene.add( _this.model );


        _this.texturise().then( (tex) => {
          resolve();
        });

    });

    return initPromise;
  };

  this.texturise = function() {


      _this.model.position.y = -_this.h/2;

      /*-- window vars --*/
      const w = window;
      w.shuffledIndex = (w.shuffledIndex < w.shuffled.length - 1) ? w.shuffledIndex + 1 : 0;
      _this.website = w.websites[w.shuffled[w.shuffledIndex]];


      var texturePromise = new Promise(function(resolve, reject) {

        if (_this.loadingTexture) {

          resolve();

        } else {

            _this.loadingTexture = true;
            const url =  window.imgFolder + _this.website;
            const t =  _this.website.substring( 0, _this.website.length - 4 );
            const span = $('<span />').attr('class', 'site-name').text(t);
            $(message).prepend( span );
            setTimeout( ()=>{ span.remove()}, 2000);

            _this.loader.load( url, (texture) => {

              texture.minFilter = THREE.LinearFilter;

              const rand = () => { return parseInt( Math.random() * 255 ) };

              var colour = new THREE.MeshPhongMaterial( {color:  `rgb(${rand()},${rand()},${rand()})`  } );
              var image = new THREE.MeshBasicMaterial( { map: texture });
              // var material = new THREE.MeshFaceMaterial(materialArray);

              _this.model.material = [colour,colour,colour,colour,image,image,];
              _this.model.needsUpdate = true;


              _this.rise(texture);
              resolve(texture);

            });

        }



      });

      return texturePromise;
  };
}


export { Sites as default };

