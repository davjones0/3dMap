import * as d3 from 'd3'

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
	}
}
