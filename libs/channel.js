class Channel
{
  constructor()
  {

  }
  refresh(obj)
  {
    try
    {
      obj = JSON.parse(obj);
      for(let key in obj)
      {
        if(this[key]!=='function') this[key] = obj[key];
      }
    }
    catch (e)
    {

    }
  }
}
module.exports = Channel;
