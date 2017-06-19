//import { Welcome } from './components'
import * as d3 from 'd3'
import scene from './components/scene'
import * as THREE from "three"
import {us} from '../data/LaborStates'
//import geoObject from './components/geoObject'

//const HELLO_WORLD = new Welcome('Hello from FrontBook!')
scene();
//alert("ti");
//alert(JSON.stringify(us));
//HELLO_WORLD.shout()
//document.getElementById("#map").appendChild("<p>bye<p>");
let svg = d3.select("body").append("svg");
let w = 960;
let h = 500;

let projection = d3.geoAlbers()
		.scale(w / 2, h /2)
		.translate(w/2, h/2);

let path = d3.geoPath()
	.projection(projection);
let url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
let file = "../data/LaborStates.json";
d3.json(LaborStates, function (error, us){
	const i = svg.append("path")
		.attr("d", path(us))
	//alert(us.features);
	alert(JSON.stringify(us.features));
});
