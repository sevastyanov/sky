/**
 * @namespace Нэймспэйс, в котором хранятся все классы ядра фрэймворка
 * @name sky
 */
  
/**
 * Базовый класс для всех классов фреймворка
 *
 * @class Базовый класс для всех классов, определённых через Sky.define()
 * @name sky.Class
 */
sky.ClassManager.classAlias('sky.Class', function(cfg) {
  
  this.__initConfig(cfg);
  
  if (cfg && cfg.override && typeof cfg.override === 'object')
  {
    this.__initOverride(cfg.override);
  }
  
  return this.__construct();
  
});

/**
 * Вызов перезаписанного с помощью override метода
 * 
 * @param method
 * @param args
 * @returns
 */
sky.Class.prototype.callOverriden = function(args)
{
  var method = args.callee,
	  overridenMethod = method.$overriden,
      overridenScope  = method.$overridenScope;
  
  if (overridenMethod)
  {
    return overridenMethod.apply(overridenScope, args || []);
  }
  else
  {
    throw new Error('Не найден перезаписанный метод');
  }
};

/**
 * Вызывает метод родителя класса.
 *
 * Важно! Работает только в методах, переопределённых в прототипе.
 * 
 */
sky.Class.prototype.callParent = function(args)
{
  var method = args.callee,
  	  parentMethod = method.$owner.superclass[method.$name];

  if (parentMethod && parentMethod instanceof Function)
  {
    return parentMethod.apply(this, args || []);
  }
};

/**
 * Конструктор объекта
 */
sky.Class.prototype.__construct = function() {};

/**
 * Деструктор объекта
 */
sky.Class.prototype.__destruct = function()
{
  // удаляем все свойства, чтобы минимизировать возможные утечки
  for (var i in this)
  {
    if (this.hasOwnProperty(i))
    {
      delete this[i];
    }
  }
  
  this.destroyed = true;
};

/**
 * Алиас к функции sky.Class.prototype.__destruct
 */
sky.Class.prototype.destroy = function()
{
  this.__destruct();
};

/**
 * Инициализация перезаписанных методов
 * 
 * @param override
 */
sky.Class.prototype.__initOverride = function(override)
{
  var scope = override['scope'] || this;
  
  for (var i in override)
  {
    if ((!override.hasOwnProperty(i)) || i === 'scope')
    {
      continue;
    }
    
    
    
    override[i].$overriden = this[i];
    override[i].$overridenScope = this;
    
    (function(i) {
      this[i] = function()
      {
        override[i].apply(scope, arguments);
      };
    }).call(this, i);
  }
};

/**
 * Применение конфигурации к созданному экземпляру объекта
 *
 * @param cfg {Object} конфигурация, переданная при создании экземпляра объекта
 */
sky.Class.prototype.__initConfig = function(cfg)
{
  cfg = cfg || {};

  // переданную конфигурацию будем совмещать с конфигурацией, которая по-умолчанию
  var defaultCfg = this.config;

  for (var i in defaultCfg)
  {
    if (!cfg.hasOwnProperty(i) && defaultCfg.hasOwnProperty(i))
    {
      cfg[i] = defaultCfg[i];
    }
  }
  
  for (var i in cfg)
  {
    if (cfg.hasOwnProperty(i))
    {
      this[i] = cfg[i];
    }
  }

};