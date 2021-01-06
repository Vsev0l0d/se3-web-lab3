let camera, scene, renderer

init()

function init() {
    scene = new THREE.Scene()

    scene.add( new THREE.AmbientLight(0x404040, 1.2) )

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
    camera.position.set( 0, 3, 10 )
    camera.add( new THREE.PointLight( 0xFFFFFF, 1.2 ) )
    scene.add( camera )

    renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.domElement.style.setProperty("position", "absolute", null)
    document.body.prepend( renderer.domElement )

    const loader = new THREE.GLTFLoader()
    let obj = null
    loader.load( '../../resources/3d/scene.gltf', function ( gltf ) {
        obj = gltf
        obj.scene.scale.set(1.3, 1.3, 1.3)
        obj.scene.position.y = -4
        scene.add(obj.scene)
        render()
    } )

    const controls = new THREE.OrbitControls( camera, renderer.domElement )
    controls.addEventListener( 'change', render )
    controls.target.set( 0, 1.2, 2 )
    controls.update()

    window.addEventListener( 'resize', onWindowResize, false )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize( window.innerWidth, window.innerHeight )
    render()
}

function render() { renderer.render( scene, camera ) }