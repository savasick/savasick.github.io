const {GLTFLoader} = THREE;
const { RGBELoader } = THREE;
const { RoughnessMipmapper } = THREE;

let camera, scene, renderer, eye, face, pointLight;

init();
render();

function init() {

  const container = document.createElement( 'div' );
  container.classList.add('canvas_container')
  document.querySelector('.main').appendChild( container );

  camera = new THREE.PerspectiveCamera( 55, 1, 0.25, 20 );
  camera.position.set( 0, 0, 3.7);

  scene = new THREE.Scene();

  pointLight = new THREE.PointLight( 0x2c2c2c, 1.7, 2 );
  pointLight.position.set( 0, 0, 1 );
  scene.add( pointLight );

  let light = new THREE.AmbientLight( 0x0c0c0c); // soft white light
  scene.add( light );

  new RGBELoader()
    .setDataType( THREE.UnsignedByteType )
    .load( 'https://raw.githubusercontent.com/Nik439/Images/master/cpc-bad-buttons/background.hdr', function ( texture ) {

      const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

      scene.background = envMap;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();

      render();

      const loader = new GLTFLoader();
      loader.load( 'https://raw.githubusercontent.com/Nik439/Images/master/cpc-bad-buttons/eye/scene.gltf', function ( gltf ) {

        eye = gltf.scene

        scene.add( eye );

        render();

      } );

    } );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( Math.min(window.innerWidth, window.innerHeight) - 50, Math.min(window.innerWidth, window.innerHeight) - 50 );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild( renderer.domElement );

  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  pmremGenerator.compileEquirectangularShader();

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  camera.aspect = 1;
  camera.updateProjectionMatrix();

  renderer.setSize( Math.min(window.innerWidth, window.innerHeight) - 50, Math.min(window.innerWidth, window.innerHeight) - 50 );

  render();

}

function render() {
 	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

document.addEventListener('mousemove', (e)=>{
  if (eye) {
    eye.rotation.set(((e.clientY+50)/window.innerHeight)-.5, (e.clientX/window.innerWidth)-.5, 0)
  }
})

document.getElementById('no').addEventListener('mouseover', (e)=>{
  document.getElementById('yes').innerText = 'No'
})
document.getElementById('no').addEventListener('mouseleave', (e)=>{
  document.getElementById('yes').innerText = 'Yes'
})