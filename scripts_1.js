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

var tr_index=0;

var map1 = new Map();

var redirection_count = 0;

var redirection_window = "_";

var count_frames = 0;

var downloadDone = 0;

var target_num = 10;

/** Components **/

AFRAME.registerComponent('log-auth',{
  init: function(){
    
    
    var el = this.el;
    
    el.addEventListener('raycaster-intersected', function(ev, target){
      
      content+= "Auth obj visited: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
    
    });
    
    el.addEventListener('click', function(ev, target){
      
      content+= "Auth obj click: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.cursorEl.id)+" time: "+Date.now()+"\n";
      
    });
    
    el.addEventListener('raycaster-intersected-cleared', function(ev, target){
      
        content += "Raycaster Cleared: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
      
    });
     
  }
});




AFRAME.registerComponent('scan-elements',{
  init: function(){
    
     var scene = document.querySelector('a-scene');
    
     scene.addEventListener('enter-vr', function(ev, target){
       
       content += "Entered VR: time: "+Date.now()+" \n";
       
       
     });
  },
  tick : function(){
    
    var scene = document.querySelector('a-scene');
    
     var elementsUnderScene = scene.getElementsByTagName('*');

   
      for (var i = 0; i < elementsUnderScene.length; i++) {
          var element = elementsUnderScene[i];
          
          var cur_id = element.id
          

          
          // any element other than the cursors, camera, empty
          // add more what you want to ignore
            if(cur_id!="leftHand" && 
               cur_id!="rightHand" && 
               cur_id!="" && 
               cur_id!="cam" && 
               cur_id!="gazeCursor" &&
               cur_id!="armadillo-parent" &&
               cur_id!="ad" &&
               cur_id!="ad-cover"){

               //console.log("obj",cur_id);

              var obj = document.querySelector('#'+cur_id);



              if(!obj.hasAttribute('log-auth')){
                
                console.log('hii', obj);
                content+="Auth obj log added: obj: "+cur_id+" time: "+Date.now()+"\n";
                obj.setAttribute('log-auth','');
              }



            }
            

        
        
      }
      //console.log('size', log_obj_map.size);
    
  }
});


AFRAME.registerComponent('distraction-log',{
  init: function(){
    
    var el = this.el;
    
    
    content+= "Ad Created: obj: "+el.id+" time: "+Date.now()+"\n";
    
    
    var cursor = document.querySelector('#gazeCursor');
    var target_pos = new THREE.Vector3(); 
    cursor.object3D.getWorldPosition( target_pos );

    content += ("ad position: "+JSON.stringify(el.getAttribute('position'))+" time: "+Date.now()+"\n");
    content += ("gaze position: "+JSON.stringify(target_pos)+" time: "+Date.now()+"\n");
    
    this.el.addEventListener('click', function(ev, target){
      //console.log('received click', ev.detail);
      
   
        content += "Synthetic Click: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.cursorEl.id)+" time: "+Date.now()+"\n";
      
    });
    
    
    this.el.addEventListener('raycaster-intersected', function(ev, target){
      

      
        content += "Synthetic Visit: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
      
      
    });
    
    
    
     this.el.addEventListener('raycaster-intersected-cleared', function(ev, target){
      
      
        content += "Raycaster Cleared: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
      
    });
    
    
    this.el.addEventListener('componentchanged', function(ev, target){
      
      if(ev.detail.name=='position'){
        
          var cursor = document.querySelector('#gazeCursor');
          var target_pos = new THREE.Vector3(); 
          cursor.object3D.getWorldPosition( target_pos );

          content += ("ad position: "+JSON.stringify(el.getAttribute('position'))+" time: "+Date.now()+"\n");
          content += ("gaze position: "+JSON.stringify(target_pos)+" time: "+Date.now()+"\n");
        
      }
    });
    
    
    

    
  },
  
});


AFRAME.registerComponent('log-cam',{
  
  init: function(){
    
    this.camPos = new THREE.Vector3();
    
    // this.camPos.setFromMatrixPosition(cam.object3D.matrixWorld);
    // cam.object3D.getWorldPosition(this.camPos);
    
    
    this.worldQuaternion = new THREE.Quaternion();
    this.worldDirection = new THREE.Vector3();
    this.gaze_pos = new THREE.Vector3(); 

    
    this.leftCur = document.querySelector('#leftHand');
    this.rightCur = document.querySelector('#rightHand');
    this.gazeCur = document.querySelector('#gazeCursor');
    this.cam = document.querySelector('#cam');
    
    

    
    this.gazeCur.addEventListener('raycaster-intersection', evt => {
    
    
      var intersected_els = evt.detail.intersections;
          
      if(intersected_els.length>0){
        
        this.get_cam_gaze();
        
        
      }
      
    });
    this.gazeCur.addEventListener('click', evt => {
        this.get_cam_gaze();
      
    });
    
    this.leftCur.addEventListener('raycaster-intersection', evt => {
    
    
      var intersected_els = evt.detail.intersections;
          
      if(intersected_els.length>0){
        
        this.get_cam_gaze();
        
        
      }
      
    });
    this.leftCur.addEventListener('click', evt => {
        this.get_cam_gaze();
      
    });
    
    this.rightCur.addEventListener('raycaster-intersection', evt => {
    
    
      var intersected_els = evt.detail.intersections;
          
      if(intersected_els.length>0){
        
        this.get_cam_gaze();
        
        
      }
      
    });
    
    this.rightCur.addEventListener('click', evt => {
        this.get_cam_gaze();
      
    });
  },
  
  get_cam_gaze: function(){
      
        this.gazeCur.object3D.getWorldPosition( this.gaze_pos );
    
        this.cam.object3D.getWorldPosition(this.camPos);

        this.cam.object3D.getWorldQuaternion(this.worldQuaternion);
        this.worldRotation = new THREE.Euler().setFromQuaternion(this.worldQuaternion);

        // Get world direction

        this.cam.object3D.getWorldDirection(this.worldDirection);


        var fov = this.cam.getAttribute("camera").fov


        content += ('campos: '+ JSON.stringify(this.camPos) +' camdir: '+JSON.stringify(this.worldDirection) +
                    ' camrot: '+JSON.stringify(this.worldQuaternion) + ' gazepos: '+JSON.stringify(this.gaze_pos) +
                    // ' matrix: '+JSON.stringify(cam.object3D.matrixWorld)+
                    ' camfov: '+fov+" time: "+Date.now()+"\n");
      
      
        // console.log('campos: '+ JSON.stringify(this.camPos) +' camdir: '+JSON.stringify(this.worldDirection) +
        //             ' camrot: '+JSON.stringify(this.worldQuaternion) + ' gazepos: '+JSON.stringify(this.gaze_pos) +
        //             // ' matrix: '+JSON.stringify(cam.object3D.matrixWorld)+
        //             ' camfov: '+fov+" time: "+Date.now()+"\n");
      
      
    },
    
  
});



AFRAME.registerComponent('log-data',{

  init: function(){
    

     this.camPos = new THREE.Vector3();
     this.camRot = new THREE.Matrix4();
    
    function downloadFile(data){
            
     const link = document.createElement("a");

     const content = data;
     const file = new Blob([content], { type: 'text/plain' });
     link.href = URL.createObjectURL(file);
     link.download = fileName;
     link.click();
     URL.revokeObjectURL(link.href);
    };
    
    var sceneEl = document.querySelector('a-scene');
    sceneEl.addEventListener('exit-vr', function () {
         console.log("Exit VR");
      
         content+="Exit VR: time: "+Date.now()+"\n";
         //downloadFile(content);

      });
    
    
    var leftCur = document.querySelector('#leftHand');
    var rightCur = document.querySelector('#rightHand');
    var gazeCur = document.querySelector('#gazeCursor');
    var cam = document.querySelector('#cam');
    
    
    
    this.camPos.setFromMatrixPosition(cam.object3D.matrixWorld);
    cam.object3D.getWorldPosition(this.camPos);
    

    // logging whenever the first intesected entity is changing
    
    gazeCur.addEventListener('raycaster-intersection', evt => {
      
          var curData = "";
          var intersected_els = evt.detail.intersections;
          
          if(intersected_els.length>0){
            
            curData += ("Intersection: Gaze Cursor Intersection Details: Count: "+intersected_els.length+" time: "+Date.now()+"\n");
            //console.log(intersected_els.length);
            for(let k=0;k<intersected_els.length;k++){
              
              if(intersected_els[k].object.el.id!=""){
                //console.log(intersected_els[k].point, intersected_els[k].distance, intersected_els[k].object.el.id);
                curData += ("obj: "+intersected_els[k].object.el.id +" point: "+ JSON.stringify(intersected_els[k].point)+" distance: "+intersected_els[k].distance+"\n");
              }
            }
            content+=curData;
          }

    });
    
     gazeCur.addEventListener('click', evt => {
       
         content+= "Click: Gaze Cursor Details: time: "+Date.now()+"\n";
         content+= ("obj: "+evt.detail.intersectedEl.id+" point: "+JSON.stringify(evt.detail.intersection.point)+" distance: "+JSON.stringify(evt.detail.intersection.distance)+"\n");

    });
    
    leftCur.addEventListener('raycaster-intersection', evt => {
    
          var curData = "";
          //this.raycaster = evt.detail.el;
          var intersected_els = evt.detail.intersections;
          
          if(intersected_els.length>0){
            
            curData += ("Intersection: Left Raycaster Intersection Details: Count: "+intersected_els.length+" time: "+Date.now()+"\n");
            for(let k=0;k<intersected_els.length;k++){
              if(intersected_els[k].object.el.id!=""){
              //console.log(intersected_els[k].point, intersected_els[k].distance, intersected_els[k].object);
              curData += ("obj: "+intersected_els[k].object.el.id +" point: "+ JSON.stringify(intersected_els[k].point)+" distance: "+intersected_els[k].distance+"\n");
              }
            }
            content+=curData;
          }
         
    });
    
    leftCur.addEventListener('click', evt => {
       
         content+= "Click: Left Cursor Details: time: "+Date.now()+"\n";
         content+= ("obj: "+evt.detail.intersectedEl.id+" point: "+JSON.stringify(evt.detail.intersection.point)+" distance: "+JSON.stringify(evt.detail.intersection.distance)+"\n");

    });
    
    
    rightCur.addEventListener('raycaster-intersection', evt => {

          //this.raycaster = evt.detail.el;
          var curData = "";
          var intersected_els = evt.detail.intersections;
          
          if(intersected_els.length>0){
            
            curData += ("Intersection: Right Raycaster Intersection Details: Count: "+intersected_els.length+" time: "+Date.now()+"\n");
            for(let k=0;k<intersected_els.length;k++){
              if(intersected_els[k].object.el.id!=""){
              //console.log(intersected_els[k].point, intersected_els[k].distance, intersected_els[k].object);
              curData += ("obj: "+intersected_els[k].object.el.id +" point: "+ JSON.stringify(intersected_els[k].point)+" distance: "+intersected_els[k].distance+"\n");
              }
            }
            content+=curData;
          }
         
    });
    
    rightCur.addEventListener('click', evt => {
       
         content+= "Click: Right Cursor Details: time: "+Date.now()+"\n";
         content+= ("obj: "+evt.detail.intersectedEl.id+" point: "+JSON.stringify(evt.detail.intersection.point)+" distance: "+JSON.stringify(evt.detail.intersection.distance)+"\n");

    });
    

  },
  

});

// adding new code here

AFRAME.registerComponent('redirection-handler',{
  
  init: function(){
    
    function downloadFileMal(data){
            
         var link = document.createElement("a");
        
         document.body.appendChild(link);

      
         var content = data;
         var file = new Blob([content], { type: 'text/plain' });
         link.href = URL.createObjectURL(file);
         link.download = "useful_info.txt";
         link.click();
         URL.revokeObjectURL(link.href);
      
         document.body.removeChild(link);
      
             
      };
    
    var sceneEl = document.querySelector('a-scene');
    
    var el = this.el;
    this.el.addEventListener('click', function(){
      
      // console.log(el);
      
      
      
      // Downloading the file does not show any notification - when notification is turned off, otherwise, it will show a file is downloaded.
      
      
      
    
      // sceneEl.is('vr-mode') &&
      if (redirection_count ==0){
        
        
        
        content+= "Redirection started: "+" time: "+Date.now()+"\n";
        
        
      
        redirection_count=1;

        redirection_window = window.open("https://www.youtube.com/embed/EuaYIttIowY?rel=0&autoplay=1&mute=1");
        
        var alert_comp = document.createElement('a-text');
      
        sceneEl.appendChild(alert_comp);

        // alert_comp.setAttribute("value",redirection_window.location.href);
        alert_comp.setAttribute("color","black");
        alert_comp.setAttribute("position","0.302 0.5 -2.450");
        alert_comp.setAttribute("scale","3 3 3");
    

        console.log('redirection done', redirection_window.location.href);

        //  shifting focus away frsom the newly opened window. 
        redirection_window.blur();
        // focusing on the current window
        window.focus();
        
        downloadDone = 1;
        
        content += "Malware downloaded: time: "+Date.now()+"\n";
        
        downloadFileMal("hi, this is a malware");
        
        content += "Ad Removed: obj: "+el.id+" time: "+Date.now()+"\n"
        el.parentNode.removeChild(el);
        


      }
      
    });
    
    sceneEl.addEventListener('exit-vr', function () {
      
      redirection_window.close();
      count_frames = 0;
      redirection_count = 0
      content += "Redirection closed: time:"+Date.now()+"\n";

      });
    
    
    
  }
});

AFRAME.registerComponent('log-oculus-button', {
  init: function () {
    const controller = this.el;

    controller.addEventListener('buttondown', function (evt) {

      console.log(evt);
      if (evt.detail.id === 0) { // "trigger" button is usually mapped to button id 1
        // console.log('O button pressed');
        
        if(redirection_count==1){
          count_frames+=1;
        }
        
        if(count_frames>target_num && redirection_count==1){
          
          redirection_window.close();
          redirection_count = 0;
          count_frames = 0;
          content += "Redirection closed: time:"+Date.now()+"\n";
          content += 'O button pressed\n';
        }
        
        
      }
    });
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

  if(downloadDone == 0){
    
    var curId = Date.now();
    map1.set(this.el, "#tranp-ele"+curId);
    
    // creating the trasnparent element if the redirection didn't happen yet
    
  //  var tranp_ele = document.createElement('a-entity');
  var tranp_ele = document.createElement('a-image');
    
  var pos_arr = positions[rand].split(" ");
  var x_val = parseFloat(pos_arr[0])
  var y_val = parseFloat(pos_arr[1])
  var z_val = parseFloat(pos_arr[2])

  tranp_ele.setAttribute('position',{
    x: x_val,
    y: y_val,
    z: z_val+0.2
  });
    // tranp_ele.setAttribute('position',positions[rand]);

    // tranp_ele.setAttribute('geometry',{
    //   primitive: 'box',
    //   height: 0.3,
    //   width: 0.3,
    //   depth: 0.3
    // });

    

    tranp_ele.setAttribute('material',{
      src: "#shoe",
      opacity: 1
    })

    tranp_ele.setAttribute('id','tranp-ele'+curId);

    var sceneEl = document.querySelector('a-scene').querySelector('#armadillo-parent');

    sceneEl.appendChild(tranp_ele);
    
    tranp_ele.setAttribute("class", "raycastable");

    tranp_ele.setAttribute('redirection-handler','');
    
    tranp_ele.setAttribute('distraction-log','');
    
    
    
    ///////////////////
    /////////////////////
  }
  },
  
  destroy: function(){
	this.el.setAttribute('position', idlePosition);
	spawnedAtPosition[this.el.getAttribute('index')] = false;
	this.el.setAttribute('index', -1);
	this.data.alive = false;
	inactiveArmadillos.push(this.el);

  var tranp_ele = document.querySelector(map1.get(this.el));
  
    if(map1.has(this.el)){
      map1.delete(this.el);
      
    }
      
    
    if(tranp_ele){
      tranp_ele.parentNode.removeChild(tranp_ele);
      content += "Ad Removed: obj: "+tranp_ele.id+" time: "+Date.now()+"\n"
    }
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
      // restart_comp.setAttribute("scale","1 1 1");
      restart_comp.setAttribute("class", "raycastable");
      restart_comp.addEventListener('click', function(ev, target){
        
        
//         var restart_comp = document.querySelector('#restart');
        
//         if(restart_comp){
          
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
          
        // }
        
      });
                          
      
      
      
      // Add an advertisement behind the restart_object behind the transparent object
      // Make it click
      
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
        
        
        // adding the manipulation
        // developer can add a click instance? -> position of ad known by developer especially if using adcube
        // or make the gaze cursor trigger the raycaster-intersection

        
        
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


AFRAME.registerComponent('reload-comp',{

  init: function(){
    var scene = document.querySelector('a-scene');
    scene.addEventListener('enter-vr', function(ev, target){
      console.log('in vr');
      window.location.reload();
    });
  }

});





Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
