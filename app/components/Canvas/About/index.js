import { map, mapEach } from "lodash"
import Gallery from "./Gallery"
import GSAP from "gsap"
import { Plane, Transform } from "ogl"

export default class {
    constructor({gl,scene, sizes}){
        this.gl = gl
        this.sizes= sizes

        this.group = new Transform()

        this.show()

        this.createGeometry()
        this.createGallaries()

        this.group.setParent(scene)
    }

    createGeometry () {
        this.geometry = new Plane(this.gl)
    }

    createGallaries() {
        this.gallariesElement = document.querySelectorAll(".about__gallery")        

        this.gallaries = map(this.gallariesElement, (element, index) => {
            return new Gallery({
                gl:this.gl,
                element,
                geometry:this.geometry,
                index,
                scene: this.group,
                sizes: this.sizes
            })
        })
    }

    /**
     * Animations 
     */

    show () {
        map(this.gallaries, gallery => gallery.show())
    }

    hide () {
        map(this.gallaries, gallery => gallery.hide())
    }

    /**
     * events 
     */
    onResize(event) {
        map(this.gallaries, gallery => gallery.onResize(event))
    }

    onTouchDown (event) {
        map(this.gallaries, gallery => gallery.onTouchDown(event))
    }

    onTouchMove (event) {
        map(this.gallaries, gallery => gallery.onTouchMove(event))
    }

    onTouchUp (event) {
        map(this.gallaries, gallery => gallery.onTouchUp(event))
    }

    onWheel ({ pixelX, pixelY }) {

    }

    /***
     * Update
     */

    update(scroll){ 
        map(this.gallaries, gallery => gallery.update(scroll))
    }
    
    /***
     * Destroy
     */

    destroy () {
        map(this.gallaries, gallery => gallery.destroy())
    }
} 