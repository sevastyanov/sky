/**
 * @class Менеджер классов
 * @name sky.ClassManager
 */

(/** @lends sky.ClassManager */{

  _classXtypes:  {},
  _classDefined: {},

  /**
   * Функция, кэширующая на стороне клиента файлы
   *
   * @param fileName {String} имя файла
   */
  loadCachedFile: function (fileName)
  {
    var url = fileName + (Sky.isDebug ? '?_date=' + new Date() : '?_version=' + Sky.build),
    	result = $.ajax({
	    	async: false,
	    	url: url
	    });
    
    return result.responseText;

  },

  /**
   * Синхронно подгружает JS-файл и выполняет его в контексте window 
   * 
   * @param {String} fileName - имя запрашиваемого файла
   */
  injectScript: function(fileName)
  {
    // берём из кэша файл
    var classTxt = this.loadCachedFile(fileName);

    // нашли файл в хранилище, либо на сервере - делаем eval
    if (classTxt)
    {
      new Function(classTxt + "\n//@ sourceURL=" + fileName)();
    }
  },
  
  /**
   * Синхронная загрузка нескольких js-файлов
   */
  injectScripts: function()
  {
    for (var i = 0, ln = arguments.length; i < ln; i++)
    {
      this.injectScript(arguments[i]);
    }
  },

  /**
   * Создаёт и расширяет класс на основе переданного прототипа.<br><br>
   *
   *   Прототип - это объект, описывающий создаваемый класс. Он должен содержать все общие не изменяющиеся методы и свойства для всех создаваемых
   *   экземпляров класса и его детёнышей. Если попытаться в ходе работы скрипта изменить эти методы и свойства то они поменяются у всех экземпляров
   *   класса и, с большой долей вероятности, у всех экземпляров детёнышей. Названия свойств и методов прототипа могут быть любыми,
   *   кроме зарезервированных слов:
   *   <ul>
   *     <li>constructor  - конструктор класса, в нём должны определяться все изменяемые для экземпляра класса свойства и методы</li>
   *     <li>extend       - название класса, от которого хотим унаследовать определяемый класс</li>
   *     <li>config       - конфигурация объекта, которая будет использоваться по-умолчанию</li>
   *     <li>alias        - синоним для класса</li>
   *     <li>xtype        - тип класса для упрощённого описания компонентов</li>
   *     <li>requires     - массив с казваниями классов, которые необходимо подгрузить ПОСЛЕ создания класса для его корректной работы; может быть полезно при работе с xtype</li>
   *     <li>singleton    - если true, то создаётся объект, который будет синглетоном</li>
   *     <li>self         - ссылка внутри объекта на свой конструктор</li>
   *   </ul>
   *
   * @param {String} className имя опредеяемого класса
   * @param {Object} prototype прототип опредеяемого класса
   */
  define: function (className, prototype)
  {
    if (!prototype)
    {
      prototype = {};
    }

    /*
     * подготавливаем данные для определения класса
     */


    var simpleClsName = className.replace(/\./g, '_'),
        subc, 
        superc;    // класс, от которого наследуем
    
    if (prototype.hasOwnProperty('constructor'))
    {
      subc = prototype.constructor;
      delete prototype.constructor;
    }
    else
    {
      subc = function() { 
    	return this.callParent(arguments); 
      };
    }

    // определяем родителя
    superc = prototype.extend ? this.require(prototype.extend) : this.require('sky.Class');
    // удаляем информацию о родителе из прототипа
    delete prototype.extend;

    /*
     * начинаем создание класса
     */

    // "пустышка" для прототипа суперкласса
    var F = function(){};

    // создаём экземпляр прототипа родителя
    F.prototype = superc.prototype;
    subc.prototype = new F();
    // указываем для родителя конструктор
    subc.prototype.constructor = subc;
    subc.prototype.name        = className;
    subc.prototype.className   = className;

    // сохраняем прототип родителя (ТОЛЬКО ДЛЯ последующих вызовов, ни в коем случае не изменять!)
    subc.superclass  = superc.prototype;
    subc.displayName = className; // в теории, должно помочь при дебаге http://www.alertdebugging.com/2009/04/29/building-a-better-javascript-profiler-with-webkit/
    subc.$superСlass = superc; // для работы функции instanceOf






    // ============================================================================================
    //                               копируем конфигурацию родителя
    // ============================================================================================

    if ('config' in subc.prototype)
    {
      var cfg = subc.prototype.config;
      var newCfg = {};

      for (var i in cfg)
      {
        if (!prototype.config || (prototype.config && !(i in prototype.config)))
        {
          newCfg[i] = cfg[i];
        }
      }

      subc.prototype.config = newCfg;
    }
    else
    {
      subc.prototype.config = {};
    }

    // дополняем из прототипа конфиг родителя
    if ('config' in prototype)
    {
      for (var i in prototype.config)
      {
        if (prototype.config.hasOwnProperty(i))
        {
          subc.prototype.config[i] = prototype.config[i];
        }
      }

      delete prototype.config; // удаляем ссылку на конфиг в прототипе, чтоб не перезаписать конфиг на следующем этапе
    }

    // запоминаем, какой надо создать алиас
    var classAlias = prototype.alias;
    delete prototype.alias;
    
    // запоминаем необходимые классы для подгрузки
    var classRequires = prototype.requires;
    delete prototype.requires;

    // ================================================================
    //      переопределяем свойства и методы определяемого класса
    // ================================================================

    for (var i in prototype)
    {
      if (prototype.hasOwnProperty(i))
      {
        subc.prototype[i] = prototype[i];

        // если функция, то добавляем к ней нужную информацию для работы функции callParentDeprecated
        if (prototype[i] instanceof Function)
        {
          subc.prototype[i].$owner = subc;
          subc.prototype[i].$name = i;
          subc.prototype[i].displayName = subc + '.' + i + '()'; // в теории, должно помочь при дебаге http://www.alertdebugging.com/2009/04/29/building-a-better-javascript-profiler-with-webkit/
        }
      }
    }

      // для работы функции callParent в конструкторе
    subc.$owner = subc;
    subc.$name = 'constructor';

    if (prototype.singleton)
    {
      subc = new subc();
    }

    // регистрируем класс и, если необходимо, то создаём для него алиас и регистрируем xtype
    this.classAlias(className, subc);


    if (classAlias)
    {
      this.classAlias(classAlias, subc);
    }

    if (classRequires)
    {
      var newClsRequired =  false; // флаг, помечающий, что были запрошены с сервера новые классы
      
      for (var i = 0, ln = classRequires.length; i < ln; i++)
      {
        if (!this._classDefined[classRequires[i]])
        {
          // в правильной минимизированной версии на релиз-сервере сюда попасть не должны
          if (!newClsRequired)
          {
            console.group(className + ' require:');
            newClsRequired = true;
          }
          
          this.require(classRequires[i]);
        }
      }
      
      if (newClsRequired)
      {
        console.groupEnd(className + ' require:');
      }
    }

  },

  /**
   * Устанавливает имя функции с нэймспэйсом в глобальной области видимости
   *
   * @param className     {String}   имя класса, которое хотим присвоить функции
   * @param classFunction {Function}
   */
  classAlias: function (className, classFunction)
  {
    var ns = className.split('.'),
        child = Sky.global;

    for (var j = 0, ln = ns.length - 1; j < ln; j++)
    {
      var nsPart = ns[j];
      
      child[nsPart] = child[nsPart] || {};
      child         = child[nsPart];
    }

    // создаём класс в нэймспэйсе
    child[ns[j]] = classFunction;
    // индексируем класс по имени
    this._classDefined[className] = classFunction;

  },

  /**
   * Создаёт экземпляр объекта, в случае необходимости подгружая объект
   *
   * @param {String} className имя класса
   * @param {Object} cfg конфигурация объекта
   */
  create: function (className, cfg)
  {
    var cls = this.require(className);

    return new cls(cfg);

  },

  /**
   * Подгружает классы перед использованием
   * @example
   *
   * sky.ClassManager.requires(
   *   'sky.Test',
   *   'sky.Test2'
   * );
   *
   */
  requires: function()
  {
    for (var i in arguments)
    {
      if (arguments.hasOwnProperty(i))
      {
        this.require(arguments[i]);
      }
    }
  },

  /**
   * Автоматически подгружает класс и возвращает ссылку на его конструктор, либо генерирует исключение
   *
   * @param {String} className имя класса
   */
  require: function (className)
  {
    if (!(className in this._classDefined))
    {
      var fileName = Sky.skyRoot + 'src/' + className.replace(/\./g, '/') + '.js';

      this.injectScript(fileName);

      // предотвращаем многократную автоподгрузку класса, если его не нашли
      if (!(className in this._classDefined))
      {
        throw new Error(className + ' не найден');
      }
      
      console.warn('[Предупреждение!] Синхронная подгрузка класса: ' + className);

    }

    return this._classDefined[className];

  },
  
  /**
   * @memberOf sky.ClassManager
   */
  init: function() 
  {
    this.classAlias('sky.ClassManager', this);
    delete this.init;
  }
    
}).init();