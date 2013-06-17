"use strict";

/**
 * @class Класс с различными методами для работы с DOM
 * @name sky.DOM
 */
Sky.define('sky.DOM', {});

(function() {
	
	var maxZIndex = 10000;  
	
	/**
	 * Получает максимальное значение zIndex среди элементов на странице
	 *
	 * @returns {Number}
	 */
	sky.DOM.getMaxZIndex = function()
	{
	  return maxZIndex++;
	};
})();