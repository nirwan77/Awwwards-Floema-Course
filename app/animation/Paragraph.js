import GSAP from "gsap"

import Animation from "classes/Animation";

export default class Paragraphs extends Animation {
    constructor ({element, elements}) {
        super({
            element,
            elements
        })
    }

    animateIn () {
        this.timelineIn = GSAP.timeline({
            delay: 0.5
        })

        this.timelineIn.to(this.element, {
            autoAlpha:1,
            duration: 1
        })

        // each(this.elementLines, (line, index) => {
        //     this.timelineIn.fromTo(line, {
        //         autoAlpha:0,
        //         y: "100%"
        //     }, {
        //         autoAlpha:1,
        //         delay: index * 0.2,
        //         duration: 1.5,
        //         y:"0%",
        //         ease: "expo.out"
        //     }, 0)
        // })
    }

    animateOut () {
        GSAP.set(this.element, {
            autoAlpha: 0
        })
    }

}