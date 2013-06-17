(function() {

  /**
   * @class  Класс, отвечающий за работу всплывающих окон
   * @name   sky.PopupManager
   * @author Sevastyanov Cyril
   * @since  2012-09-20
   */
Sky.define('sky.PopupManager', {});
  
  var popupElements = [];

  //====================================================================================================
  //
  //                                        Методы класса
  //
  //====================================================================================================
  /**
   * Навешивает обработчик события mousedown на переданный элемент и сохраняет
   * его во внутренний массив для последующего удаления со страницы.
   * 
   * Особенности:
   *   Если элемент не вставлен в DOM, то вставляет его в боди.
   *   Устанавливает свойство css visibility = visible.
   *
   * @param {HTMLElement} el                - элемент, который нужно скрыть
   * @param {Function}    callback          - функция, которая вызывается при скрытии элемента
   * @param {Object}      context           - контекст выполнения функции callback
   * @param {Boolean}     hideOtherIfExists - если передано true, то это означает, что необходимо скрыть все остальные всплывашки
   * 
   * @public 
   */
  sky.PopupManager.show = function(el, callback, context, hideOtherIfExists)
  {
    // скрываем все всплывающие элементы, если надо
    if (hideOtherIfExists)
    {
      this.hideAll();
    }
   
    $(el).bind('click', this.onElClick);
    
    // регистрируем всплывающий элемент
    popupElements.push({
      el: el, 
      fn: typeof callback === 'function' ? callback : Sky.emptyFn,
      context: context || el
    });
   
    // вставляем его в боди, если ещё не вставлено
    document.body.appendChild(el);
   
    $(el).css({
      zIndex:     sky.DOM.getMaxZIndex() + 1,
      position:   'absolute',
      visibility: 'visible'
    });
   
  };
  
  /**
   * Удаляет обработчик события mousedown на переданном элементе
   *
   * @param {HTMLElement} el - элемент, у которого удаляем обработчик события
   * @public
   */
  sky.PopupManager.hide = function(el)
  {
    $(el).unbind('click', this.onElClick);
    
    // ищем скрываемый элемент
    for (var len = popupElements.length, i = len - 1; i >= 0; i--)
    {
      var popupElement = popupElements[i];
     
      if (popupElement.el === el)
      {
        // вызываем коллбэк, если он был передан
        popupElement.fn.call(popupElement.context);
       
        // удаляем элемент из массива всплывашек
        popupElements.splice(i, 1);
       
        // если элемент вставлен в DOM, то удаляем его
        if (el.parentNode)
        {
          el.parentNode.removeChild(el);
        }
       
        return;
      }
    }
  };
  
  /**
   * Проходит по всем элементам элментам, которые нужно удалить со странице
   * и вызывает функцию для их правильного скрытия со со страницы
   */
  sky.PopupManager.hideAll = function()
  {
    while (popupElements.length) 
    {
      this.hide(popupElements[0].el);
    }
  };








































  //====================================================================================================
  //
  //                                     Обработчики событий
  //
  //====================================================================================================
  
  /**
   * Обраьотчик события onClick
   *
   * @param {Event} e - объект события, передаваемый при происхождении события
   */
  sky.PopupManager.onElClick = function(e)
  {
    e.stopPropagation();
  };
  
  
  /**
   * Событие клика по телу страницы
   */
  sky.PopupManager.onBodyClick = function(e)
  {
    this.hideAll();
  };
  
  $(document).on('click', sky.PopupManager.onBodyClick.bind(sky.PopupManager));
  
})();
