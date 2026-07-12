/* BIOL 40B — Histology (Lab Exam 1) question bank.
   Scoped to the exam objectives: nervous tissue / motor neuron, peripheral nerve (osmium),
   spinal cord (#27 + DRG, #28 silver), neuromuscular junction (#25), monkey eye (#36),
   guinea-pig cochlea (#37), and cranial nerves I–XII (Lab 3).
   The off-exam slides (cerebellum #30, cerebrum #31, lip #53) are intentionally excluded.

   Two kinds of entries:
   - Slides with an `image` run the graded pin-quiz (our marker on our hosted photo, correctable).
   - Slides with `embedOnly:true` have no hosted photo; they study the LIVE Histology Guide
     slide (linked, never copied) and self-quiz via description → structure name.
   `histoUrl` links out to the matching live slide on histologyguide.com for viewing only. */

const HISTO = [
  {
    id:"motorneuron", title:"Motor Neuron (nervous tissue, slide #4)", image:"motorneuron.png",
    histoUrl:"https://histologyguide.com/figureview/fig-017-motor-neuron/06-figure-1.html",
    whole:["motor neuron","neuron","multipolar neuron"],
    pins:[
      {label:"axon",                    accepted:["axon"],                                        x:0.1792,y:0.3669},
      {label:"axon hillock",            accepted:["axon hillock"],                                x:0.4052,y:0.4612},
      {label:"nucleus",                 accepted:["nucleus"],                                     x:0.4471,y:0.5080},
      {label:"nucleolus",               accepted:["nucleolus"],                                   x:0.5243,y:0.6028},
      {label:"chromatophilic substance",accepted:["chromatophilic substance","nissl body","nissl bodies","chromatophilic substances"],x:0.5792,y:0.4514},
      {label:"dendrites",               accepted:["dendrite","dendrites"],                        x:0.6967,y:0.4331}
    ]
  },
  {
    id:"nmj", title:"Neuromuscular Junction (slide #25)", image:"nmj.png", histoUrl:null,
    whole:["neuromuscular junction","nmj"],
    pins:[
      {label:"motor nerve axon", accepted:["motor nerve axon","motor nerve","motor axon"], x:0.2714,y:0.0140},
      {label:"axon terminal",    accepted:["axon terminal"],                                x:0.4245,y:0.2376},
      {label:"motor end plate",  accepted:["motor end plate","end plate","motor endplate"], x:0.5604,y:0.4215},
      {label:"synaptic end bulb",accepted:["synaptic end bulb","synaptic bulb","end bulb"], x:0.3673,y:0.4649},
      {label:"myofiber",         accepted:["myofiber","muscle fiber","muscle cell","myofibre"],x:0.2563,y:0.8707}
    ]
  },
  {
    id:"nerve_v1", title:"Peripheral Nerve, osmium (low power)", image:"nerve_v1.png",
    histoUrl:"https://histologyguide.com/slideview/MH-052-peripheral-nerve/06-slide-1.html",
    whole:["nerve","peripheral nerve"],
    pins:[
      {label:"epineurium", accepted:["epineurium"], x:0.1832,y:0.7182},
      {label:"perineurium",accepted:["perineurium"],x:0.3805,y:0.8003}
    ]
  },
  {
    id:"nerve_v2", title:"Peripheral Nerve, osmium (medium)", image:"nerve_v2.png",
    histoUrl:"https://histologyguide.com/slideview/MH-052-peripheral-nerve/06-slide-1.html",
    whole:["nerve","peripheral nerve"],
    pins:[
      {label:"perineurium",accepted:["perineurium"],x:0.0190,y:0.7208},
      {label:"endoneurium",accepted:["endoneurium"],x:0.6172,y:0.7711}
    ]
  },
  {
    id:"nerve_v3", title:"Peripheral Nerve, osmium (enlarged)", image:"nerve_v3.png",
    histoUrl:"https://histologyguide.com/slideview/MH-052-peripheral-nerve/06-slide-1.html",
    whole:["nerve","peripheral nerve"],
    pins:[
      {label:"myelin sheath",accepted:["myelin sheath","myelin"],x:0.2446,y:0.3830},
      {label:"endoneurium",  accepted:["endoneurium"],           x:0.5529,y:0.4044},
      {label:"axons",        accepted:["axon","axons"],          x:0.4614,y:0.8053}
    ]
  },
  {
    id:"sc27_over", title:"Spinal Cord with Dorsal Root Ganglion (slide #27)", image:"sc27_over.png",
    histoUrl:"https://histologyguide.com/slideview/MH-047-spinal-cord/06-slide-2.html",
    whole:["spinal cord","spinal cord ganglion"],
    pins:[
      {label:"anterior median fissure",       accepted:["anterior median fissure"], x:0.4758,y:0.8668},
      {label:"posterior/dorsal root ganglion",accepted:["dorsal root ganglion","posterior root ganglion","drg","posterior/dorsal root ganglion"],x:0.9322,y:0.3335},
      {label:"arachnoid membrane",            accepted:["arachnoid membrane","arachnoid","arachnoid mater"],x:0.1963,y:0.8579},
      {label:"posterior/dorsal root",         accepted:["posterior root","dorsal root","posterior/dorsal root"],x:0.1450,y:0.1558},
      {label:"anterior grey horn",            accepted:["anterior grey horn","anterior gray horn","ventral grey horn","ventral horn"],x:0.6095,y:0.5947},
      {label:"posterior/dorsal grey horn",    accepted:["posterior/dorsal grey horn","posterior grey horn","dorsal grey horn","posterior gray horn","dorsal gray horn"],x:0.3795,y:0.2044},
      {label:"central canal",                 accepted:["central canal"], x:0.4904,y:0.4128}
    ]
  },
  {
    id:"sc27_cc", title:"Spinal Cord #27 — central canal (enlarged)", image:"sc27_cc.png",
    histoUrl:"https://histologyguide.com/slideview/MH-047-spinal-cord/06-slide-1.html",
    whole:["spinal cord"],
    pins:[
      {label:"ependymal cells",accepted:["ependymal cell","ependymal cells","ependymal"],x:0.4208,y:0.2866},
      {label:"central canal",  accepted:["central canal"],x:0.6200,y:0.5500}
    ]
  },
  {
    id:"sc28_over", title:"Spinal Cord, silver stain (slide #28)", image:"sc28_over.png",
    histoUrl:"https://histologyguide.com/slideview/UCSF-163-spinal-cord/06-slide-1.html",
    whole:["spinal cord"],
    pins:[
      {label:"posterior median sulcus",accepted:["posterior median sulcus"],x:0.5205,y:0.2626},
      {label:"posterior grey horn",    accepted:["posterior grey horn","posterior gray horn","dorsal grey horn"],x:0.7389,y:0.2194},
      {label:"central canal",          accepted:["central canal"],x:0.5404,y:0.4791},
      {label:"anterior grey horn",     accepted:["anterior grey horn","anterior gray horn","ventral grey horn","ventral horn"],x:0.6737,y:0.5549},
      {label:"anterior median fissure",accepted:["anterior median fissure"],x:0.4911,y:0.8227}
    ]
  },
  {
    id:"sc28_cc", title:"Spinal Cord, silver #28 — central canal", image:"sc28_cc.png",
    histoUrl:"https://histologyguide.com/slideview/UCSF-163-spinal-cord/06-slide-1.html",
    whole:["spinal cord"],
    pins:[
      {label:"ependymal cells",accepted:["ependymal cell","ependymal cells","ependymal"],x:0.4843,y:0.2348},
      {label:"central canal",  accepted:["central canal"],x:0.4500,y:0.5000}
    ]
  },
  {
    id:"eye", title:"Monkey Eye (slide #36)", image:"eye.png",
    histoUrl:"https://histologyguide.com/slideview/MHS-227a-eye/20-slide-1.html",
    whole:["eye","eyeball"],
    pins:[
      {label:"ciliary body",    accepted:["ciliary body"],   x:0.2182,y:0.2292},
      {label:"retina",          accepted:["retina"],         x:0.7625,y:0.2240},
      {label:"cornea",          accepted:["cornea"],         x:0.0070,y:0.4693},
      {label:"anterior chamber",accepted:["anterior chamber"],x:0.0825,y:0.5869},
      {label:"pupil",           accepted:["pupil"],          x:0.1278,y:0.4496},
      {label:"iris",            accepted:["iris"],           x:0.1829,y:0.6638},
      {label:"sclera",          accepted:["sclera"],         x:0.2240,y:0.8818},
      {label:"optic nerve",     accepted:["optic nerve"],    x:0.9818,y:0.4522}
    ]
  },

  /* ---- embed-only gap slides (no hosted photo; study the live slide) ---- */
  {
    id:"cochlea37", title:"Guinea-Pig Cochlea (slide #37)", embedOnly:true,
    histoUrl:"https://histologyguide.com/slideview/MHS-230-inner-ear/20-slide-1.html",
    cards:[
      {q:"On the cochlea, the receptor organ for hearing that rests on the basilar membrane.", a:"organ of Corti", accepted:["organ of corti","spiral organ","spiral organ of corti"]},
      {q:"The membrane that the organ of Corti sits on top of.", a:"basilar membrane", accepted:["basilar membrane"]},
      {q:"The gelatinous membrane that overlies (touches) the tips of the hair cells.", a:"tectorial membrane", accepted:["tectorial membrane"]},
      {q:"The sensory cells that convert sound vibrations into nerve signals.", a:"hair cells", accepted:["hair cells","hair cell"]},
      {q:"The cochlear chamber ABOVE the cochlear duct (vestibular side).", a:"scala vestibuli", accepted:["scala vestibuli","scala vestibule"]},
      {q:"The cochlear chamber BELOW the cochlear duct (tympanic side).", a:"scala tympani", accepted:["scala tympani"]},
      {q:"The middle, endolymph-filled cochlear chamber (a.k.a. scala media).", a:"cochlear duct", accepted:["cochlear duct","scala media"]}
    ]
  },
  {
    id:"retina36", title:"Monkey Eye #36 — retina cell layers", embedOnly:true,
    histoUrl:"https://histologyguide.com/slideview/MHS-226-eye/20-slide-1.html",
    cards:[
      {q:"Outermost retinal layer of pigment cells that absorbs stray light.", a:"pigment epithelium", accepted:["pigment epithelium","pigmented epithelium","retinal pigment epithelium"]},
      {q:"The retinal photoreceptor cells (dim-light + colour vision).", a:"rods and cones", accepted:["rods and cones","rods & cones","rods cones","photoreceptors","rods","cones"]},
      {q:"The retinal neurons sitting between the photoreceptors and the ganglion cells.", a:"bipolar cells", accepted:["bipolar cells","bipolar cell","bipolar neurons"]},
      {q:"The innermost retinal neurons whose axons form the optic nerve.", a:"ganglion cells", accepted:["ganglion cells","ganglion cell","retinal ganglion cells"]},
      {q:"The blind spot where the optic nerve exits the eyeball.", a:"optic disc", accepted:["optic disc","optic disk","blind spot"]}
    ]
  }
];

/* Cranial nerves I–XII (Lab 3 objective: characteristics & functions). */
const CRANIAL = [
  {n:"I",   name:"olfactory",         type:"sensory", fn:"smell"},
  {n:"II",  name:"optic",             type:"sensory", fn:"vision"},
  {n:"III", name:"oculomotor",        type:"motor",   fn:"most eye movements, pupil constriction, eyelid"},
  {n:"IV",  name:"trochlear",         type:"motor",   fn:"eye movement (superior oblique)"},
  {n:"V",   name:"trigeminal",        type:"both",    fn:"facial sensation and chewing (mastication)"},
  {n:"VI",  name:"abducens",          type:"motor",   fn:"eye movement (lateral rectus)"},
  {n:"VII", name:"facial",            type:"both",    fn:"facial expression and taste (anterior tongue)"},
  {n:"VIII",name:"vestibulocochlear", type:"sensory", fn:"hearing and balance"},
  {n:"IX",  name:"glossopharyngeal",  type:"both",    fn:"taste, swallowing, salivation"},
  {n:"X",   name:"vagus",             type:"both",    fn:"parasympathetic control of the viscera (heart, lungs, gut)"},
  {n:"XI",  name:"accessory",         type:"motor",   fn:"neck movement (sternocleidomastoid, trapezius)"},
  {n:"XII", name:"hypoglossal",       type:"motor",   fn:"tongue movement"}
];
