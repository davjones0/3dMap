import * as THREE from "three";

export default function () {
	//scene size
	let WIDTH = 600, HEIGHT = 600;
	
	//camera attirbutes
	let VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

	//CREATE renderer, camera, and scene
	let renderer = new THREE.WebGLRenderer({antialias:true});
	let camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	let scene = new THREE.Scene();

	//add and position camera
	scene.add(camera);
	camera.position.z = 550;
	camera.position.x = 0;
	camera.position.y = 550;
	camera.lookAt( scene.position);

	// start the renderer, black background
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0x000);

	document.body.appendChild(renderer.domElement);

	// add a light at a position
	const pointLight = new THREE.PointLight(0xFFFFFF);
	scene.add(pointLight);
	pointLight.position.x = 800;
	pointLight.position.y = 800;
	pointLight.position.z = 800;

	//add a base plane
	const planeGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
	const planeMat = new THREE.MeshLambertMaterial({color: 0x666699});
	let plane = new THREE.Mesh(planeGeo, planeMat);

	//rotate it to correct position
	plane.rotation.x = -Math.PI/2;
	scene.add(plane);
}
