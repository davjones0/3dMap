const remote = require('electron').remote
const main = remote.require('./main.js')
const d3 = require('d3')
const $ = require('jquery')
const THREE = require('three')

$(function() {
    let worldMap;
    let mouse = { x: 0, y: 0 }

    function Map() {

        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        this.VIEW_ANGLE = 45;
        this.NEAR = 0.1;
        this.FAR = 10000;
        this.CAMERA_X = 0.1;
        this.CAMERA_Y = 1000;
        this.CAMERA_Z = 500;
        this.CAMERA_LX = 0;
        this.CAMERA_LY = 0;
        this.CAMERA_LZ = 0;

        this.geo;
        this.scene = {};
        this.renderer = {};
        this.projector = {};
        this.camera = {};
        this.stage = {};
        let path;

        this.INTERSECTED = null;
    }

    Map.prototype = {

        init_d3: function() {

            function geoConfig() {

                this.mercator = d3.geoEquirectangular();
                path = d3.geoPath().projection(this.mercator);

                let translate = this.mercator.translate();
                translate[0] = 500;
                translate[1] = 0;

                this.mercator.translate(translate);
                this.mercator.scale(200);
            }
            geoConfig();
            //this.path = new geoConfig();
        },

        init_tree: function() {


            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            this.renderer.setClearColor(0xBBBBBB, 1);


            this.renderer.setSize(this.WIDTH, this.HEIGHT);

            this.projector = new THREE.Projector();

            // append renderer to dom element
            $("#worldmap").append(this.renderer.domElement);

            // create a scene
            this.scene = new THREE.Scene();

            // put a camera in the scene
            this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.WIDTH / this.HEIGHT, this.NEAR, this.FAR);
            this.camera.position.x = this.CAMERA_X;
            this.camera.position.y = this.CAMERA_Y;
            this.camera.position.z = this.CAMERA_Z;
            this.camera.lookAt({ x: this.CAMERA_LX, y: 0, z: this.CAMERA_LZ });
            this.scene.add(this.camera);
        },


        add_light: function(x, y, z, intensity, color) {
            let pointLight = new THREE.PointLight(color);
            pointLight.position.x = x;
            pointLight.position.y = y;
            pointLight.position.z = z;
            pointLight.intensity = intensity;
            this.scene.add(pointLight);
        },

        add_plain: function(x, y, z, color) {
            let planeGeo = new THREE.CubeGeometry(x, y, z);
            let planeMat = new THREE.MeshLambertMaterial({ color: color });
            let plane = new THREE.Mesh(planeGeo, planeMat);

            // rotate it to correct position
            plane.rotation.x = -Math.PI / 2;
            this.scene.add(plane);
        },

        add_countries: function(data) {

            let countries = [];
            let i, j;

            // convert to threejs meshes
            for (i = 0; i < data.features.length; i++) {
                let geoFeature = data.features[i];
                let properties = geoFeature.properties;
                let feature = path(geoFeature);

                // we only need to convert it to a three.js path
                let mesh = transformSVGPathExposed(feature);

                // add to array
                for (j = 0; j < mesh.length; j++) {
                    countries.push({ "data": properties, "mesh": mesh[j] });
                }
            }

            // extrude paths and add color
            for (i = 0; i < countries.length; i++) {

                // create material color based on average		
                let material = new THREE.MeshPhongMaterial({
                    color: this.getCountryColor(countries[i].data),
                    opacity: 0.5
                });

                // extrude mesh
                let shape3d = countries[i].mesh.extrude({
                    amount: 4,
                    bevelEnabled: false
                });
                // let extrudeSettings = {
                //     amount: 14,
                //     bevelEnabled: false
                // };

                // let shape3d = new THREE.ExtrudeGeometry(countries[i].mesh, extrudeSettings);

                // create a mesh based on material and extruded shape
                let toAdd = new THREE.Mesh(shape3d, material);

                //set name of mesh
                toAdd.name = countries[i].data.name;

                // rotate and position the elements
                toAdd.rotation.x = Math.PI / 2;
                toAdd.translateX(-490);
                toAdd.translateZ(50);
                toAdd.translateY(20);

                // add to scene
                this.scene.add(toAdd);
            }
        },

        getCountryColor: function(data) {
            //let multiplier = 0;

            //for(i = 0; i < 3; i++) {
            //	multiplier += data.iso_a3.charCodeAt(i);
            //}

            //multiplier = (1.0/366)*multiplier;
            //return multiplier*0xffffff;
            return 0xff0000;
        },

        setCameraPosition: function(x, y, z, lx, lz) {
            this.CAMERA_X = x;
            this.CAMERA_Y = y;
            this.CAMERA_Z = z;
            this.CAMERA_LX = lx;
            this.CAMERA_LZ = lz;
        },

        moveCamera: function() {
            let speed = 0.2;
            let target_x = (this.CAMERA_X - this.camera.position.x) * speed;
            let target_y = (this.CAMERA_Y - this.camera.position.y) * speed;
            let target_z = (this.CAMERA_Z - this.camera.position.z) * speed;

            this.camera.position.x += target_x;
            this.camera.position.y += target_y;
            this.camera.position.z += target_z;

            this.camera.lookAt({ x: this.CAMERA_LX, y: 0, z: this.CAMERA_LZ });
        },

        animate: function() {

            if (this.CAMERA_X != this.camera.position.x ||
                this.CAMERA_Y != this.camera.position.y ||
                this.CAMERA_Z != this.camera.position.z) {
                this.moveCamera();
            }

            // find intersections
            let vector = new THREE.Vector3(mouse.x, mouse.y, 1);
            this.projector.unprojectVector(vector, this.camera);
            let raycaster = new THREE.Raycaster(this.camera.position, vector.subSelf(this.camera.position).normalize());
            let intersects = raycaster.intersectObjects(this.scene.children);

            let objects = this.scene.children;

            if (intersects.length > 1) {
                if (this.INTERSECTED != intersects[0].object) {
                    if (this.INTERSECTED) {
                        for (i = 0; i < objects.length; i++) {
                            if (objects[i].name == this.INTERSECTED.name) {
                                objects[i].material.opacity = 0.5;
                                objects[i].scale.z = 1;
                            }
                        }
                        this.INTERSECTED = null;
                    }
                }

                this.INTERSECTED = intersects[0].object;
                for (i = 0; i < objects.length; i++) {
                    if (objects[i].name == this.INTERSECTED.name) {
                        objects[i].material.opacity = 1.0;
                        objects[i].scale.z = 5;
                    }
                }

            } else if (this.INTERSECTED) {
                for (i = 0; i < objects.length; i++) {
                    if (objects[i].name == this.INTERSECTED.name) {
                        objects[i].material.opacity = 0.5;
                        objects[i].scale.z = 1;
                    }
                }
                this.INTERSECTED = null;
            }

            this.render();
        },

        render: function() {

            // actually render the scene
            this.renderer.render(this.scene, this.camera);
        }
    };

    let init = () => {

        $.when($.getJSON("./data/labor.json")).then(function(data) {

            worldMap = new Map();

            worldMap.init_d3();
            worldMap.init_tree();

            worldMap.add_light(0, 3000, 0, 1.0, 0xFFFFFF);
            worldMap.add_plain(1400, 700, 30, 0xEEEEEE);

            worldMap.add_countries(data);

            // request animation frame
            let onFrame = window.requestAnimationFrame;

            let tick = (timestamp) => {
                worldMap.animate();

                if (worldMap.INTERSECTED) {
                    $('#country-name').html(worldMap.INTERSECTED.name);
                } else {
                    $('#country-name').html("move mouse over map");
                }

                onFrame(tick);
            }

            onFrame(tick);

            document.addEventListener('mousemove', onDocumentMouseMove, false);
            window.addEventListener('resize', onWindowResize, false);

        });
    }

    let onDocumentMouseMove = (event) => {

        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    let onWindowResize = () => {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        worldMap.camera.aspect = window.innerWidth / window.innerHeight;
        worldMap.camera.updateProjectionMatrix();

        worldMap.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    $('.navbar-fixed-top ul li a').click(() => {
        /*switch (this.hash) {
           case "#africa":
        	  worldMap.setCameraPosition(100, 320, 200, 100, 50);
        	  break;
           case "#europe":
        	  worldMap.setCameraPosition(75, 210, -75, 75, -150);
        	  break;
           case "#asia":
        	  worldMap.setCameraPosition(400, 350, 100, 400, -100);
        	  break;
           case "#northamerica":
        	  worldMap.setCameraPosition(-300, 350, -90, -300, -120);
        	  break;
           case "#southamerica":
           	  worldMap.setCameraPosition(-200, 350, 250, -200, 120);
        	  break;
           case "#australia":
        	  worldMap.setCameraPosition(500, 270, 300, 500, 120);
        	  break;
           case "#all":
        	  worldMap.setCameraPosition(0, 1000, 500, 0, 0);
        	  break;
        }*/
        worlMap.setCameraPosition(-300, 350, -90, -300, -120);
    });

    window.onload = init;

}());



let button = document.createElement('button');
button.textContent = 'Open Window';
button.addEventListener('click', () => {
    main.openWindow();
}, false)
document.body.appendChild(button);