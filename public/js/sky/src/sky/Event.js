Sky.define('sky.Event', /** @lends sky.Event.prototype */{

  /**
   * Вызывает все функции, которые подисаны на событие
   * 
   * @method fire
   * @public
   */
  fire: function () 
  {
    var listeners = this.listeners,
        args      = this.args,
        lastIndex = args.length;
    
    args.unshift(this);
    
    for (var i = 0, len = listeners.length; i < len; i++)
    {
      var listener = listeners[i];
      
      args[lastIndex + 1] = listener.cfg;
      
      listener.fn.apply(listener.scope, args);
    }
    
    return true;
    
  }

});