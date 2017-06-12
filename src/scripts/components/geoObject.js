import * as d3 from 'd3'
import * as THREE from 'three'

export default function (data) {
	//keep track of rendered obj
	let meshes = [];
	let averageValues = [];
	let totalValues = [];

	//keep track of min and max vals for gradient
	let maxValueAverage = 0;
	let minValueAverage = -1;

	//keep track of max and min of total values
	let maxValueTotal = 0;
	let minValueTotal = 0;

	//convert to mesh and calculate values
	for (let i = 0; i < data.features.length; i++) {
		let geoFeature = data.features[i]
		let feature = geo.path(geoFeature);
		//conver to three.js path
		let mesh = transformSVGPathExposed(feature);
		meshes.push(mesh);

		//get property from json obj to use for color
		
		//and get the max values to determine height later
		
	}


	//got paths now extrude them to a height and add a color
	for (let i = 0; i < averageValues.length; i++) {
		
		// create material color based on average
		let scale = ((averageValues[i] - minvalueAverage) / (maxValueAverage - minValueAverage)) * 255;
		let mathColor = gradient(Math.round(scale),255);
		let material = new THREE.MeshLambertMaterial({
			color: mathColor
		});

		//create extrude based on total
		let extrude = ((totalValues[] - minValueTotal) / (maxValueAverage - minvalueAverage)) * 225;
		let shape3d = meshes[i].extrude({amount: Math.round(extrude), bevelEnabled: false});
		//create a mesh based on material and extruded shape
		let toAdd = new THREE.Mesh(shape3d, material);

		//rotate and position the elemnts nicely in the center
		toAdd.rotation.x = Math.PI/2;
		toAdd.translateX(-490);
		toAdd.translateZ(50);
		toAdd.translateY(extrude/2);

		scene.add(toAdd);
	}
}

// gradient function
function gradient() {
	let i = (length * 255 / maxLength);
	let r = i;
	let g = 255 - (i);
	let b = 0;
	//look into what this means
	let rgb = b | (g << 8) | (r << 16);
	return rgb;
}
