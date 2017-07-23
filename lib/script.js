$(function() {

    // function d3threeD(exports) {
    //     const DEGS_TO_RADS = Math.PI / 180,
    //         UNIT_SIZE = 100;
    //     const DIGIT_0 = 48,
    //         DIGIT_9 = 57,
    //         COMMA = 44,
    //         SPACE = 32,
    //         PERIOD = 46,
    //         MINUS = 45;
    //     exports.transformSVGPath =
    //         function transformSVGPath(pathStr) {
    //             var path = new THREE.ShapePath();
    //             var idx = 1,
    //                 len = pathStr.length,
    //                 activeCmd,
    //                 x = 0,
    //                 y = 0,
    //                 nx = 0,
    //                 ny = 0,
    //                 firstX = null,
    //                 firstY = null,
    //                 x1 = 0,
    //                 x2 = 0,
    //                 y1 = 0,
    //                 y2 = 0,
    //                 rx = 0,
    //                 ry = 0,
    //                 xar = 0,
    //                 laf = 0,
    //                 sf = 0,
    //                 cx, cy;

    //             function eatNum() {
    //                 var sidx, c, isFloat = false,
    //                     s;
    //                 // eat delims
    //                 while (idx < len) {
    //                     c = pathStr.charCodeAt(idx);
    //                     if (c !== COMMA && c !== SPACE)
    //                         break;
    //                     idx++;
    //                 }
    //                 if (c === MINUS)
    //                     sidx = idx++;
    //                 else
    //                     sidx = idx;
    //                 // eat number
    //                 while (idx < len) {
    //                     c = pathStr.charCodeAt(idx);
    //                     if (DIGIT_0 <= c && c <= DIGIT_9) {
    //                         idx++;
    //                         continue;
    //                     } else if (c === PERIOD) {
    //                         idx++;
    //                         isFloat = true;
    //                         continue;
    //                     }
    //                     s = pathStr.substring(sidx, idx);
    //                     return isFloat ? parseFloat(s) : parseInt(s);
    //                 }
    //                 s = pathStr.substring(sidx);
    //                 return isFloat ? parseFloat(s) : parseInt(s);
    //             }

    //             function nextIsNum() {
    //                 var c;
    //                 // do permanently eat any delims...
    //                 while (idx < len) {
    //                     c = pathStr.charCodeAt(idx);
    //                     if (c !== COMMA && c !== SPACE)
    //                         break;
    //                     idx++;
    //                 }
    //                 c = pathStr.charCodeAt(idx);
    //                 return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
    //             }
    //             var canRepeat;
    //             activeCmd = pathStr[0];
    //             while (idx <= len) {
    //                 canRepeat = true;
    //                 switch (activeCmd) {
    //                     // moveto commands, become lineto's if repeated
    //                     case 'M':
    //                         x = eatNum();
    //                         y = eatNum();
    //                         path.moveTo(x, y);
    //                         activeCmd = 'L';
    //                         firstX = x;
    //                         firstY = y;
    //                         break;
    //                     case 'm':
    //                         x += eatNum();
    //                         y += eatNum();
    //                         path.moveTo(x, y);
    //                         activeCmd = 'l';
    //                         firstX = x;
    //                         firstY = y;
    //                         break;
    //                     case 'Z':
    //                     case 'z':
    //                         canRepeat = false;
    //                         if (x !== firstX || y !== firstY)
    //                             path.lineTo(firstX, firstY);
    //                         break;
    //                         // - lines!
    //                     case 'L':
    //                     case 'H':
    //                     case 'V':
    //                         nx = (activeCmd === 'V') ? x : eatNum();
    //                         ny = (activeCmd === 'H') ? y : eatNum();
    //                         path.lineTo(nx, ny);
    //                         x = nx;
    //                         y = ny;
    //                         break;
    //                     case 'l':
    //                     case 'h':
    //                     case 'v':
    //                         nx = (activeCmd === 'v') ? x : (x + eatNum());
    //                         ny = (activeCmd === 'h') ? y : (y + eatNum());
    //                         path.lineTo(nx, ny);
    //                         x = nx;
    //                         y = ny;
    //                         break;
    //                         // - cubic bezier
    //                     case 'C':
    //                         x1 = eatNum();
    //                         y1 = eatNum();
    //                     case 'S':
    //                         if (activeCmd === 'S') {
    //                             x1 = 2 * x - x2;
    //                             y1 = 2 * y - y2;
    //                         }
    //                         x2 = eatNum();
    //                         y2 = eatNum();
    //                         nx = eatNum();
    //                         ny = eatNum();
    //                         path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
    //                         x = nx;
    //                         y = ny;
    //                         break;
    //                     case 'c':
    //                         x1 = x + eatNum();
    //                         y1 = y + eatNum();
    //                     case 's':
    //                         if (activeCmd === 's') {
    //                             x1 = 2 * x - x2;
    //                             y1 = 2 * y - y2;
    //                         }
    //                         x2 = x + eatNum();
    //                         y2 = y + eatNum();
    //                         nx = x + eatNum();
    //                         ny = y + eatNum();
    //                         path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
    //                         x = nx;
    //                         y = ny;
    //                         break;
    //                         // - quadratic bezier
    //                     case 'Q':
    //                         x1 = eatNum();
    //                         y1 = eatNum();
    //                     case 'T':
    //                         if (activeCmd === 'T') {
    //                             x1 = 2 * x - x1;
    //                             y1 = 2 * y - y1;
    //                         }
    //                         nx = eatNum();
    //                         ny = eatNum();
    //                         path.quadraticCurveTo(x1, y1, nx, ny);
    //                         x = nx;
    //                         y = ny;
    //                         break;
    //                     case 'q':
    //                         x1 = x + eatNum();
    //                         y1 = y + eatNum();
    //                     case 't':
    //                         if (activeCmd === 't') {
    //                             x1 = 2 * x - x1;
    //                             y1 = 2 * y - y1;
    //                         }
    //                         nx = x + eatNum();
    //                         ny = y + eatNum();
    //                         path.quadraticCurveTo(x1, y1, nx, ny);
    //                         x = nx;
    //                         y = ny;
    //                         break;
    //                         // - elliptical arc
    //                     case 'A':
    //                         rx = eatNum();
    //                         ry = eatNum();
    //                         xar = eatNum() * DEGS_TO_RADS;
    //                         laf = eatNum();
    //                         sf = eatNum();
    //                         nx = eatNum();
    //                         ny = eatNum();
    //                         if (rx !== ry) {
    //                             console.warn("Forcing elliptical arc to be a circular one :(",
    //                                 rx, ry);
    //                         }
    //                         // SVG implementation notes does all the math for us! woo!
    //                         // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
    //                         // step1, using x1 as x1'
    //                         x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
    //                         y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
    //                         // step 2, using x2 as cx'
    //                         var norm = Math.sqrt(
    //                             (rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1) /
    //                             (rx * rx * y1 * y1 + ry * ry * x1 * x1));
    //                         if (laf === sf)
    //                             norm = -norm;
    //                         x2 = norm * rx * y1 / ry;
    //                         y2 = norm * -ry * x1 / rx;
    //                         // step 3
    //                         cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
    //                         cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;
    //                         var u = new THREE.Vector2(1, 0),
    //                             v = new THREE.Vector2((x1 - x2) / rx,
    //                                 (y1 - y2) / ry);
    //                         var startAng = Math.acos(u.dot(v) / u.length() / v.length());
    //                         if (u.x * v.y - u.y * v.x < 0)
    //                             startAng = -startAng;
    //                         // we can reuse 'v' from start angle as our 'u' for delta angle
    //                         u.x = (-x1 - x2) / rx;
    //                         u.y = (-y1 - y2) / ry;
    //                         var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
    //                         // This normalization ends up making our curves fail to triangulate...
    //                         if (v.x * u.y - v.y * u.x < 0)
    //                             deltaAng = -deltaAng;
    //                         if (!sf && deltaAng > 0)
    //                             deltaAng -= Math.PI * 2;
    //                         if (sf && deltaAng < 0)
    //                             deltaAng += Math.PI * 2;
    //                         path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
    //                         x = nx;
    //                         y = ny;
    //                         break;
    //                     default:
    //                         throw new Error("weird path command: " + activeCmd);
    //                 }
    //                 // just reissue the command
    //                 if (canRepeat && nextIsNum())
    //                     continue;
    //                 activeCmd = pathStr[idx++];
    //             }
    //             return path;
    //         }
    // }
    // var $d3g = {};
    //d3threeD($d3g);
    /*******************************************************************888
     +
     +
     +
     +path = $d3g.transformSVGPath( thePaths[i] );
      **********************************************************************/
    //everything in this function needs global
    var worldMap;
    var mouse = { x: 0, y: 0 }

    function Map() {

        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        this.VIEW_ANGLE = 45;
        this.NEAR = 0.1;
        this.FAR = 10000;
        this.CAMERA_X = 0;
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
        var path;

        this.INTERSECTED = null;
    }

    Map.prototype = {

        init_d3: function() {

            function geoConfig() {

                this.mercator = d3.geoEquirectangular();
                path = d3.geoPath().projection(this.mercator);

                var translate = this.mercator.translate();
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
            var pointLight = new THREE.PointLight(color);
            pointLight.position.x = x;
            pointLight.position.y = y;
            pointLight.position.z = z;
            pointLight.intensity = intensity;
            this.scene.add(pointLight);
        },

        add_plain: function(x, y, z, color) {
            var planeGeo = new THREE.CubeGeometry(x, y, z);
            var planeMat = new THREE.MeshLambertMaterial({ color: color });
            var plane = new THREE.Mesh(planeGeo, planeMat);

            // rotate it to correct position
            plane.rotation.x = -Math.PI / 2;
            this.scene.add(plane);
        },

        add_countries: function(data) {

            var countries = [];
            var i, j;

            // convert to threejs meshes
            for (i = 0; i < data.features.length; i++) {
                var geoFeature = data.features[i];
                var properties = geoFeature.properties;
                var feature = path(geoFeature);

                // we only need to convert it to a three.js path
                var mesh = transformSVGPathExposed(feature);

                // add to array
                for (j = 0; j < mesh.length; j++) {
                    countries.push({ "data": properties, "mesh": mesh[j] });
                }
            }

            // extrude paths and add color
            for (i = 0; i < countries.length; i++) {

                // create material color based on average		
                var material = new THREE.MeshPhongMaterial({
                    color: this.getCountryColor(countries[i].data),
                    opacity: 0.5
                });

                // extrude mesh
                //var shape3d = countries[i].mesh.extrude({
                //   amount: 4,
                // bevelEnabled: false
                //});
                var extrudeSettings = {
                    amount: 14,
                    bevelEnabled: false
                };

                var shape3d = new THREE.ExtrudeGeometry(countries[i].mesh, extrudeSettings);

                // create a mesh based on material and extruded shape
                var toAdd = new THREE.Mesh(shape3d, material);

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
            //var multiplier = 0;

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
            var speed = 0.2;
            var target_x = (this.CAMERA_X - this.camera.position.x) * speed;
            var target_y = (this.CAMERA_Y - this.camera.position.y) * speed;
            var target_z = (this.CAMERA_Z - this.camera.position.z) * speed;

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
            var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
            this.projector.unprojectVector(vector, this.camera);
            var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
            var intersects = raycaster.intersectObjects(this.scene.children);

            var objects = this.scene.children;

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

    function init() {

        $.when($.getJSON("data/labor.json")).then(function(data) {

            worldMap = new Map();

            worldMap.init_d3();
            worldMap.init_tree();

            worldMap.add_light(0, 3000, 0, 1.0, 0xFFFFFF);
            worldMap.add_plain(1400, 700, 30, 0xEEEEEE);

            worldMap.add_countries(data);

            // request animation frame
            var onFrame = window.requestAnimationFrame;

            function tick(timestamp) {
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

    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        worldMap.camera.aspect = window.innerWidth / window.innerHeight;
        worldMap.camera.updateProjectionMatrix();

        worldMap.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    $('.navbar-fixed-top ul li a').click(function() {
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