const shaderFiles = ['output.vert', 'output.frag'];
const shaders = shaderFiles.map(file => require(`../../assets/glsl/${file}`));

export default class Webgl{
  constructor(comets){
    // debugger
    this.comets = comets;
    // ResizeWatch.register(this);

    // this.$ele = this.comets.$el;

    // this.vertShader = [
    //   fetch('/static/glsl/output.vert'),
    //   fetch('/static/glsl/output.frag'),
    // ];
    //
    // this.fragShader = [
    // ];

    // const vert = require('./test.glsl');
    // console.log(vert);

    // for(let i = 0; i < this.vertShader.length; i++){
    //   // const src = this.vertShader[i];

    //   // this.vertShader[i] = vert;
    //   // console.log(vert);
    // }

    // for(let i = 0; i < this.fragShader.length; i++){
    //   this.fragShader[i] = require(this.fragShader[i]);
    // }

    // this.init();
  }

  // init(){
  //   this.width = 2048;
  //   this.height = 2048;
  //   this.aspect = this.width / this.height;
  //   this.setProps();

  //   this.renderer = new THREE.WebGLRenderer( {
  //     antialias: true,
  //     alpha: true,
  //     canvas: this.$ele
  //   } );

  //   renderer.setPixelRatio( window.devicePixelRatio );
  //   this.renderer.setSize( this.width, this.height );
  //   this.renderer.setClearColor( 0xffffff, 0.0 );


  //   this.scene = new THREE.Scene();

  //   this.camera = new THREE.PerspectiveCamera(this.props.fov, this.props.aspect, this.props.near, this.props.far);
  //   var cameraZ = (this.props.height / 2) / Math.tan((this.props.fov * Math.PI / 180) / 2);
  //   this.camera.position.set(0, 0, cameraZ);
  //   this.camera.lookAt(this.scene.position);


  //   this.time = new THREE.Clock();
  //   this.render();
  // }


  // setProps(){
  //   var width = ResizeWatch.width;
  //   var height = ResizeWatch.height;
  //   var aspect = width / height;

  //   this.props = {
  //     width: width,
  //     height: height,
  //     aspect: aspect,
  //     fov: 45,
  //     left: -width / 2,
  //     right: width / 2,
  //     top: height / 2,
  //     bottom: -height / 2,
  //     near: 0.1,
  //     far: 10000,
  //     parent: document.getElementById("wrapper")
  //   };
  // }


  // render(){
  //   var delta = this.time.getDelta() * 5;
  //   var time = this.time.elapsedTime;

  //   this.renderer.render( this.scene, this.camera );

  //   requestAnimationFrame(this.render.bind(this));
  // }


  // resizeUpdate(){
  //   this.setProps();
  //   this.renderer.setSize(this.props.width, this.props.height);

  //   this.camera.aspect = this.props.aspect;

  //   var cameraZ = (this.props.height / 2) / Math.tan((this.props.fov * Math.PI / 180) / 2);

  //   this.camera.position.set(0, 0, cameraZ);
  //   this.camera.lookAt(this.scene.position);

  //   this.camera.updateProjectionMatrix();
  // }

}
