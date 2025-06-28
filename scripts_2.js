/** Initial Variables **/
/* global AFRAME THREE */

var positions = [
"-0.46024 0.43058 -0.92588",
"-1.19726 0.28986 -0.67284",
"-1.23825 0.28234 0.52940",
"-0.98187 0.25601 1.23786",
"-0.25130 0.32843 1.49978",
"0.44158 0.33252 1.01640",
"1.14151 0.19230 1.07521",
"1.49075 0.32847 0.10647",
"1.69524 0.31715 -0.41135",
"1.08046 0.26422 -1.14151",

"-1.02931 0.87022 -0.78663",
"-1.41416 0.91802 -0.34148",
"-1.05239 0.89277 0.26526",
"-1.04791 0.91710 0.99895",
"-0.85960 1.16636 1.49199",
"-0.03963 1.05628 1.47910",
"0.53958 1.13737 1.28999",
"1.14150 1.06304 1.06912",
"1.39145 1.27896 0.18262",
"1.38151 0.99329 -0.29432",
"0.92318 1.00883 -1.05192",

"0.25559 1.24071 -0.46539",
"-0.60127 1.18955 -0.34826",
"-0.74047 1.28953 0.25492",
"-0.26752 1.30594 0.12327",
"1.12024 1.44018 -0.34314"]

var idlePosition = "300 300 300"; 

var spawnedAtPosition = [];

for(var i = 0; i < positions.length; i++){
	spawnedAtPosition.push(false); //Array(positions.length).fill(false);
}

var inactiveArmadillos = [];

var gameStarted = false;

var score = 0;

var spawnSpeed = 2000;

var fileName = "logfile_armadillo_familya_instance5.txt";
var content = "";

var sc_timer = 0;

var count_play = 0;

/** Components **/

// adding new code here

AFRAME.registerComponent('exit-red',{
  
  init: function(){
    var scene = document.querySelector('a-scene');
    
    scene.addEventListener('exit-vr',function(ev, target){
      
      window.location.replace(
        "https://chandms.github.io/demo_app_webxr_other/gaze_based.html?score="+score
      );
            
      
    });
  },
  
  tick: function(){
    
       
       if(sc_timer%300==0){
       
    
    // `screenshot.projection` property can be `equirectangular` or `perspective`.
        var capturedScreenshot = document.querySelector('a-scene').components.screenshot.getCanvas('equirectangular');
       
       var dUrl = capturedScreenshot.toDataURL();
       //console.log(dUrl);
      

         content += "Captured Screenshot: time: "+Date.now()+"\n";
         // add the url when required
         content += dUrl+"\n";
         
       }
       
       sc_timer += 1;
       
     
       
  
    
  }
});


AFRAME.registerComponent('start-place', {
  schema: {
    color: {type: 'color', default: 'green'},
    label: {type: 'string', default: 'Start Game'}
  },
  init: function () {
    var scene = document.querySelector('a-scene');

    // Create the box
    const box = document.createElement('a-box');
    box.setAttribute('scale', '1 1 0.5');
    box.setAttribute('color', this.data.color);
    box.setAttribute('position','2.8 0 -2');
    box.setAttribute('rotation','0 -45 0');
    box.setAttribute('id','start-button');
    box.setAttribute('start-button-comp','');

    // Main label text
    const text1 = document.createElement('a-text');
    text1.setAttribute('value', this.data.label);
    text1.setAttribute('position', '-0.3 0.4 1');
    text1.setAttribute('scale', '0.5 1 0.5');

    // Offset for bold effect
    const text2 = document.createElement('a-text');
    text2.setAttribute('value', this.data.label);
    text2.setAttribute('position', '-0.31 0.4 1');
    text2.setAttribute('scale', '0.5 1 0.5');

    // Append texts to box
    box.appendChild(text1);
    box.appendChild(text2);

    // Append box to this entity
    scene.appendChild(box);
  }
});


AFRAME.registerComponent('adv-vis',{
  // adding the visual overlapping ad
  init: function(){

    function rayIntersectsBox(rayOrigin, rayDirection, box3) {
      // box3.min and box3.max are THREE.Vector3 denoting the corners of the AABB.

      // For convenience, extract them:
      const { min, max } = box3;

      // Ray param t for x, y, z
      let tmin = (min.x - rayOrigin.x) / rayDirection.x;
      let tmax = (max.x - rayOrigin.x) / rayDirection.x;

      if (tmin > tmax) [tmin, tmax] = [tmax, tmin]; // swap

      let tymin = (min.y - rayOrigin.y) / rayDirection.y;
      let tymax = (max.y - rayOrigin.y) / rayDirection.y;
      if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

      // If the intervals don't overlap, no intersection:
      if ((tmin > tymax) || (tymin > tmax)) return false;

      // Narrow tmin/tmax
      tmin = Math.max(tmin, tymin);
      tmax = Math.min(tmax, tymax);

      let tzmin = (min.z - rayOrigin.z) / rayDirection.z;
      let tzmax = (max.z - rayOrigin.z) / rayDirection.z;
      if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

      if ((tmin > tzmax) || (tzmin > tmax)) return false;

      // If we make it here, the ray intersects
      return true;
    }


    var el = document.createElement('a-image');
    var scene = document.querySelector('a-scene');
    scene.appendChild(el);

    el.setAttribute('src','#ad_mcd');
    el.setAttribute('position','3.3 0.5 -2');
    el.setAttribute('rotation', '0 -45 0');
    el.setAttribute('scale', '2 1 2');
    el.setAttribute('id', 'admcd');
    el.setAttribute('class', 'raycastable');

    var at = document.createElement('a-text');
    at.setAttribute('value','[AD]');
    at.setAttribute('position', '0.2 -0.3 0');
    at.setAttribute('scale', '0.5 0.5 0.5');
    el.appendChild(at);


    el.addEventListener('click', function(ev, target){

      console.log('mcd ad clicked');
      content += 'mcd ad clicked\n';

      // check if it is intersecting the start-button
      var raycasterComp = ev.detail.cursorEl.components.raycaster;
      
      var threeRay = raycasterComp.raycaster.ray;


      var origin = threeRay.origin;      // THREE.Vector3
      var direction = threeRay.direction;
      
      var target = document.querySelector('#start-button');
      
      if(target)
      {
      
      var hiddenObj3D = target.object3D;
      var box = new THREE.Box3().setFromObject(hiddenObj3D);


      var intersects = rayIntersectsBox(origin, direction, box);

      if(intersects){
        console.log('emitting to start');
        content += 'emitting to start\n';
        target.emit('click');
      }

      }

    });

    

  }
});

AFRAME.registerComponent('game-manager', {
  schema: {},
  init: function () {

	for(var i = 0; i < 20; i++){
		var el = document.createElement('a-gltf-model');
		var sceneEl = document.querySelector('a-scene').querySelector('#armadillo-parent');
		
		var rand = Math.floor(Math.random() * positions.length);
		while(spawnedAtPosition[rand])
		{
			rand = Math.floor(Math.random() * positions.length);
		}
		
		el.setAttribute('class','raycastable');
		el.setAttribute('armadillo','');
    el.setAttribute('id','arm'+i);
		el.setAttribute('position', idlePosition);
		// el.setAttribute('look-at','#origin');
		el.setAttribute('src','#armadillo');
    // el.setAttribute('src','#jerry');
		el.setAttribute('index', -1);

		sceneEl.appendChild(el);
		
		inactiveArmadillos.push(el);
	}
  
	this.tick = AFRAME.utils.throttleTick(this.tick, spawnSpeed, this);
  },

  tick: function () {
	if(!gameStarted)
		return;
  
	if(inactiveArmadillos.length > 0){
		var el = inactiveArmadillos.shift();
		el.components.armadillo.spawn();
	}
	
	}
});

AFRAME.registerComponent('armadillo', {
  schema: {
	lifeTime: { type: 'number', default: 5000.0 },
	alive: {type: 'boolean', default: false}
  },
  
  init: function () {
	this.el.addEventListener('click', this.onClicked.bind(this));
  },

	
  onClicked: function (){


	var sc_comp = document.querySelector('#score');
  score = score+1;
  sc_comp.setAttribute('value',"Score: "+score);
  
	var whackSound = document.querySelector('a-scene').querySelector('#whack-sound');
	whackSound.setAttribute('position', this.el.getAttribute('position'));
	whackSound.components.sound.playSound();
	this.destroy();
    
  },

  tick: function (time, timeDelta) {
	if(!this.data.alive)
		return;
  
	this.data.lifeTime -= timeDelta;
	if(this.data.lifeTime < 0)
		this.destroy();
  },
  
  spawn: function(){
	var rand = Math.floor(Math.random() * positions.length);
	while(spawnedAtPosition[rand])
	{
		rand = Math.floor(Math.random() * positions.length);
	}
	this.el.setAttribute('position', positions[rand]);
	
	var giggleSound = document.querySelector('a-scene').querySelector('#giggle-sound');
	giggleSound.setAttribute('position', positions[rand]);
	giggleSound.components.sound.playSound();
	
	spawnedAtPosition[rand] = true;		
	this.el.setAttribute('index', rand);
	
	this.data.lifeTime = 5000.0;
	this.data.alive = true;
  },
  
  destroy: function(){
	this.el.setAttribute('position', idlePosition);
	spawnedAtPosition[this.el.getAttribute('index')] = false;
	this.el.setAttribute('index', -1);
	this.data.alive = false;
	inactiveArmadillos.push(this.el);
  }
});

AFRAME.registerComponent('start-button-comp', {
	schema: {
		color: {default: 'red'}
	},

	init: function () {
		var data = this.data;
		var el = this.el;
		var defaultColor = 'grey';
  
   

		el.addEventListener('click', function (e) {		
      
        count_play +=1 

      	gameStarted = true;
      
      content +="Game Started "+Date.now()+"\n";

     document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "true");
			el.parentNode.removeChild(el);
			var logo = document.querySelector('a-scene').querySelector('#intro-logo');

      
      
			logo.parentNode.removeChild(logo);

      var msg = document.querySelector('#msg');
      msg.setAttribute('visible', true);
      // Hide after duration
      setTimeout(() => {
        msg.setAttribute('visible', false);
      }, 2000);


		});
	
    
	}
});


var startTimerValue =  20000;

var timer =  startTimerValue;

AFRAME.registerComponent('timer', {
	schema: {default: false},
	tick: function (time, timeDelta) {

    function createDistraction(){
      
      var dist_el = document.createElement('a-entity');

      var cur_scene = document.querySelector('a-scene');
      cur_scene.appendChild(dist_el);
      
      
      var dist_el_text = document.createElement('a-text');
      
      dist_el.appendChild(dist_el_text);

      dist_el_text.setAttribute('value','Seems you are having\n some trouble!!!\n\nClick on the \n Oculus Button \n to Quit and Replay');
      dist_el_text.setAttribute('color','red');
      
      
      dist_el_text.setAttribute('position','-1 0.5 0');
      
      dist_el.setAttribute('class','raycastable');

      
      dist_el.setAttribute('geometry',{
        primitive: 'plane',
        width: 3,
        height: 3,
        
        
      });
      
      
      
      dist_el.setAttribute('material',{
        src: '#gui'
      });
      

      
     
      
      dist_el.setAttribute('position',"0.302 0.5 -2");
      
      dist_el.setAttribute('id',"dist_el");
      dist_el.setAttribute('distraction-log','');
      
      
      
      
      
    }

		if(this.data){
			var el = this.el;
			timer -= timeDelta;
      var secs = Math.ceil(timer / 1000);
      var mins = Math.floor(secs / 60);
      secs = secs % 60;
      var tim = mins + ":" + secs.pad();
			el.setAttribute("value", tim);
		}
		if(timer <= 0 && gameStarted){

      if(count_play>=1){
        createDistraction();
      }

      document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "false");

      gameStarted = false;
			el.setAttribute("value", "Finished!");
      
      var cur_scene = document.querySelector('a-scene');
      var restart_comp = document.createElement('a-entity');
      
      cur_scene.appendChild(restart_comp);
      
      restart_comp.setAttribute('geometry',{
        primitive: 'box',
        height: 0.5,
        width: 0.5,
        depth: 0.5
      });
      

      restart_comp.setAttribute('material','src','#restimg');
      
      var restart_text_comp = document.createElement('a-text');
      
      restart_comp.appendChild(restart_text_comp);
      
      restart_text_comp.setAttribute('text',{
        value:'Restart',
        width: 4,
        
      });
      restart_text_comp.setAttribute('position', '-0.3 0.7 0.2');
      restart_text_comp.setAttribute("id","restart-text");
      restart_comp.setAttribute("id","restart");
      restart_comp.setAttribute("position","0.302 0.5 -4");
      restart_comp.setAttribute("class", "raycastable");
      restart_comp.addEventListener('click', function(ev, target){
        
          
        document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "false");
        var restart_text_comp = document.querySelector('#restart-text');
        
        restart_text_comp.parentNode.removeChild(restart_text_comp);

        restart_comp.parentNode.removeChild(restart_comp);

        var cur_timer = document.querySelector('#timer');
        cur_timer.setAttribute("value","0:20");
        timer = startTimerValue;

        var startGame = document.createElement('a-entity');
        cur_scene.appendChild(startGame);
        startGame.setAttribute('start-place','');


        var startLogo = document.createElement('a-gltf-model');

        cur_scene.appendChild(startLogo);
        startLogo.setAttribute("position","-1 0 0");
        startLogo.setAttribute("id", "intro-logo");
        startLogo.setAttribute("src","#intro");

        document.querySelector('#score').setAttribute("value","Score: 0");
        score=0;
        
      });
                          
      
      var ad_cover_obj = document.createElement('a-entity');
      cur_scene.appendChild(ad_cover_obj);
      ad_cover_obj.setAttribute('geometry',{
        primitive: 'box',
        height: 0.5,
        width: 0.5,
        depth: 0.5
      });
      ad_cover_obj.setAttribute('material',{
        color: 'yellow',
        opacity: 0,
      })
      ad_cover_obj.setAttribute('position','0.302 0.5 -3');
      ad_cover_obj.setAttribute('id','ad-cover');
      
      
      
      var ad_obj = document.createElement('a-image');
      cur_scene.appendChild(ad_obj);
      
      
      ad_obj.setAttribute('src','#adimg');
      

      ad_obj.setAttribute('position','0.302 0.5 -3');
      ad_obj.setAttribute('height', 0.5);
      ad_obj.setAttribute('width', 0.5);
      ad_obj.setAttribute("class", "raycastable");
      ad_obj.setAttribute("id", "ad");
      ad_obj.setAttribute('distraction-log','');
      
      ad_obj.addEventListener('click', function(ev, target){
        
        var alert_obj = document.createElement('a-text');
        cur_scene.appendChild(alert_obj);
        alert_obj.setAttribute('position','-1 1.5 -3');
        alert_obj.setAttribute('value','Thanks for your interest\n in our product');
        alert_obj.setAttribute('color','black');
        alert_obj.setAttribute('id','alert');

        
        
        var restart_comp = document.querySelector('#restart');
        
        if(restart_comp){
          console.log('sending emit to restart');
          content += 'sending emit to restart\n';
          restart_comp.emit('click');
          
        }
        
      
        
      });
      
      
      
      ad_obj.addEventListener('raycaster-intersected-cleared', function(ev, target){
        
        var alert_obj = document.querySelector('#alert');
        
        if(alert_obj){
          alert_obj.parentNode.removeChild(alert_obj);
          
        }
        
        
      });

      
      
      
      
      
        

      
		}
    
    

    
    
    
	}
});






Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
