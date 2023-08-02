import { Mesh, Program, Plane } from "ogl"
import GSAP from "gsap"
import fragment from "Shaders/plane-fragment.glsl"
import vertex from "Shaders/plane-vertex.glsl"

export default class{
    constructor ({ gl,collections, scene, sizes, url}){
        this.gl = gl
        this.scene = scene
        this.sizes = sizes
        this.collections =collections
        this.url = url
    
        this.geometry = new Plane(this.gl)

        this.createTexture()
        this.createProgram()
        this.createMesh()

        this.extra = {
            x: 0,
            y: 0,
            };
    }

    createTexture () {
        console.log(this.collections)
        // const image = this.element.querySelector( '.collections__gallery__media__image' ); // prettier-ignore

        // this.texture = window.TEXTURES[image.getAttribute('data-src')];
    }

    createProgram () {
        this.program = new Program(this.gl, {
            fragment,
            vertex,        
            uniforms: {
                uAlpha: {value:1},
                tMap: { value: this.texture },
            }
        })
    }

    createMesh () {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        })

        this.mesh.setParent(this.scene)
    }

    /***
     * Animation
     */
    transition () {

    }    
}