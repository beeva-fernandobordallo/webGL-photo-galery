require([], function(){
	// detect WebGL
	if( !Detector.webgl ){
		Detector.addGetWebGLMessage();
		throw 'WebGL Not Available'
	} 
	// setup webgl renderer full page
	var renderer	= new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	// setup a scene and camera
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.position.x = 0
	camera.position.z = 15
	camera.position.y = 25

	// declare the rendering loop
	var onRenderFcts= [];

	// handle window resize events
	var winResize	= new THREEx.WindowResize(renderer, camera)

	//////////////////////////////////////////////////////////////////////////////////
	//		default 3 points lightning					//
	//////////////////////////////////////////////////////////////////////////////////
	
	var ambientLight= new THREE.AmbientLight( 0x020202 )
	scene.add( ambientLight)
	var frontLight	= new THREE.DirectionalLight('white', 0.3)
	frontLight.position.set(0.5, 0.5, 2)
	scene.add( frontLight )
	var backLight	= new THREE.DirectionalLight('white', 0.2)
	backLight.position.set(-0.5, -0.5, -2)
	scene.add( backLight )

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////	
	// var geometry	= new THREE.CubeGeometry( 1, 1, 1);
	// var material	= new THREE.MeshPhongMaterial();
	// var mesh	= new THREE.Mesh( geometry, material );
	// scene.add( mesh );
	
	// onRenderFcts.push(function(delta, now){
	// 	mesh.rotateX(0.5 * delta);
	// 	mesh.rotateY(2.0 * delta);		
	// })


	//////////////////////////////////////////////////////////////////////////////////
	//		MATERIALES					//
	//////////////////////////////////////////////////////////////////////////////////	
	
	//material con textura sin reflejos
	var texturaMadera = THREE.ImageUtils.loadTexture( "images/wood.jpg" );
		texturaMadera.wrapS = texturaMadera.wrapT = THREE.RepeatWrapping; 
		texturaMadera.repeat.set( 1, 1 );
	var materialMadera = new THREE.MeshBasicMaterial( { map: texturaMadera,color: 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: 1  } );

//material con textura sin reflejos
	var texturaMadera2 = THREE.ImageUtils.loadTexture( "images/wood.jpg" );
		texturaMadera2.wrapS  = THREE.RepeatWrapping; 
		texturaMadera2.repeat.set( 1, 1 );
	var materialMadera2 = new THREE.MeshBasicMaterial( { map: texturaMadera2,color: 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: 1  } );


	//////////////////////////////////////////////////////////////////////////////////
	//		GEOMETRÍAS					//
	//////////////////////////////////////////////////////////////////////////////////	

	var cuboBase = new THREE.CubeGeometry( 1, 1, 1);

	function crearCuadro(objeto, alto, ancho, borde, posicion, Texture){
		var marcoLargo1 = new THREE.Mesh(cuboBase, materialMadera);
		var longMarcoLargo = alto - borde*2;
		marcoLargo1.scale.set(borde, longMarcoLargo, 0.2);
		marcoLargo1.position.y = alto/2 - borde/2;
		marcoLargo1.position.x = ancho/2 - borde/2;
		marcoLargo1.position.z = -posicion;
		marcoLargo1.castShadows = true;
		objeto.add(marcoLargo1);

		var marcoLargo2 = new THREE.Mesh(cuboBase, materialMadera);
		marcoLargo2.scale.set(borde, longMarcoLargo, 0.2);
		marcoLargo2.position.y = alto/2 - borde/2;
		marcoLargo2.position.x = - ancho/2 + borde/2;
		marcoLargo2.position.z = -posicion;
		objeto.add(marcoLargo2);

		var marcoCorto1 = new THREE.Mesh(cuboBase, materialMadera2);
		var largoMarcoCorto = ancho;
		marcoCorto1.scale.set(largoMarcoCorto, borde, 0.2);
		marcoCorto1.position.z = -posicion;
		objeto.add(marcoCorto1);

		var marcoCorto2 = new THREE.Mesh(cuboBase, materialMadera2);
		marcoCorto2.scale.set(largoMarcoCorto, borde, 0.2);
		marcoCorto2.position.y = alto - borde;
		marcoCorto2.position.z = -posicion;
		objeto.add(marcoCorto2);

		//material con textura y reflejos
		Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping; 
		Texture.repeat.set( 1, 1 );	
		var imgMaterial = new THREE.MeshPhongMaterial( { map: Texture,color: 0x888888, emissive: 0x888888, specular: 0x111111, shininess: 100, metal: true, transparent: true, opacity: 1, side: THREE.DoubleSide } );

		var imgGeom = new THREE.PlaneGeometry( ancho - borde/2, alto - borde/2, 32 );
		// var imgMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( imgGeom, imgMaterial );
		plane.position.z = -posicion- 0.5;
		plane.position.y = alto/2-borde/2;
		plane.receiveShadows = true;
		objeto.add( plane );

	}

	var allCuadros = new THREE.Object3D();
	function init(){

		var tempCuadros = [];
		var ang = 60*Math.PI/180;
		for (var i = 0; i < 6 ; i++) {
			tempCuadros[i] = new THREE.Object3D();
			var Texture = THREE.ImageUtils.loadTexture( "images/" + [i] + ".jpg" );
			crearCuadro(tempCuadros[i], 55, 40, 4, 70, Texture);
			tempCuadros[i].rotateY(i*ang);
			allCuadros.add(tempCuadros[i]);
		}
		scene.add(allCuadros);
	};

	init();
	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0}
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5
		mouse.y	= (event.clientY / window.innerHeight) - 0.5
	}, false)
	onRenderFcts.push(function(delta, now){
		// camera.position.x += (mouse.x*10 - camera.position.x) * (delta*3)
		// camera.position.y = 25+ (mouse.y*5 - camera.position.y) * (delta*3)
		if(now > 3){
			if(now < 5){
				camera.rotateY(delta*(now-2)/25)
			}else{
				camera.rotateY(delta*3/25)
			}
		}
		// if(mouse.x > 0.05 || mouse.x < -0.05){
		// 	camera.rotateY(delta*3/5*mouse.x);
		// }


	})

	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Rendering Loop runner						//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})
})