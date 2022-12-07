/*
 * Copyright 2021 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ThreeJSOverlayView, latLngToVector3Relative } from "@googlemaps/three";
import { degToRad } from "three/src/math/MathUtils";

const images = ["./assets/Screenshot (32).png", "./assets/Screenshot (33).png"]


let map: google.maps.Map;

const mapOptions = {
  tilt: 45,
  heading: 0,
  zoom: 18,
  center: { lat: 4.65888, lng: -74.05590 },
  mapId: "15431d2b469f209e",
  // disable interactions due to animation loop and moveCamera
  disableDefaultUI: true,
};

function initMap(): void {
  let imageIdx = -1;
  let animation = false
  let presentationMode = false;
  const mapDiv = document.getElementById("map") as HTMLElement;

  map = new google.maps.Map(mapDiv, mapOptions);

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);

  directionalLight.position.set(0, 10, 50);
  scene.add(directionalLight);



  // Load the model.
  const loader = new GLTFLoader();
  loader.load("/assets/low-poly_university/scene.gltf", (gltf) => {
    gltf.scene.scale.set(3, 3, 3);
    // gltf.scene.rotation.x = Math.PI / 2;
    scene.add(gltf.scene);
    gltf.scene.rotateY(degToRad(-25))
    let { tilt, heading, zoom, center: { lat, lng } } = mapOptions;

    const animate = (time: number) => {
      if (animation) {
        heading += 0.1

        map.moveCamera({ heading });
      }


      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
  loader.load('/assets/moments_of_my_life_wedding_day/scene.gltf', (gltf) => {
    gltf.scene.scale.set(7, 7, 7);
    scene.add(gltf.scene);
    gltf.scene.rotateY(degToRad(-180))
    gltf.scene.position.copy((latLngToVector3Relative({
      lat: 4.655870774907884, lng: -74.05205440088471
    }, { lat: 4.65888, lng: -74.05543 })))
    gltf.scene.position.setY(100)
  });
  loader.load('/assets//building_02/scene.gltf', (gltf) => {
    gltf.scene.scale.set(50, 50, 50);
    scene.add(gltf.scene);
    gltf.scene.position.copy(latLngToVector3Relative({
      lat: 4.603135401408294, lng: - 74.06726121655656
    }, { lat: 4.65888, lng: -74.05543 }))
  });

  loader.load('/assets//ountryside_house/scene.gltf', (gltf) => {
    gltf.scene.scale.set(5, 5, 5);
    scene.add(gltf.scene);
    gltf.scene.position.copy(latLngToVector3Relative({
      lat: 4.663951470785304, lng: -74.0457079963942
    }, { lat: 4.65888, lng: -74.05543 }))
  });
  window.addEventListener("wheel", (ev) => {

    if (ev.deltaY < 0) {
      map.moveCamera({
        center: map.getCenter(),
        heading: map.getHeading(),
        tilt: map.getTilt(),
        zoom: map.getZoom()! + .1
      })
    } else {
      map.moveCamera({
        center: map.getCenter(),
        heading: map.getHeading(),
        tilt: map.getTilt(),
        zoom: map.getZoom()! - .1
      })
    }
  })

  window.addEventListener('mousemove', (ev) => {
    if (ev.altKey) {
      let vecX = ((ev.x / window.innerWidth) * 2) - 1
      let vecY = ((ev.y / window.innerHeight) * 2) - 1
      map.moveCamera({ heading: map.getHeading()! + vecX, tilt: map.getTilt()! + vecY })

    }

  })
  window.addEventListener('keypress', (ev) => {
    console.log(ev.key)
    if (ev.key === 'Enter') {
      animation = !animation
      console.log(map.getHeading())
    }
    if (ev.key === 'p') {
      present()

    }
    if (ev.key === 'd') {
      imageIdx++
      setImage(imageIdx)
    }
    if (ev.key === 'a') {
      imageIdx--
      setImage(imageIdx)
    }
  })
  const presentation = document.querySelector(".presentation-container") as HTMLDivElement
  const image = document.getElementById("presentation") as HTMLImageElement
  const present = () => {
    presentationMode = !presentationMode
    presentation.style.display = presentationMode ? "" : "none"
  }

  const setImage = (i: number) => {
    image.src = `./assets/Screenshot (${33 + i}).png`
  }



  new ThreeJSOverlayView({
    map,
    scene,
    anchor: { ...mapOptions.center, altitude: 0 },
    THREE,
  });
}



declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export { initMap };
