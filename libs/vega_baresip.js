const VegaTCP = require('./vega_tcp.js');
class VegaBaresip extends VegaTCP
{
  constructor(ip,port,type,active,debugMOD)
  {
    super(ip,port,active,debugMOD);
    this._type = type;
  }
  test()
  {
    this.send("/dial +79139345827");
  }
}
module.exports = VegaBaresip;
