var Physics = {
  
};

Physics.prototype = {
  'destroy': true,
  'integrate': true,
  'viscosity': true,
  'particles': true
};

var Particle = {
  
};

Particle.prototype = {
  'pos': true,
  'acc': true,
  'vel': true,
  'fixed': true,
  'id': true,
  'mass': true,
  'behaviours': true,
  'radius': true,
  'moveTo': true,
  'setMass': true,
  'setRadius': true,
  'update': true
};

var Vector = {
  'add': true,
  'sub': true,
  'project': true
};

Vector.prototype = {
  'set': true,
  'add': true,
  'sub': true,
  'scale': true,
  'dot': true,
  'cross': true,
  'mag': true,
  'magSq': true,
  'dist': true,
  'distSq': true,
  'norm': true,
  'limit': true,
  'copy': true,
  'clone': true,
  'clear': true
};

var Behaviour = {
  'GUID': true
};

Behaviour.prototype = {
  'GUID': true,
  'apply': true
};

var Attraction = {

};

Attraction.prototype = {
  'target': true,
  'radius': true,
  'strength': true,
  'setRadius': true,
  'apply': true
};

var Collision = {

};

Collision.prototype = {
  'useMass': true,
  'callback': true,
  'pool': true,
  '_delta': true
}

var EdgeBounce = {

};

EdgeBounce.prototype = {
  'min': true,
  'max': true
}

var EdgeWrap = {

};

EdgeWrap.prototype = {
  'min': true,
  'max': true
};

var Wander = {

};

Wander.prototype = {
  'jitter': true,
  'radius': true,
  'strength': true,
  'theta': true
};

var ConstantForce = {

};