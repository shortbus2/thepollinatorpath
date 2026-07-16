window.GARDEN_BRAIN = {
  version: "4.0.0-ai-foundation",
  scope: "front-garden",
  coordinateSystem: { unit: "percent", origin: "top-left", note: "Map positions are normalized to each source image." },
  corrections: [
    { map: "front-west", displayedNumber: 2, actualPlantNumber: 4, note: "West-bed circles labeled 2 are Bee Balm (#4)." },
    { map: "front-west", plantNumber: 27, quantity: 3, note: "Three Little Bluestems beside the prairie wine cups." }
  ],
  areas: [
    {id:"front-east",name:"Front Garden — East Side",map:"front-east",public:true},
    {id:"front-west",name:"Front Garden — West Side",map:"front-west",public:true},
    {id:"oak-garden",name:"Oak Garden",map:"front-east",public:true},
    {id:"boulder-garden",name:"Boulder Garden",map:"front-east",public:true},
    {id:"water-feature-garden",name:"Water Feature Garden",map:"front-east",public:true},
    {id:"garage-wall",name:"Garage Wall Garden",map:"front-west",public:true},
    {id:"entry-planter",name:"Entry Utility Garden",map:"front-west",public:true, formerName:"Planter in front of trash cans"}
  ],
  objects: [
    {id:"tree-sassy-pants",type:"tree",name:"Sassy Pants",species:"Honeycrisp apple",area:"front-west",public:true,measurements:{westOfDrivewayIn:112,fromSidewalkIn:134},promptDays:30},
    {id:"tree-dick",type:"tree",name:"Dick",species:"Heritage oak",area:"front-east",public:true,measurements:{eastOfDrivewayIn:171,fromSidewalkIn:143},promptDays:45},
    {id:"tree-firebird",type:"tree",name:"Firebird",species:"Crabapple",area:"front-east",public:true,promptDays:45},
    {id:"feature-water",type:"habitat",name:"Water Feature",area:"water-feature-garden",public:true,promptDays:14},
    {id:"feature-birdbath",type:"habitat",name:"Bird Bath",area:"front-east",public:true,promptDays:14},
    {id:"boulder-showcase",type:"boulder",name:"Showcase Boulder",area:"oak-garden",public:true,promptDays:90},
    {id:"boulder-left",type:"boulder",name:"Left Boulder",area:"boulder-garden",public:true,promptDays:90},
    {id:"boulder-water",type:"boulder",name:"Water Feature Boulder",area:"water-feature-garden",public:true,promptDays:90},
    {id:"path-loop",type:"path",name:"Flagstone Path",area:"front-east",public:true,promptDays:180},
    {id:"feature-bee-soil",type:"habitat",name:"Ground-Nesting Bee Patch",area:"front-east",public:false,promptDays:21},
    {id:"feature-toad-1",type:"habitat",name:"Toad Shelter No. 1",area:"front-east",public:false,promptDays:30},
    {id:"feature-toad-2",type:"habitat",name:"Toad Shelter No. 2",area:"front-east",public:false,promptDays:30}
  ],
  maps: [
    {id:"front-east",name:"East Side",image:"images/maps/front-east-numbered.jpg",widthFt:33.5,heightFt:22.75,orientation:"sidewalk-bottom"},
    {id:"front-west",name:"West Side",image:"images/maps/front-west-numbered.jpg",orientation:"sidewalk-bottom"}
  ],
  placements: [
    {id:"sassy-anchor",kind:"object",objectId:"tree-sassy-pants",map:"front-west",x:20,y:31,precision:"surveyed",status:"active"},
    {id:"oak-anchor",kind:"object",objectId:"tree-dick",map:"front-east",x:53,y:18,precision:"surveyed",status:"active"},
    {id:"little-bluestem-west",kind:"plant",plantNumber:27,map:"front-west",x:66,y:33,quantity:3,shape:"cluster",precision:"confirmed",status:"active"}
  ],
  promptRules: { portraitDays: 0, observationDays: 30, featureDays: 60 }
};
