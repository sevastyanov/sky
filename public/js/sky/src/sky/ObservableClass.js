/**
 * Один из базовых классов, реализующий функционал подписи на внутренние события классов фрэймворка.
 * 
 * @example
 * 
 * // Существует два способа описания обработчиков событий в шаблонах компонентов
 * // Способ первый:
 * 
 * Sky.define('NewContainer1', {
 *   extend: 'sky.widget.container.Container',
 *   
 *   _init: function()
 *   {
 *     this.add([
 *       // реализуем подписку на событие click кнопки 
 *       {
 *         xtype: 'button',
 *         listeners: {
 *           click: {
 *             fn: function() {}, // обработчик события
 *             scope: this,       // контекст выполнения обработчика события. Может быть опущен.
 *             data: 123          // данные, которые надо передать обработчику события. Тоже может быть опущен.
 *           }
 *         }
 *       }
 *     ]);
 *   }
 * });
 * 
 * 
 * // Способ второй:
 * 
 * Sky.define('NewContainer2', {
 *   extend: 'sky.widget.container.Container',
 *   
 *   _init: function()
 *   {
 *     this.add([
 *       // реализуем подписку на событий change и input текстового поля 
 *       {
 *         xtype: 'field.text',
 *         listeners: {
 *           change: function() {}, // обработчик события change
 *           input:  function() {}, // обработчик события input
 *           scope:  this,          // контекст выполнения ВСЕХ обработчиков событий. Параметр может быть опущен.
 *         }
 *       }
 *     ]);
 *   }
 * });
 * 
 * @class Один из базовых классов, реализующий функционал подписи на события
 * @name sky.ObservableClass
 * @extends sky.Class
 */
Sky.define('sky.ObservableClass', /** @lends sky.ObservableClass.prototype */{

  // =========================================================================================================
  //
  //                                        ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТА
  //
  // =========================================================================================================
  
  constructor: function(cfg)
  {
    this.__events = {};
    
    if (cfg && cfg.listeners && typeof cfg.listeners === 'object')
    {
      this.__initListeners(cfg.listeners);
      delete cfg.listeners;
    }
    
    this.callParent(arguments);
  },
  
  __destruct: function ()
  {
    this.clearEvents();
    this.callParent(arguments);
  },
  
  /**
   * Инициализация подписчиков
   * 
   * @param listeners
   */
  __initListeners: function(listeners)
  {
    var listener,
        scope = listeners.scope || this;
    
    for (var i in listeners)
    {
      if (i !== 'scope' && listeners.hasOwnProperty(i))
      {
        listener = listeners[i];
        
        if (typeof listener === 'function')
        {
          this.on(i, listener, scope);
        }
        else if (Sky.isObject(listener) && (typeof listener.fn === 'function'))
        {
          this.on(i, listener.fn, listener.scope || scope, listener.data);
        }
      }
    }
  },

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  // =========================================================================================================
  //
  //                                            МЕТОДЫ КОМПОНЕНТА
  //
  // =========================================================================================================
  
  /**
   * Вызывает custom событие по его имени
   *
   * @method fireEvent
   * @param {String} type - тип события
   * @public
   */
  fireEvent: function (eventName) 
  {
    var events = this.__events,
        eventListeners,
        event;
    
    if (!events)
    {
      return null;
    }
    
    eventListeners = events[eventName];

    // Если подписчиков не существует, то выходим
    if (!eventListeners) 
    {
      return null;
    }
    
    // обрезаем первый элемент в объекте
    event = Sky.create('sky.Event', {
      target:    this,
      name:      eventName,
      listeners: eventListeners,
      args:      [].slice.call(arguments, 1)
    });

    // Вызываем custom событие
    return event.fire();
  },

  /**
   * Подписывает на событие компонента.
   *
   * @method on
   * @param {String} eventName     - имя события
   * @param {Function} fn     - функция, которая вызывается в момент наступления события
   * @param {Object} scope    - контекст
   * @param {Object} obj      - объект, который будет передан при возникновении события
   * @memberOf sky.ObservableClass
   * @public
   */
  on: function (eventName, fn, scope, cfg) 
  {
    var events = this.__events;
    
    scope = scope || this;
    
    if (!events[eventName])
    {
      events[eventName] = [];
    }

    events[eventName].push({
      fn: fn, 
      scope: scope, 
      cfg: cfg
    });
    
  },
  
  /**
   * Отписывается от события
   * @param eventName
   * @param fn
   * @param scope
   */
  un: function (eventName, fn, scope)
  {
    var events = this.__events;
    
    if (!events[eventName])
    {
      return;
    }
    
    var eventListeners = events[eventName],
        listener;
    
    scope = scope || this;
    
    for (var i = eventListeners.length - 1; i >= 0; i--)
    {
      listener = eventListeners[i];
      
      if (listener.fn === fn && listener.scope === scope)
      {
        eventListeners.splice(i, 1);
      }
    }
    
  },
  
  hasListeners: function()
  {
    return !!Object.getOwnPropertyNames(this.__events).length;
  },
  
  /**
   * Удаляет всех подписчиков на события экземпляра класса
   */
  clearEvents: function()
  {
    this.__events = {};
  }

});