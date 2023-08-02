import GSAP from "gsap"


import Prefix from "prefix"

import { each, map } from "lodash"

import Label from "animation/Label"
import Title from "animation/Title"
import Paragraphs from "animation/Paragraph"

import AsyncLoad from "classes/AsyncLoad"
import { ColorsManager } from "classes/Colors"


export default class Page {
  constructor ({id, element, elements}){
		this.selector = element
		this.selectorChildren = {
			...elements,
			animationTitles: '[data-animation="title"]',
			animationParagraph : '[data-animation="paragraph"]',
			animationLabel : '[data-animation="label"]',
			animationHighlight : "[data-animation='highlight']",

			preloaders: '[data-src]'
		}

		this.id = id 

		this.transformPrefix = Prefix("transform")
	}

	create () {
		this.element = document.querySelector(this.selector)
		this.elements = {}

		this.scroll = {
			current: 0,
			target: 0,
			last: 0,
			limit: 0,
		}

		each(this.selectorChildren, (entry,key) => {
			if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)){
				this.elements[key] = entry
			} else{
				this.elements[key] = document.querySelectorAll(entry)

				if (this.elements[key].length === 0){
					this.elements[key]= null
				} else if (this.elements[key].length === 1){
					this.elements[key] = document.querySelector(entry)
				}
			}
		})		

		this.createAnimations()
		this.createPreloader()
	}

	createAnimations () {
		this.animations = []

		this.animationTitles = map(this.elements.animationTitles, element => {
			return new Title ({
				element
			})
		})

		this.animations.push(...this.animationTitles)

		//Paragraph

		this.animationParagraphs = map(this.elements.animationParagraph, element => {
			return new Paragraphs ({
				element
			})
		})

		this.animations.push(...this.animationParagraphs)

		//label

		this.animationLabels = map(this.elements.animationLabel, element => {
			return new Label ({
				element
			})
		})

		this.animations.push(...this.animationLabels)

		// Highlight 

		this.animationHighlights = map(this.elements.animationHighlight, element => {
			return new Paragraphs ({
				element
			})
		})

		this.animations.push(...this.animationHighlights)
	}

	createPreloader () {
		this.preloaders = map(this.elements.preloaders, element => {
			return new AsyncLoad({element})
		})
	}

	/**
	 * Animations
	 */
	show () {
		return new Promise(resolve => {
			ColorsManager.change({
				backgroundColor: this.element.getAttribute("data-background"),
				color: this.element.getAttribute("data-color")
			})

			this.animationIn =GSAP.timeline()

			this.animationIn.fromTo(this.element,{
				autoAlpha:0,
			},{
				autoAlpha: 1,
			})

			this.animationIn.call (_ => {
				this.addEventListeners()

				resolve()
			})
		})

	}

	hide () {
		return new Promise(resolve => {
			this.destroy()

			this.animationOut =GSAP.timeline()

			this.animationOut.to(this.element,{
				autoAlpha: 0,
				onComplete: resolve
			})
		})
	}
	/**
	 * Events
	 */
	onWheel ({pixelY}) {
		this.scroll.target += pixelY
	}

	onResize () {
		if (this.elements.wrapper){
			this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
		}

		each(this.animations, animation => animation.onResize())
	}

	/**
	 * Loops
	 */
	update () {
		this.scroll.target = GSAP.utils.clamp(0 , this.scroll.limit , this.scroll.target)
	
		
		this.scroll.current = GSAP.utils.interpolate( this.scroll.current, this.scroll.target, 0.1)
		
		if (this.scroll.target < 0.01) {
			this.scroll.target = 0
		}

		if (this.elements.wrapper){ 
			this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
		}
	}

	/**
	 * Listeners
	 */

	addEventListeners () {
	}

	removeEventListeners () {
	}

	/**
	 * Destroy
	 */

	destroy () {
		this.removeEventListeners()
	}
}