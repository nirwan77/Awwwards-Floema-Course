import { map } from "lodash"
import Media from "./Media"
import Prefix from "prefix"
import GSAP from "gsap"
import { Plane, Transform } from "ogl"

export default class {
    constructor({gl,scene, sizes, transition}){
        this.id = "collections"

        this.gl = gl
        this.sizes= sizes
        this.scene = scene


        this.transition = transition

        this.transformPrefix = Prefix("transform")

        this.group = new Transform()

        this.galleryElement = document.querySelector(".collections__gallery")
        this.galleryWrapperElement = document.querySelector(".collections__gallery__wrapper")
        
        this.titlesElement = document.querySelector(".collections__titles")
        
        this.collectionsElemets = document.querySelectorAll(".collections__article")
        this.collectionsElementsActive = "collections__article--active"
        
        this.mediasElements = document.querySelectorAll(".collections__gallery__media")
        
        this.scroll={
            current:0,
            target:0,
            lerp:0.1
        }

        this.scroll = {
            current: 0,
            target: 0, 
            start: 0,
            last: 0,
            velocity: 1
        }

        this.createGeometry()
        this.createGallery()

        this.onResize({
            sizes: this.sizes
        })

        this.group.setParent(this.scene)

        this.show()
    }

    createGeometry () {
        this.geometry = new Plane(this.gl)
    }

    createGallery() {
        this.medias = map(this.mediasElements, (element, index) => {
            return new Media({
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
        if (this.transition){
            this.transition.animate(this.medias[0].mesh, _ => {
            })
        }

        map(this.medias, media => media.show())

    }

    hide () {
        map(this.medias, media => media.hide())
    }

    /**
     * events 
     */
    onResize(event) {
        this.bounds = this.galleryWrapperElement.getBoundingClientRect()
        
        this.sizes = event.sizes
        

        this.scroll.last = this.scroll.target = 0
        this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth

        map(this.medias, media => media.onResize(event, this.scroll))
    }

    onTouchDown ({ x,y }) {
        this.scroll.last = this.scroll.current
    }

    onTouchMove ({ x,y }) {
        const distance = x.start - x.end

        this.scroll.target = this.scroll.last - distance

    }

    onTouchUp ({ x,y }) {
        
    }

    onWheel ({ pixelY }) {
        this.scroll.target -= pixelY

    }

    /***
     * changes
     */

    onChange (index) {
        this.index = index

        const selectedCollection =parseInt(this.mediasElements[this.index].getAttribute("data-index"))
        map(this.collectionsElemets, (element, elementIndex) => {
            if (elementIndex === selectedCollection){
                element.classList.add(this.collectionsElementsActive)
            } else{
                element.classList.remove(this.collectionsElementsActive)
            }
        })

        this.titlesElement.style[this.transformPrefix] = `translateY(-${25 * selectedCollection}%) translate(-50%, 50%) rotate(-90deg) `
    }

    /***
     * Update
     */

    update(){
        this.scroll.target = GSAP.utils.clamp(-this.scroll.limit,0, this.scroll.target)

        this.scroll.current = GSAP.utils.interpolate( this.scroll.current, this.scroll.target, 0.1 ); // prettier-ignore

        this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px)`

        if(this.scroll.last < this.scroll.current){
            this.scroll.direction = "left"
        }else if (this.scroll.last > this.scroll.current){
            this.scroll.direction = "right"
        }

        this.scroll.last = this.scroll.current

        
        const index = Math.floor(Math.abs((this.scroll.current - (this.medias[0].bounds.width/2)) / this.scroll.limit) * (this.medias.length - 1))
        
        if (this.index !== index){
            this.onChange(index)
        }

        map(this.medias, (media, index) => { 
            media.update(this.scroll.current, this.index)

        })

    }

    /***
     * Destroy
     */

    destroy () {
        this.scene.removeChild(this.group)
    }
} 