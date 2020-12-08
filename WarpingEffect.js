const THREE = require('three');

class WarpingEffect {
    constructor(w, h, image, cv) {

      this.w = w;
      this.h = h;
      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(this.w, this.h);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0xffffff, 0)
      const container = document.getElementById(cv);
      container.appendChild(this.renderer.domElement);
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);
      this.scene = new THREE.Scene();
      const geo = new THREE.PlaneGeometry(2, 2, 32, 32);
      this.targetPercent = 0.0;
      this.move = 0.0
      this.last = window.pageYOffset
      this.image = image
      const texture = new THREE.TextureLoader().load(this.image);

      this.uniforms = {
        uAspect: {
          value: this.w / this.h
        },
        uTime: {
          value: 0.0
        },
        uPercent: {
          value: this.targetPercent
        },
        uFixAspect: {
          value: this.h / this.w
        },
        uTex: {
          value: texture
        },
        uMov: {
            value: this.move
        },
        uShift: {
          value: 0
        }
      };
  
      const mat = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `varying vec2 vUv;

        uniform float uFixAspect;
        uniform float uMov;
        uniform float uShift;
        
        void main() {
          vUv = uv - .5;
          vUv.y *= uFixAspect;
          vUv += .5;
        
          vec3 pos = position;
        
          pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * uShift * 5.0) * 0.125);
        
          gl_Position = vec4( pos, 1.2 );
        }`,

        fragmentShader: `varying vec2 vUv;

        uniform float uShift;
        uniform sampler2D uTex;
        
        void main() {
          float shift = uShift * 0.05;
        
          float r = texture2D( uTex, vUv + vec2( shift, 0.0 ) ).r;
          float g = texture2D( uTex, vUv ).g;
          float b = texture2D( uTex, vUv - vec2( shift, 0.0 ) ).b;
        
          vec3 color = vec3( r, g, b );
        
          gl_FragColor = vec4( color, 1.0 );
        }`,
      });
  
      this.mesh = new THREE.Mesh(geo, mat);
      this.scene.add(this.mesh);
  
      this.render();
    }

    lerp(x, y, p) {
        return x + (y - x) * p;
      }

    render() {
      // 次のフレームを要求
      requestAnimationFrame(() => { this.render(); });
  
      // ミリ秒から秒に変換
      const sec = performance.now() / 1000;
  
      // シェーダーに渡す時間を更新
      this.uniforms.uTime.value = sec;
  
      // シェーダーに渡す進捗度を更新
      this.uniforms.uPercent.value += (this.targetPercent - this.uniforms.uPercent.value) * 0.1;

      this.uniforms.uShift.value = this.lerp(this.uniforms.uShift.value, (window.pageYOffset - this.last) / 50, 0.1);
      this.last = window.pageYOffset;

      this.renderer.render(this.scene, this.camera);
    }

    mouseWheel (e){
      let scrollAmount = Math.abs(e / 30).toFixed(1);
      if(scrollAmount > 2){
        scrollAmount = 2;
      }
      this.targetPercent = scrollAmount;
    }
}

export default WarpingEffect;