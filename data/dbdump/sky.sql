-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.1.60-community - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL version:             7.0.0.4228
-- Date/time:                    2013-06-17 01:45:09
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table sky.sky_blank_tree
DROP TABLE IF EXISTS `sky_blank_tree`;
CREATE TABLE IF NOT EXISTS `sky_blank_tree` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'интентификатор',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'идентификатор родителя',
  `hierarchy` mediumtext COMMENT 'иерархия для быстрого формирования дерева',
  `level` int(11) NOT NULL COMMENT 'иерархия для быстрого формирования дерева',
  `order` int(11) NOT NULL DEFAULT '0' COMMENT 'порядок сортировки',
  `name` varchar(255) NOT NULL COMMENT 'имя элемента дерева',
  `description` text NOT NULL COMMENT 'описание',
  `status` enum('active','not_active','deleted') NOT NULL DEFAULT 'not_active' COMMENT 'статус (активно, не активно, удалено)',
  PRIMARY KEY (`id`),
  KEY `prent_id_index` (`parent_id`),
  KEY `hierarchy_index` (`hierarchy`(32),`order`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_blank_tree: ~5 rows (approximately)
/*!40000 ALTER TABLE `sky_blank_tree` DISABLE KEYS */;
INSERT INTO `sky_blank_tree` (`id`, `parent_id`, `hierarchy`, `level`, `order`, `name`, `description`, `status`) VALUES
	(1, 0, '0', 0, 0, 'Root', '', 'active'),
	(2, 5, '0/1/4/3/5', 4, 0, 'Child1', '', 'active'),
	(3, 4, '0/1/4', 2, 0, 'Child2', '', 'active'),
	(4, 1, '0/1', 1, 0, 'Child3', '', 'active'),
	(5, 3, '0/1/4/3', 3, 0, 'Child4', '', 'active');
/*!40000 ALTER TABLE `sky_blank_tree` ENABLE KEYS */;


-- Dumping structure for table sky.sky_menu_tree
DROP TABLE IF EXISTS `sky_menu_tree`;
CREATE TABLE IF NOT EXISTS `sky_menu_tree` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'интентификатор',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'идентификатор родителя',
  `hierarchy` mediumtext COMMENT 'иерархия для быстрого формирования дерева',
  `level` int(11) NOT NULL COMMENT 'иерархия для быстрого формирования дерева',
  `order` int(11) NOT NULL DEFAULT '0' COMMENT 'порядок сортировки',
  `name` varchar(255) NOT NULL COMMENT 'имя элемента дерева',
  `inherit_name_from_page` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'если 1, то имя пункта меню будет браться из имени страницы',
  `page_id` int(10) unsigned NOT NULL COMMENT 'идентификатор страницы',
  `status` enum('active','not_active','deleted') NOT NULL DEFAULT 'not_active' COMMENT 'статус (активно, не активно, удалено)',
  PRIMARY KEY (`id`),
  KEY `prent_id_index` (`parent_id`),
  KEY `hierarchy_index` (`hierarchy`(32),`order`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_menu_tree: ~7 rows (approximately)
/*!40000 ALTER TABLE `sky_menu_tree` DISABLE KEYS */;
INSERT INTO `sky_menu_tree` (`id`, `parent_id`, `hierarchy`, `level`, `order`, `name`, `inherit_name_from_page`, `page_id`, `status`) VALUES
	(6, 0, '/0/', 0, 1, 'Главное меню', 0, 1, 'active'),
	(8, 0, '/0/', 0, 2, 'Боковое меню', 0, 1, 'active'),
	(15, 6, '/0/6/', 1, 4, 'О проекте', 0, 36, 'active'),
	(16, 6, '/0/6/', 1, -1, 'Обо мне', 0, 38, 'active'),
	(18, 6, '/0/6/', 1, -4, 'На главную', 0, 1, 'active'),
	(20, 6, '/0/6/', 1, 5, 'Новый элемент', 0, 0, 'deleted'),
	(21, 6, '/0/6/', 1, -2, 'Новости', 0, 44, 'active');
/*!40000 ALTER TABLE `sky_menu_tree` ENABLE KEYS */;


-- Dumping structure for table sky.sky_news
DROP TABLE IF EXISTS `sky_news`;
CREATE TABLE IF NOT EXISTS `sky_news` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description_short` mediumtext NOT NULL,
  `description` mediumtext NOT NULL,
  `created` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('active','not_active','deleted') NOT NULL DEFAULT 'not_active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_news: ~2 rows (approximately)
/*!40000 ALTER TABLE `sky_news` DISABLE KEYS */;
INSERT INTO `sky_news` (`id`, `name`, `description_short`, `description`, `created`, `user_id`, `status`) VALUES
	(1, 'Привет, мир!', '<p>Привет! Это первая новость на этом сайте! Очень рад, что появилась возможность их тут размещать. В новостях я буду публиковать информацию о самых последних изменениях проекта "Sky CMS".</p>\n<p>Итак, что уже есть:</p>\n<ul>\n<li>создание статичных страниц</li>\n<li>создание меню</li>\n<li>авторизация через Facebook</li>\n<li>новости</li>\n</ul>\n<p>Что планируется в ближайшее время:</p>\n<ul>\n<li>модуль LRS для Tin Can (собственно, ради этого сейчас развивается CMS)</li>\n<li>личный кабинет пользователя</li>\n</ul>\n<p>Самое трудное уже позади (надеюсь). Впереди светлое будущее!</p>', '', '2013-06-16 20:25:41', 1, 'active'),
	(2, 'Об авторизации на Facebook', '<p>В субботу прикрутил к сайту авторизацию на Facebook через OAuth и сейчас очень хочу поделиться, как это работает.</p>\n<p>Итак, когда пользователь нажимает ссылку "Авторизоваться через Facebook", открывается модальное окно, в котором показывается оригинальная форма авторизации социальной сети. После авторизации показывается сообщение о данных, к которым хочет получить доступ сайт. Если пользователь подтверждает, что хочет дать доступ, сайт запрашивает его ФИО и на их основе создает учётную запись на сайте, привязывая её к учётной записи Facebook. Никаких подтверждений по электронной почте делать не надо.</p>\n<p>В перспективе планирую добавить аналогичную авторизацию через vk, а так же дать возможность привязывать к одной учётной записи одновременно несколько учётных записей Facebook и Вконтакте. На стороне сервера уже всё для этого есть. Надо только сделать личный кабинет пользователя.</p>\n<p>В общем, всё максимально просто! Я был поражен, как быстро удалось зарегистрироваться на сайте, используя OAuth. Попробуйте и вы тоже!</p>', '', '2013-06-16 20:50:04', 1, 'active');
/*!40000 ALTER TABLE `sky_news` ENABLE KEYS */;


-- Dumping structure for table sky.sky_page_label
DROP TABLE IF EXISTS `sky_page_label`;
CREATE TABLE IF NOT EXISTS `sky_page_label` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `page_id` int(11) unsigned NOT NULL,
  `label` varchar(32) NOT NULL,
  `module` varchar(32) NOT NULL,
  `action` varchar(64) NOT NULL,
  `data` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_page_label: ~20 rows (approximately)
/*!40000 ALTER TABLE `sky_page_label` DISABLE KEYS */;
INSERT INTO `sky_page_label` (`id`, `page_id`, `label`, `module`, `action`, `data`) VALUES
	(1, 6, 'main', 'statics', 'text', 's:18:"ауцауцауц";'),
	(4, 1, 'main', 'statics', 'text', 's:84:"<p>Привет, Мир!!!</p>\n<p><img src="../upload/e-XDOuUpupY.jpg" alt="" /></p>";'),
	(5, 26, 'header', 'statics', 'text', 's:5:"false";'),
	(6, 1, 'footer', 'statics', 'text', 's:0:"";'),
	(7, 1, 'menu', 'menu', 'menu', 'a:2:{s:2:"id";s:1:"6";s:4:"type";s:10:"horizontal";}'),
	(8, 11, 'main', 'statics', 'text', 's:11:"ygiuygiugui";'),
	(9, 38, 'main', 'statics', 'text', 's:2794:"<p style="text-align: justify;"><img style="float: right; margin-left: 10px;" src="../upload/OhJcyrOHXKc.jpg" alt="" width="410" height="765" />Добрый день! На этой странице я хочу рассказать о себе.&nbsp;</p>\n<p style="text-align: justify;">Меня зовут Севастьянов Кирилл. В сфере вэб я уже третий год. Начинал с того, что дорабатывал движок трекера для DC++ в 2009 году.</p>\n<p style="text-align: justify;">С декабря 2010 по август 2011 работал программистом в вэб-студии NW-Pro.</p>\n<p style="text-align: justify;">С сентября 2011 по ноябрь 2012 работал в сети автосалонов Аврора в команде с отличными программистами. Там мы разрабатывали корпоративный софт, серверной частью которого служил самописный движок на PHP + MSSQL, клиентской - ExtJS 4. Кроме того, там я получил отличный опыт разработки фреймворка наподобие ExtJS.</p>\n<p style="text-align: justify;">С декабря 2012 по настоящее время работаю в корпорации IBS фронт-энд разработчиком.</p>\n<p style="text-align: justify;">Этот сайт создается как демонстрация моих умений, накопленных за последние 3 года.</p>\n<p style="text-align: justify;">О себе:</p>\n<ul>\n<li style="text-align: justify;">умный</li>\n<li style="text-align: justify;">целеустремлённый</li>\n<li style="text-align: justify;">аккуратный</li>\n<li style="text-align: justify;">отлично знаю PHP</li>\n<li style="text-align: justify;">великолепно знаком с Java Script (+jQuery, ExtJS, отлично знаком с браузерным API, могу обходиться без описанных выше библиотек)</li>\n<li style="text-align: justify;">хорошо знаю MySQL, MSSQL (работал с представлениями, хранимыми процедурами)</li>\n<li style="text-align: justify;">умею аккуратно верстать методом независимых блоков. Так же применяю семантическую верстку.</li>\n<li style="text-align: justify;">умею настраивать связку Apache + PHP + MySQL (MSSQL)</li>\n<li style="text-align: justify;">знания английского на уровне чтения документации.&nbsp;</li>\n</ul>";'),
	(10, 36, 'main', 'statics', 'text', 's:66:"<p>Страница находится в разработке</p>";'),
	(11, 1, 'logo', 'statics', 'image', 's:18:"/upload/logo-3.png";'),
	(12, 1, 'left_menu', 'menu', 'menu', 'a:2:{s:2:"id";s:1:"8";s:4:"type";s:8:"vertical";}'),
	(13, 40, 'main', 'statics', 'text', 's:57:"<p>vvds<img src="../upload/OhJcyrOHXKc.jpg" alt="" /></p>";'),
	(14, 1, 'auth', 'user', 'auth', 'b:0;'),
	(15, 41, 'main', 'news', 'list', 's:2:"41";'),
	(16, 44, 'main', 'news', 'list', 's:2:"45";'),
	(17, 45, 'main', 'news', 'one', 'b:0;'),
	(18, 1, 'h1', 'statics', 'h1', 's:31:"Главная страница";'),
	(19, 36, 'h1', 'statics', 'h1', 's:17:"О проекте";'),
	(20, 38, 'h1', 'statics', 'h1', 's:13:"Обо мне";'),
	(21, 44, 'h1', 'statics', 'h1', 's:14:"Новости";'),
	(22, 45, 'h1', 'statics', 'text', 's:0:"";');
/*!40000 ALTER TABLE `sky_page_label` ENABLE KEYS */;


-- Dumping structure for table sky.sky_page_tree
DROP TABLE IF EXISTS `sky_page_tree`;
CREATE TABLE IF NOT EXISTS `sky_page_tree` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'интентификатор',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'идентификатор родителя',
  `path` mediumtext NOT NULL COMMENT 'полный путь к элементу',
  `hierarchy` mediumtext COMMENT 'иерархия для быстрого формирования дерева',
  `level` int(11) NOT NULL COMMENT 'иерархия для быстрого формирования дерева',
  `order` int(11) NOT NULL DEFAULT '0' COMMENT 'порядок сортировки',
  `code` varchar(50) NOT NULL DEFAULT '' COMMENT 'код элемента',
  `name` varchar(255) DEFAULT NULL COMMENT 'имя элемента дерева',
  `title` text COMMENT 'заголовок',
  `description` text COMMENT 'описание',
  `keywords` text COMMENT 'ключевые слова',
  `template` varchar(50) NOT NULL DEFAULT 'main' COMMENT 'шаблон страницы',
  `status` enum('active','not_active','deleted') NOT NULL DEFAULT 'not_active' COMMENT 'статус (активно, не активно, удалено)',
  PRIMARY KEY (`id`),
  KEY `prent_id_index` (`parent_id`),
  KEY `hierarchy_index` (`hierarchy`(32),`order`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_page_tree: ~9 rows (approximately)
/*!40000 ALTER TABLE `sky_page_tree` DISABLE KEYS */;
INSERT INTO `sky_page_tree` (`id`, `parent_id`, `path`, `hierarchy`, `level`, `order`, `code`, `name`, `title`, `description`, `keywords`, `template`, `status`) VALUES
	(1, 0, '', '/0/', 0, 0, '', 'Главная страница', 'Главная страница', '', '', 'main', 'active'),
	(36, 1, '/about', '/0/1/', 1, -2, 'about', 'О проекте', 'О проекте', '', '', 'main', 'active'),
	(38, 36, '/about/about_me', '/0/1/36/', 2, -1, 'about_me', 'Обо мне', 'Обо мне', '', '', 'main', 'active'),
	(40, 36, '/about/new_item', '/0/1/36/', 2, 1, 'new_item', 'Новый элемент', '', '', '', 'main', 'deleted'),
	(41, 1, '/new_item', '/0/1/', 1, -1, 'new_item', 'Новый элемент', '', '', '', 'main', 'deleted'),
	(42, 0, 'new_item', '/0/0/', 1, 1, 'new_item', 'Новый элемент', NULL, NULL, NULL, 'main', 'deleted'),
	(43, 42, 'new_item/new_item', '/0/0/42/', 2, 1, 'new_item', 'Новый элемент', NULL, NULL, NULL, 'main', 'not_active'),
	(44, 1, '/news', '/0/1/', 1, 0, 'news', 'Новости', '', '', '', 'main', 'active'),
	(45, 44, '/news/one', '/0/1/44/', 2, 1, 'one', 'Одна новость', '', '', '', 'main', 'active');
/*!40000 ALTER TABLE `sky_page_tree` ENABLE KEYS */;


-- Dumping structure for table sky.sky_user
DROP TABLE IF EXISTS `sky_user`;
CREATE TABLE IF NOT EXISTS `sky_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(32) DEFAULT NULL,
  `password` char(32) DEFAULT NULL,
  `lastname` varchar(64) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `patronymic` varchar(64) NOT NULL,
  `status` enum('active','not_active','deleted') NOT NULL DEFAULT 'not_active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_user: ~1 rows (approximately)
/*!40000 ALTER TABLE `sky_user` DISABLE KEYS */;
INSERT INTO `sky_user` (`id`, `login`, `password`, `lastname`, `firstname`, `patronymic`, `status`) VALUES
	(1, NULL, NULL, 'Sevastyanov', 'Cyrill', '', 'active');
/*!40000 ALTER TABLE `sky_user` ENABLE KEYS */;


-- Dumping structure for table sky.sky_user_oauth
DROP TABLE IF EXISTS `sky_user_oauth`;
CREATE TABLE IF NOT EXISTS `sky_user_oauth` (
  `server_id` int(10) NOT NULL,
  `server_uid` varchar(64) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`server_id`,`server_uid`),
  KEY `user_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_user_oauth: ~1 rows (approximately)
/*!40000 ALTER TABLE `sky_user_oauth` DISABLE KEYS */;
INSERT INTO `sky_user_oauth` (`server_id`, `server_uid`, `user_id`, `date`) VALUES
	(1, '100000244710254', 1, '2013-06-16 00:57:44');
/*!40000 ALTER TABLE `sky_user_oauth` ENABLE KEYS */;


-- Dumping structure for table sky.sky_user_session
DROP TABLE IF EXISTS `sky_user_session`;
CREATE TABLE IF NOT EXISTS `sky_user_session` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` char(64) NOT NULL,
  `cookie` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `ip` varchar(15) DEFAULT NULL,
  `user_agent` varchar(128) DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `created` datetime NOT NULL,
  `last_visit` datetime NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`id`),
  KEY `last_visit_index` (`last_visit`,`cookie`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table sky.sky_user_session: ~2 rows (approximately)
/*!40000 ALTER TABLE `sky_user_session` DISABLE KEYS */;
INSERT INTO `sky_user_session` (`id`, `key`, `cookie`, `ip`, `user_agent`, `user_id`, `created`, `last_visit`, `data`) VALUES
	(1, '2b44617082c4b06c628687304fa61daa74bf5d0bba43fc9f7c0b7676e66af067', 0, '89.253.230.51', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.2 (KHTML, like Gecko, WEBO Pulsar) Chrome/15.0.874.106 Safari/535.2', NULL, '2013-06-16 18:54:07', '2013-06-16 18:54:07', NULL),
	(2, '92875a4f795894994ab5bc8a12a380e20c937e5afaf531576b19094ad3cf827b', 1, '93.81.243.120', 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36', 1, '2013-06-16 20:11:08', '2013-06-17 01:36:05', NULL);
/*!40000 ALTER TABLE `sky_user_session` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
