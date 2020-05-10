import { AR } from 'expo';
import { GraphicsView } from 'expo-graphics';
import ExpoTHREE, { Renderer, THREE } from 'expo-three';
import { BackgroundTexture, Camera, hitTestWithPoint } from 'expo-three-ar';
import * as React from 'react';
import { Linking, Platform, TouchableWithoutFeedback, View } from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

let renderer, scene, camera;
//npm install three expo-three expo-three-ar expo-graphics expo-asset-utils --save

export default function App() {

  if (Platform.OS !== "ios") return null;

  const onContextCreate = async ({ gl, pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // await addDetectionImageAsync(image);

    renderer = new Renderer({ gl, pixelRatio, width, height });
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    scene.background = new BackgroundTexture(renderer);

    camera = new Camera(width, height, 0.01, 1000);

    const model = {
      "base_COL": require("./assets/models/windmill/windmill_001_base_COL.jpg"),
      "base_NOR": require("./assets/models/windmill/windmill_001_base_NOR.jpg"),
      "base_SPEC": require("./assets/models/windmill/windmill_001_base_SPEC.jpg"),
      "lopatky_COL": require("./assets/models/windmill/windmill_001_lopatky_COL.jpg"),
      "lopatky_NOR": require("./assets/models/windmill/windmill_001_lopatky_NOR.jpg"),
      "mtl": require("./assets/models/windmill/windmill_001.mtl"),
      "obj": require("./assets/models/windmill/windmill_001.obj"),
    };

    const mesh = await ExpoTHREE.loadAsync(
      [
        model["obj"],
        model["mtl"],
      ],
      null,
      name => model[name],
    );
    /*
    mesh.traverse(async child => {
      if (child instanceof THREE.Mesh) {
        console.warn('child', child);

        /// Smooth geometry
        const tempGeo = new THREE.Geometry().fromBufferGeometry(child.geometry);
        tempGeo.mergeVertices();
        // after only mergeVertices my textrues were turning black so this fixed normals issues
        tempGeo.computeVertexNormals();
        tempGeo.computeFaceNormals();

        child.geometry = new THREE.BufferGeometry().fromGeometry(tempGeo);

        child.material.flatShading = false;
        child.material.side = THREE.FrontSide;

        /// Apply other maps - maybe this is supposed to be automatic :[
        child.material.normalMap = await ExpoTHREE.loadAsync(
          model["base_NOR"],
        );
        child.material.specularMap = await ExpoTHREE.loadAsync(
          model["base_SPEC"],
        );
        //child.material.envMap = await ExpoTHREE.loadAsync(
        //  model["base_COL"],
        //);
      }
    });
    */

    /*
    const mesh = await ExpoTHREE.loadObjAsync({ 
      asset: require("./assets/models/windmill/windmill_001.obj"), 
      mtlAsset: require("./assets/models/windmill/windmill_001.mtl") 
    });
    //mesh.position.z = -0.4
    */
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 0.1);
    scene.add(mesh);
    /*
    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    // Simple color material
    const material = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
    });

    // Combine our geometry and material
    const cube = new THREE.Mesh(geometry, material);
    // Place the box 0.4 meters in front of us.
    cube.position.z = -0.4
    // Add the cube to the scene
    scene.add(cube);
    */
    // Make a spinning, multi-colored box
    geometry = new THREE.BoxGeometry( 0.5, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();
    box = new THREE.Mesh( geometry, material );
    box.position.y = 0.5;
    box.position.x = -0.2;
    box.position.z = -0.4;
    scene.add(box);
    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    scene.add(new THREE.AmbientLight(0xffffff));

    function animate() {
      requestAnimationFrame( animate );
      box.rotation.x += 0.01;
      box.rotation.y += 0.02;
      renderer.render( scene, camera );
    }
    animate();
  };

  const onResize = ({ scale, width, height }) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  };

  const onRender = (delta) => {
    // if (mesh) {
    //   mesh.update(delta);
    // }
    renderer.render(scene, camera);
  };

  const onTouch = (e) => {
    //console.log(e.nativeEvent.locationX);
    //console.log(e.nativeEvent.locationY);
    const size = new THREE.Vector2();
    renderer.getSize(size);
    const { hitTest } = AR.performHitTest(
      {
        x: e.nativeEvent.locationX / size.width,
        y: e.nativeEvent.locationY / size.eight,
      },
      AR.HitTestResultTypes.HorizontalPlane //FeaturePoint
    );
    if (hitTest.length > 0) {
      let result = hitTest[0];
      Linking.openURL("https://kkwbeauty.com/");
    } else {
      this.toast.show("Miss...");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onTouch}>
      <View style={{ flex: 1 }}>
        <GraphicsView
          style={{ flex: 1 }}
          onContextCreate={onContextCreate}
          onRender={onRender}
          onResize={onResize}
          isArEnabled
          isArRunningStateEnabled
          isArCameraStateEnabled
        />
        <Toast
          ref={toast => {
            this.toast = toast;
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
