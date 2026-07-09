// BIOL 40B model practical — question bank transcribed from the student answer keys.
// Each item: n (number on the image), name (display), accept (strict-graded name variants),
// func (model function, revealed for self-check), fkeys (soft keywords for encouraging feedback).
const MODELS = [
{
  id:"neuron", title:"Neuron Model", image:"images/neuron.jpg", numColor:"#d22",
  items:[
    {n:1,  name:"Cell body",        accept:["cell body","soma","perikaryon"],           func:"Energy production (the metabolic center of the neuron).", fkeys:["energy","metabol","center","organelle"]},
    {n:2,  name:"Nucleus",          accept:["nucleus"],                                  func:"Stores DNA.", fkeys:["dna","genetic","chromosom"]},
    {n:3,  name:"Nucleolus",        accept:["nucleolus"],                                func:"Produces ribosomes.", fkeys:["ribosom","rrna"]},
    {n:4,  name:"Dendrites",        accept:["dendrites","dendrite"],                     func:"Receive signals from other neurons.", fkeys:["receive","signal","input","incoming"]},
    {n:5,  name:"Axon",             accept:["axon"],                                     func:"Transmits the electrical signal.", fkeys:["transmit","electric","signal","impulse","conduct"]},
    {n:6,  name:"Axon hillock",     accept:["axon hillock"],                             func:"Determines if the electrical signal will be sent (trigger zone).", fkeys:["trigger","threshold","initiate","decide","determine","action potential"]},
    {n:7,  name:"Schwann cell",     accept:["schwann cell","schwann cells","neurolemmocyte"], func:"Produces myelin in the PNS.", fkeys:["myelin","insulat","pns"]},
    {n:8,  name:"Endoneurium",      accept:["endoneurium"],                              func:"Structural support (wraps individual axons).", fkeys:["support","structur","wrap","connective"]},
    {n:9,  name:"Node of Ranvier",  accept:["node of ranvier","nodes of ranvier","ranvier"], func:"Makes electrical transmission more efficient (saltatory conduction).", fkeys:["efficient","fast","saltatory","jump","speed"]},
    {n:10, name:"Synaptic end bulb",accept:["synaptic end bulb","synaptic knob","axon terminal","terminal bouton","end bulb","synaptic bulb"], func:"Converts the electrical message to a chemical one (releases neurotransmitter).", fkeys:["chemical","neurotransmitter","convert","release","synapse"]},
  ]
},
{
  id:"brain", title:"Brain Model (sagittal)", image:"images/brain.jpg", numColor:"#d22",
  items:[
    {n:1,  name:"Thalamus",        accept:["thalamus"],                     func:"Relays sensory messages to the brain.", fkeys:["sensory","relay","message","gateway"]},
    {n:2,  name:"Hypothalamus",    accept:["hypothalamus"],                 func:"Controls hunger and thirst (homeostasis).", fkeys:["hunger","thirst","homeostasis","temperature","hormone"]},
    {n:3,  name:"Pineal gland",    accept:["pineal gland","pineal body","pineal"], func:"Releases melatonin.", fkeys:["melatonin","sleep","circadian"]},
    {n:4,  name:"Frontal lobe",    accept:["frontal lobe"],                 func:"Regulates cognitive ability (thinking, planning, movement).", fkeys:["cognit","think","plan","reason","motor","personality"]},
    {n:5,  name:"Occipital lobe",  accept:["occipital lobe"],               func:"Visual perception.", fkeys:["vis","sight","see"]},
    {n:6,  name:"Corpus callosum", accept:["corpus callosum"],              func:"Integrates the two hemispheres (connects them).", fkeys:["hemisphere","connect","integrat","bridge","communicat"]},
    {n:7,  name:"Midbrain",        accept:["midbrain","mesencephalon"],     func:"Visual reflexes.", fkeys:["reflex","vis","eye"]},
    {n:8,  name:"Pons",            accept:["pons"],                         func:"Breathing and sleep.", fkeys:["breath","sleep","respir"]},
    {n:9,  name:"Medulla oblongata",accept:["medulla","medulla oblongata"], func:"Controls heart rate and blood pressure.", fkeys:["heart","blood pressure","bp","cardiac","respir","autonomic"]},
    {n:10, name:"Cerebellum",      accept:["cerebellum"],                   func:"Coordination and balance.", fkeys:["coordinat","balance","motor","posture"]},
    {n:11, name:"4th ventricle",   accept:["4th ventricle","fourth ventricle"], func:"Circulation of CSF (cerebrospinal fluid).", fkeys:["csf","cerebrospinal","fluid","circulat"]},
    {n:12, name:"Parietal lobe",   accept:["parietal lobe"],                func:"Touch / sensory perception.", fkeys:["touch","sensory","somato","pressure"]},
  ]
},
{
  id:"eye", title:"Eye Model", image:"images/eye.jpg", numColor:"#1a4",
  items:[
    {n:1,  name:"Sclera",          accept:["sclera"],                       func:"Protects the eye (tough outer layer).", fkeys:["protect","outer","white","support","shape"]},
    {n:2,  name:"Cornea",          accept:["cornea"],                       func:"Bends (refracts) light.", fkeys:["bend","refract","light","focus"]},
    {n:3,  name:"Choroid",         accept:["choroid"],                      func:"Nourishes the retina (blood supply).", fkeys:["nourish","blood","supply","retina","nutrient"]},
    {n:4,  name:"Ciliary body",    accept:["ciliary body"],                 func:"Changes the lens shape (accommodation).", fkeys:["lens","shape","accommod","focus"]},
    {n:5,  name:"Iris",            accept:["iris"],                         func:"Controls pupil size (amount of light).", fkeys:["pupil","light","size","color"]},
    {n:6,  name:"Lens",            accept:["lens"],                         func:"Focuses light onto the retina.", fkeys:["focus","light","refract","retina"]},
    {n:7,  name:"Anterior chamber",accept:["anterior chamber"],             func:"Contains aqueous humor.", fkeys:["aqueous","humor","fluid"]},
    {n:8,  name:"Posterior chamber",accept:["posterior chamber"],           func:"Contains aqueous humor.", fkeys:["aqueous","humor","fluid"]},
    {n:9,  name:"Posterior cavity", accept:["posterior cavity","vitreous chamber"], func:"Filled with vitreous body.", fkeys:["vitreous","fluid","gel"]},
    {n:10, name:"Vitreous body",   accept:["vitreous body","vitreous humor","vitreous humour"], func:"Supports the retina (holds the eye's shape).", fkeys:["support","retina","shape","gel"]},
    {n:11, name:"Retina",          accept:["retina"],                       func:"Converts light to a neuronal signal.", fkeys:["light","signal","neural","neuron","photorecept","convert"]},
    {n:12, name:"Macula lutea",    accept:["macula lutea","macula"],        func:"Sharp central vision — highest concentration of cones.", fkeys:["sharp","central","cone","acuity","detail"]},
    {n:13, name:"Optic nerve",     accept:["optic nerve"],                  func:"Carries visual information to the brain.", fkeys:["carry","brain","visual","signal","transmit"]},
    {n:14, name:"Optic disc",      accept:["optic disc","optic disk","blind spot"], func:"Blind spot where the optic nerve exits.", fkeys:["blind","exit","no photorecept"]},
  ]
},
{
  id:"ear", title:"Ear Model", image:"images/ear.jpg", numColor:"#1758c4",
  items:[
    {n:1,  name:"Auricle (pinna)", accept:["auricle","pinna","auricle (pinna)"], func:"Collects sound.", fkeys:["collect","gather","funnel","sound"]},
    {n:2,  name:"External auditory meatus", accept:["external auditory meatus","external auditory canal","ear canal","auditory meatus","external acoustic meatus"], func:"Carries sound to the eardrum.", fkeys:["carry","sound","eardrum","canal","channel"]},
    {n:3,  name:"Tympanic membrane", accept:["tympanic membrane","eardrum"], func:"Vibrates when sound hits it.", fkeys:["vibrat","sound","eardrum"]},
    {n:4,  name:"Auditory (Eustachian) tube", accept:["auditory tube","eustachian tube","auditory (eustachian) tube","pharyngotympanic tube"], func:"Balances ear pressure.", fkeys:["pressure","balance","equal"]},
    {n:5,  name:"Malleus",         accept:["malleus","hammer"],             func:"Passes sound vibrations.", fkeys:["vibrat","pass","sound","ossicle"]},
    {n:6,  name:"Incus",           accept:["incus","anvil"],                func:"Passes vibrations to the stapes.", fkeys:["vibrat","stapes","pass","ossicle"]},
    {n:7,  name:"Stapes",          accept:["stapes","stirrup"],             func:"Sends vibrations to the inner ear.", fkeys:["vibrat","inner","oval window","ossicle"]},
    {n:8,  name:"Vestibulocochlear nerve", accept:["vestibulocochlear nerve","vestibulocochlear","auditory nerve","cranial nerve viii","cranial nerve 8","cn viii"], func:"Sends signals to the brain.", fkeys:["signal","brain","carry","transmit"]},
    {n:9,  name:"Vestibule",       accept:["vestibule"],                    func:"Helps with balance.", fkeys:["balance","equilibrium"]},
    {n:10, name:"Semicircular canals", accept:["semicircular canals","semicircular canal"], func:"Detects head movement.", fkeys:["head","movement","rotation","balance","motion"]},
    {n:11, name:"Cochlea",         accept:["cochlea"],                      func:"Changes sound into nerve signals.", fkeys:["sound","nerve","signal","convert","hearing"]},
    {n:12, name:"Oval window",     accept:["oval window"],                  func:"Passes vibrations into the cochlea.", fkeys:["vibrat","cochlea","pass"]},
    {n:13, name:"Round window",    accept:["round window"],                 func:"Relieves pressure in the cochlea.", fkeys:["pressure","relieve","cochlea","release"]},
  ]
},
{
  id:"cochlea", title:"Cochlea Model", image:"images/cochlea.jpg", numColor:"#1758c4",
  items:[
    {n:1,  name:"Scala vestibuli", accept:["scala vestibuli","scala vestibule"], func:"Carries sound through the cochlea.", fkeys:["carry","sound","through","cochlea"]},
    {n:2,  name:"Scala tympani",   accept:["scala tympani"],                func:"Carries sound out of the cochlea.", fkeys:["carry","sound","out","cochlea"]},
    {n:3,  name:"Cochlear portion of cranial nerve VIII", accept:["cochlear nerve","cochlear portion of cranial nerve viii","cochlear portion of cranial nerve 8","cochlear portion of nerve viii","cochlear branch","cochlear portion"], func:"Sends hearing signals to the brain.", fkeys:["hearing","signal","brain","carry","transmit"]},
    {n:4,  name:"Organ of Corti",  accept:["organ of corti","spiral organ","spiral organ of corti"], func:"Detects sound.", fkeys:["detect","sound","receptor","hearing"]},
    {n:5,  name:"Tectorial membrane", accept:["tectorial membrane"],        func:"Helps bend the hair cells.", fkeys:["bend","hair cell","stimulat"]},
    {n:6,  name:"Basilar membrane",accept:["basilar membrane"],             func:"Supports the hair cells and moves with sound.", fkeys:["support","hair cell","move","vibrat","sound"]},
    {n:7,  name:"Hair cells",      accept:["hair cells","hair cell"],       func:"Turn sound into nerve signals.", fkeys:["sound","nerve","signal","convert","receptor","transduc"]},
  ]
},
];
