
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `Article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Article` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `categoryId` varchar(255) DEFAULT NULL,
  `tagIds` json DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `isPublish` tinyint(1) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `article_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Article` DISABLE KEYS */;
INSERT INTO `Article` VALUES ('2ca73523-57cb-45bf-9cc5-70272a945e4d','Sample Article Title','This is the content of the sample article. It can be a long text with HTML formatting.','This is a brief summary of the sample article.','cat5','[\"tag1\", \"tag2\", \"tag3\"]','http://example.com/thumbnail.jpg',1,'2024-06-28 14:43:19','2024-06-28 14:43:19');
INSERT INTO `Article` VALUES ('art1','人工智能的未来','关于人工智能的内容...','简要介绍人工智能的未来。','cat5','[\"tag2\"]','ai_future.jpg',1,'2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Article` VALUES ('art2','十大编程语言','关于编程语言的内容...','编程语言概述。','cat4','[\"tag1\"]','programming_languages.jpg',1,'2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Article` VALUES ('art3','健康生活小贴士','关于健康生活的内容...','健康生活的小贴士。','cat2','[\"tag3\", \"tag4\"]','healthy_living.jpg',1,'2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Article` VALUES ('art4','探索世界','关于旅行的内容...','探索世界的指南。','cat3','[\"tag5\"]','exploring_world.jpg',1,'2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Article` VALUES ('art5','今年尝试的新爱好','关于爱好的内容...','今年值得尝试的新爱好。','cat3','[\"tag6\"]','hobbies.jpg',1,'2024-06-27 18:26:44','2024-06-27 18:26:44');
/*!40000 ALTER TABLE `Article` ENABLE KEYS */;
DROP TABLE IF EXISTS `ButtonAuth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ButtonAuth` (
  `buttonId` int NOT NULL AUTO_INCREMENT,
  `routeId` int DEFAULT NULL,
  `routeName` varchar(255) DEFAULT NULL,
  `buttonName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`buttonId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `buttonauth_ibfk_1` FOREIGN KEY (`routeId`) REFERENCES `RouteAuth` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `ButtonAuth` DISABLE KEYS */;
/*!40000 ALTER TABLE `ButtonAuth` ENABLE KEYS */;
DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` varchar(255) NOT NULL,
  `parentId` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES ('cat1',NULL,'科技','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Category` VALUES ('cat2',NULL,'健康','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Category` VALUES ('cat3',NULL,'生活方式','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Category` VALUES ('cat4','cat1','编程','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Category` VALUES ('cat5','cat1','人工智能','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Category` VALUES ('cat6','cat2','营养','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Category` VALUES ('cat7','cat2','健身','2024-06-27 18:26:44','2024-06-27 18:26:44');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
DROP TABLE IF EXISTS `RoleRoute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RoleRoute` (
  `roleRouteId` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL,
  `routeId` int NOT NULL,
  PRIMARY KEY (`roleRouteId`),
  UNIQUE KEY `roleId` (`roleId`,`routeId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `roleroute_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleId`),
  CONSTRAINT `roleroute_ibfk_2` FOREIGN KEY (`routeId`) REFERENCES `RouteAuth` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=390 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `RoleRoute` DISABLE KEYS */;
INSERT INTO `RoleRoute` VALUES (151,1,1);
INSERT INTO `RoleRoute` VALUES (283,1,2);
INSERT INTO `RoleRoute` VALUES (284,1,3);
INSERT INTO `RoleRoute` VALUES (285,1,4);
INSERT INTO `RoleRoute` VALUES (286,1,5);
INSERT INTO `RoleRoute` VALUES (287,1,6);
INSERT INTO `RoleRoute` VALUES (288,1,7);
INSERT INTO `RoleRoute` VALUES (289,1,8);
INSERT INTO `RoleRoute` VALUES (290,1,9);
INSERT INTO `RoleRoute` VALUES (291,1,10);
INSERT INTO `RoleRoute` VALUES (297,1,11);
INSERT INTO `RoleRoute` VALUES (298,1,12);
INSERT INTO `RoleRoute` VALUES (299,1,13);
INSERT INTO `RoleRoute` VALUES (300,1,15);
INSERT INTO `RoleRoute` VALUES (301,1,16);
INSERT INTO `RoleRoute` VALUES (302,1,17);
INSERT INTO `RoleRoute` VALUES (303,1,18);
INSERT INTO `RoleRoute` VALUES (304,1,19);
INSERT INTO `RoleRoute` VALUES (305,1,20);
INSERT INTO `RoleRoute` VALUES (306,1,21);
INSERT INTO `RoleRoute` VALUES (307,1,22);
INSERT INTO `RoleRoute` VALUES (308,1,23);
INSERT INTO `RoleRoute` VALUES (309,1,24);
INSERT INTO `RoleRoute` VALUES (310,1,25);
INSERT INTO `RoleRoute` VALUES (311,1,26);
INSERT INTO `RoleRoute` VALUES (312,1,27);
INSERT INTO `RoleRoute` VALUES (313,1,28);
INSERT INTO `RoleRoute` VALUES (314,1,29);
INSERT INTO `RoleRoute` VALUES (315,1,30);
INSERT INTO `RoleRoute` VALUES (316,1,31);
INSERT INTO `RoleRoute` VALUES (317,1,32);
INSERT INTO `RoleRoute` VALUES (318,1,33);
INSERT INTO `RoleRoute` VALUES (319,1,34);
INSERT INTO `RoleRoute` VALUES (320,1,35);
INSERT INTO `RoleRoute` VALUES (321,1,36);
INSERT INTO `RoleRoute` VALUES (322,1,37);
INSERT INTO `RoleRoute` VALUES (323,1,38);
INSERT INTO `RoleRoute` VALUES (324,1,39);
INSERT INTO `RoleRoute` VALUES (325,1,40);
INSERT INTO `RoleRoute` VALUES (326,1,41);
INSERT INTO `RoleRoute` VALUES (327,1,42);
INSERT INTO `RoleRoute` VALUES (328,1,43);
INSERT INTO `RoleRoute` VALUES (329,1,44);
INSERT INTO `RoleRoute` VALUES (330,1,45);
INSERT INTO `RoleRoute` VALUES (331,1,46);
INSERT INTO `RoleRoute` VALUES (332,1,47);
INSERT INTO `RoleRoute` VALUES (333,1,48);
INSERT INTO `RoleRoute` VALUES (334,1,49);
INSERT INTO `RoleRoute` VALUES (335,1,50);
INSERT INTO `RoleRoute` VALUES (336,1,51);
INSERT INTO `RoleRoute` VALUES (337,1,52);
INSERT INTO `RoleRoute` VALUES (338,1,53);
INSERT INTO `RoleRoute` VALUES (339,1,54);
INSERT INTO `RoleRoute` VALUES (340,1,55);
INSERT INTO `RoleRoute` VALUES (341,1,56);
INSERT INTO `RoleRoute` VALUES (342,1,57);
INSERT INTO `RoleRoute` VALUES (343,1,58);
INSERT INTO `RoleRoute` VALUES (344,1,59);
INSERT INTO `RoleRoute` VALUES (345,1,60);
INSERT INTO `RoleRoute` VALUES (346,1,61);
INSERT INTO `RoleRoute` VALUES (347,1,62);
INSERT INTO `RoleRoute` VALUES (348,1,63);
INSERT INTO `RoleRoute` VALUES (349,1,64);
INSERT INTO `RoleRoute` VALUES (350,1,65);
INSERT INTO `RoleRoute` VALUES (351,1,66);
INSERT INTO `RoleRoute` VALUES (352,1,67);
INSERT INTO `RoleRoute` VALUES (353,1,68);
INSERT INTO `RoleRoute` VALUES (354,1,69);
INSERT INTO `RoleRoute` VALUES (355,1,70);
INSERT INTO `RoleRoute` VALUES (356,1,71);
INSERT INTO `RoleRoute` VALUES (357,1,72);
INSERT INTO `RoleRoute` VALUES (358,1,73);
INSERT INTO `RoleRoute` VALUES (359,1,74);
INSERT INTO `RoleRoute` VALUES (360,1,75);
INSERT INTO `RoleRoute` VALUES (361,2,1);
INSERT INTO `RoleRoute` VALUES (362,2,2);
INSERT INTO `RoleRoute` VALUES (363,2,3);
INSERT INTO `RoleRoute` VALUES (364,2,4);
INSERT INTO `RoleRoute` VALUES (365,2,5);
INSERT INTO `RoleRoute` VALUES (366,2,6);
INSERT INTO `RoleRoute` VALUES (367,2,7);
INSERT INTO `RoleRoute` VALUES (368,2,8);
INSERT INTO `RoleRoute` VALUES (369,2,9);
INSERT INTO `RoleRoute` VALUES (370,2,10);
INSERT INTO `RoleRoute` VALUES (371,2,11);
INSERT INTO `RoleRoute` VALUES (372,2,12);
INSERT INTO `RoleRoute` VALUES (373,2,13);
INSERT INTO `RoleRoute` VALUES (374,2,15);
INSERT INTO `RoleRoute` VALUES (375,2,16);
INSERT INTO `RoleRoute` VALUES (376,2,17);
INSERT INTO `RoleRoute` VALUES (377,2,18);
INSERT INTO `RoleRoute` VALUES (378,2,19);
INSERT INTO `RoleRoute` VALUES (379,2,20);
INSERT INTO `RoleRoute` VALUES (380,2,21);
INSERT INTO `RoleRoute` VALUES (381,2,22);
INSERT INTO `RoleRoute` VALUES (382,2,23);
INSERT INTO `RoleRoute` VALUES (383,2,24);
INSERT INTO `RoleRoute` VALUES (384,2,25);
INSERT INTO `RoleRoute` VALUES (385,2,26);
INSERT INTO `RoleRoute` VALUES (386,2,27);
INSERT INTO `RoleRoute` VALUES (387,2,28);
INSERT INTO `RoleRoute` VALUES (388,2,29);
INSERT INTO `RoleRoute` VALUES (389,2,30);
/*!40000 ALTER TABLE `RoleRoute` ENABLE KEYS */;
DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`roleId`),
  UNIQUE KEY `roleName` (`roleName`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'admin','Administrator role with all permissions');
INSERT INTO `Roles` VALUES (2,'user','Regular user role with limited permissions');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
DROP TABLE IF EXISTS `RouteAuth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RouteAuth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `component` varchar(255) DEFAULT NULL,
  `redirect` varchar(255) DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `routeauth_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `RouteAuth` DISABLE KEYS */;
INSERT INTO `RouteAuth` VALUES (1,'/home/index','home','/home/index',NULL,'{\"icon\": \"HomeFilled\", \"title\": \"首页\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": true, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (2,'/dataScreen','dataScreen','/dataScreen/index',NULL,'{\"icon\": \"Histogram\", \"title\": \"数据大屏\", \"isFull\": true, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (3,'/content','content',NULL,'/content/article','{\"icon\": \"MessageBox\", \"title\": \"内容管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (4,'/content/article','article','/content/article/index',NULL,'{\"icon\": \"Menu\", \"title\": \"文章\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',1);
INSERT INTO `RouteAuth` VALUES (5,'/content/category','category','/content/category/index',NULL,'{\"icon\": \"Menu\", \"title\": \"分类\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',1);
INSERT INTO `RouteAuth` VALUES (6,'/content/tag','tag','/content/tag/index',NULL,'{\"icon\": \"Menu\", \"title\": \"标签\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',1);
INSERT INTO `RouteAuth` VALUES (7,'/content/article/edit/:id','articleEdit','/content/article/detail',NULL,'{\"icon\": \"Menu\", \"title\": \"文章编辑\", \"isFull\": false, \"isHide\": true, \"isLink\": \"\", \"isAffix\": false, \"activeMenu\": \"/content/article\", \"isKeepAlive\": true}',4);
INSERT INTO `RouteAuth` VALUES (8,'/content/article/create','articleCreate','/content/article/detail',NULL,'{\"icon\": \"Menu\", \"title\": \"文章新建\", \"isFull\": false, \"isHide\": true, \"isLink\": \"\", \"isAffix\": false, \"activeMenu\": \"/content/article\", \"isKeepAlive\": true}',4);
INSERT INTO `RouteAuth` VALUES (9,'/proTable','proTable',NULL,'/proTable/useProTable','{\"icon\": \"MessageBox\", \"title\": \"超级表格\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (10,'/proTable/useProTable','useProTable','/proTable/useProTable/index',NULL,'{\"icon\": \"Menu\", \"title\": \"使用 ProTable\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',9);
INSERT INTO `RouteAuth` VALUES (11,'/proTable/useProTable','useProTable','/proTable/useProTable/index',NULL,'{\"icon\": \"Menu\", \"title\": \"使用 ProTable\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',9);
INSERT INTO `RouteAuth` VALUES (12,'/proTable/useTreeFilter','useTreeFilter','/proTable/useTreeFilter/index',NULL,'{\"icon\": \"Menu\", \"title\": \"使用 TreeFilter\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',9);
INSERT INTO `RouteAuth` VALUES (13,'/proTable/useTreeFilter/detail/:id','useTreeFilterDetail','/proTable/useTreeFilter/detail',NULL,'{\"icon\": \"Menu\", \"title\": \"TreeFilter 详情\", \"isFull\": false, \"isHide\": true, \"isLink\": \"\", \"isAffix\": false, \"activeMenu\": \"/proTable/useTreeFilter\", \"isKeepAlive\": true}',9);
INSERT INTO `RouteAuth` VALUES (15,'/proTable/useProTable/detail/:id','useProTableDetail','/proTable/useProTable/detail',NULL,'{\"icon\": \"Menu\", \"title\": \"ProTable 详情\", \"isFull\": false, \"isHide\": true, \"isLink\": \"\", \"isAffix\": false, \"activeMenu\": \"/proTable/useProTable\", \"isKeepAlive\": true}',10);
INSERT INTO `RouteAuth` VALUES (16,'/auth','auth',NULL,'/auth/menu','{\"icon\": \"Lock\", \"title\": \"权限管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (17,'/auth/menu','authMenu','/auth/menu/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单权限\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',16);
INSERT INTO `RouteAuth` VALUES (18,'/auth/button','authButton','/auth/button/index',NULL,'{\"icon\": \"Menu\", \"title\": \"按钮权限\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',16);
INSERT INTO `RouteAuth` VALUES (19,'/assembly','assembly',NULL,'/assembly/guide','{\"icon\": \"Briefcase\", \"title\": \"常用组件\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (20,'/dashboard','dashboard',NULL,'/dashboard/dataVisualize','{\"icon\": \"Odometer\", \"title\": \"Dashboard\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (21,'/assembly/guide','guide','/assembly/guide/index',NULL,'{\"icon\": \"Menu\", \"title\": \"引导页\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (22,'/assembly/tabs','tabs','/assembly/tabs/index',NULL,'{\"icon\": \"Menu\", \"title\": \"标签页操作\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (23,'/assembly/selectIcon','selectIcon','/assembly/selectIcon/index',NULL,'{\"icon\": \"Menu\", \"title\": \"图标选择器\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (24,'/assembly/selectFilter','selectFilter','/assembly/selectFilter/index',NULL,'{\"icon\": \"Menu\", \"title\": \"分类筛选器\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (25,'/assembly/treeFilter','treeFilter','/assembly/treeFilter/index',NULL,'{\"icon\": \"Menu\", \"title\": \"树形筛选器\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (26,'/assembly/svgIcon','svgIcon','/assembly/svgIcon/index',NULL,'{\"icon\": \"Menu\", \"title\": \"SVG 图标\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (27,'/assembly/uploadFile','uploadFile','/assembly/uploadFile/index',NULL,'{\"icon\": \"Menu\", \"title\": \"文件上传\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (28,'/assembly/batchImport','batchImport','/assembly/batchImport/index',NULL,'{\"icon\": \"Menu\", \"title\": \"批量添加数据\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (29,'/assembly/wangEditor','wangEditor','/assembly/wangEditor/index',NULL,'{\"icon\": \"Menu\", \"title\": \"富文本编辑器\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (30,'/assembly/draggable','draggable','/assembly/draggable/index',NULL,'{\"icon\": \"Menu\", \"title\": \"拖拽组件\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',19);
INSERT INTO `RouteAuth` VALUES (31,'/dashboard/dataVisualize','dataVisualize','/dashboard/dataVisualize/index',NULL,'{\"icon\": \"Menu\", \"title\": \"数据可视化\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',20);
INSERT INTO `RouteAuth` VALUES (32,'/assembly/tabs/detail/:id','tabsDetail','/assembly/tabs/detail',NULL,'{\"icon\": \"Menu\", \"title\": \"Tab 详情\", \"isFull\": false, \"isHide\": true, \"isLink\": \"\", \"isAffix\": false, \"activeMenu\": \"/assembly/tabs\", \"isKeepAlive\": true}',22);
INSERT INTO `RouteAuth` VALUES (33,'/form','form',NULL,'/form/proForm','{\"icon\": \"Tickets\", \"title\": \"表单 Form\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (34,'/echarts','echarts',NULL,'/echarts/waterChart','{\"icon\": \"TrendCharts\", \"title\": \"ECharts\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (35,'/form/proForm','proForm','/form/proForm/index',NULL,'{\"icon\": \"Menu\", \"title\": \"超级 Form\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',33);
INSERT INTO `RouteAuth` VALUES (36,'/form/basicForm','basicForm','/form/basicForm/index',NULL,'{\"icon\": \"Menu\", \"title\": \"基础 Form\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',33);
INSERT INTO `RouteAuth` VALUES (37,'/form/validateForm','validateForm','/form/validateForm/index',NULL,'{\"icon\": \"Menu\", \"title\": \"校验 Form\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',33);
INSERT INTO `RouteAuth` VALUES (38,'/form/dynamicForm','dynamicForm','/form/dynamicForm/index',NULL,'{\"icon\": \"Menu\", \"title\": \"动态 Form\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',33);
INSERT INTO `RouteAuth` VALUES (39,'/echarts/waterChart','waterChart','/echarts/waterChart/index',NULL,'{\"icon\": \"Menu\", \"title\": \"水型图\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',34);
INSERT INTO `RouteAuth` VALUES (40,'/echarts/columnChart','columnChart','/echarts/columnChart/index',NULL,'{\"icon\": \"Menu\", \"title\": \"柱状图\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',34);
INSERT INTO `RouteAuth` VALUES (41,'/echarts/lineChart','lineChart','/echarts/lineChart/index',NULL,'{\"icon\": \"Menu\", \"title\": \"折线图\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',34);
INSERT INTO `RouteAuth` VALUES (42,'/echarts/pieChart','pieChart','/echarts/pieChart/index',NULL,'{\"icon\": \"Menu\", \"title\": \"饼图\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',34);
INSERT INTO `RouteAuth` VALUES (43,'/echarts/radarChart','radarChart','/echarts/radarChart/index',NULL,'{\"icon\": \"Menu\", \"title\": \"雷达图\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',34);
INSERT INTO `RouteAuth` VALUES (44,'/echarts/nestedChart','nestedChart','/echarts/nestedChart/index',NULL,'{\"icon\": \"Menu\", \"title\": \"嵌套环形图\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',34);
INSERT INTO `RouteAuth` VALUES (45,'/directives','directives',NULL,'/directives/copyDirect','{\"icon\": \"Stamp\", \"title\": \"自定义指令\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (46,'/menu','menu',NULL,'/menu/menu1','{\"icon\": \"List\", \"title\": \"菜单嵌套\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (47,'/directives/copyDirect','copyDirect','/directives/copyDirect/index',NULL,'{\"icon\": \"Menu\", \"title\": \"复制指令\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',45);
INSERT INTO `RouteAuth` VALUES (48,'/directives/watermarkDirect','watermarkDirect','/directives/watermarkDirect/index',NULL,'{\"icon\": \"Menu\", \"title\": \"水印指令\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',45);
INSERT INTO `RouteAuth` VALUES (49,'/directives/dragDirect','dragDirect','/directives/dragDirect/index',NULL,'{\"icon\": \"Menu\", \"title\": \"拖拽指令\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',45);
INSERT INTO `RouteAuth` VALUES (50,'/directives/debounceDirect','debounceDirect','/directives/debounceDirect/index',NULL,'{\"icon\": \"Menu\", \"title\": \"防抖指令\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',45);
INSERT INTO `RouteAuth` VALUES (51,'/directives/throttleDirect','throttleDirect','/directives/throttleDirect/index',NULL,'{\"icon\": \"Menu\", \"title\": \"节流指令\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',45);
INSERT INTO `RouteAuth` VALUES (52,'/directives/longpressDirect','longpressDirect','/directives/longpressDirect/index',NULL,'{\"icon\": \"Menu\", \"title\": \"长按指令\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',45);
INSERT INTO `RouteAuth` VALUES (53,'/menu/menu1','menu1','/menu/menu1/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单1\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',46);
INSERT INTO `RouteAuth` VALUES (54,'/menu/menu2','menu2',NULL,'/menu/menu2/menu21','{\"icon\": \"Menu\", \"title\": \"菜单2\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',46);
INSERT INTO `RouteAuth` VALUES (55,'/menu/menu3','menu3','/menu/menu3/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单3\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',46);
INSERT INTO `RouteAuth` VALUES (56,'/menu/menu2/menu21','menu21','/menu/menu2/menu21/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单2-1\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',54);
INSERT INTO `RouteAuth` VALUES (57,'/menu/menu2/menu22','menu22',NULL,'/menu/menu2/menu22/menu221','{\"icon\": \"Menu\", \"title\": \"菜单2-2\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',54);
INSERT INTO `RouteAuth` VALUES (58,'/menu/menu2/menu23','menu23','/menu/menu2/menu23/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单2-3\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',54);
INSERT INTO `RouteAuth` VALUES (59,'/menu/menu2/menu22/menu221','menu221','/menu/menu2/menu22/menu221/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单2-2-1\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',57);
INSERT INTO `RouteAuth` VALUES (60,'/menu/menu2/menu22/menu222','menu222','/menu/menu2/menu22/menu222/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单2-2-2\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',57);
INSERT INTO `RouteAuth` VALUES (61,'/system','system',NULL,'/system/accountManage','{\"icon\": \"Tools\", \"title\": \"系统管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (62,'/link','link',NULL,'/link/bing','{\"icon\": \"Paperclip\", \"title\": \"外部链接\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (63,'/about/index','about',NULL,NULL,'{\"icon\": \"InfoFilled\", \"title\": \"关于项目\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',NULL);
INSERT INTO `RouteAuth` VALUES (64,'/system/accountManage','accountManage','/system/accountManage/index',NULL,'{\"icon\": \"Menu\", \"title\": \"账号管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',61);
INSERT INTO `RouteAuth` VALUES (65,'/system/roleManage','roleManage','/system/roleManage/index',NULL,'{\"icon\": \"Menu\", \"title\": \"角色管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',61);
INSERT INTO `RouteAuth` VALUES (66,'/system/menuMange','menuMange','/system/menuMange/index',NULL,'{\"icon\": \"Menu\", \"title\": \"菜单管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',61);
INSERT INTO `RouteAuth` VALUES (67,'/system/departmentManage','departmentManage','/system/departmentManage/index',NULL,'{\"icon\": \"Menu\", \"title\": \"部门管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',61);
INSERT INTO `RouteAuth` VALUES (68,'/system/dictManage','dictManage','/system/dictManage/index',NULL,'{\"icon\": \"Menu\", \"title\": \"字典管理\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',61);
INSERT INTO `RouteAuth` VALUES (69,'/system/timingTask','timingTask','/system/timingTask/index',NULL,'{\"icon\": \"Menu\", \"title\": \"定时任务\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',61);
INSERT INTO `RouteAuth` VALUES (70,'/system/systemLog','systemLog','/system/systemLog/index',NULL,'{\"icon\": \"Menu\", \"title\": \"系统日志\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',61);
INSERT INTO `RouteAuth` VALUES (71,'/link/bing','bing','/link/bing/index',NULL,'{\"icon\": \"Menu\", \"title\": \"Bing 内嵌\", \"isFull\": false, \"isHide\": false, \"isLink\": \"\", \"isAffix\": false, \"isKeepAlive\": true}',62);
INSERT INTO `RouteAuth` VALUES (72,'/link/gitee','gitee','/link/gitee/index',NULL,'{\"icon\": \"Menu\", \"title\": \"Gitee 仓库\", \"isFull\": false, \"isHide\": false, \"isLink\": \"https://gitee.com/HalseySpicy/Geeker-Admin\", \"isAffix\": false, \"isKeepAlive\": true}',62);
INSERT INTO `RouteAuth` VALUES (73,'/link/github','github','/link/github/index',NULL,'{\"icon\": \"Menu\", \"title\": \"GitHub 仓库\", \"isFull\": false, \"isHide\": false, \"isLink\": \"https://github.com/HalseySpicy/Geeker-Admin\", \"isAffix\": false, \"isKeepAlive\": true}',62);
INSERT INTO `RouteAuth` VALUES (74,'/link/docs','docs','/link/docs/index',NULL,'{\"icon\": \"Menu\", \"title\": \"项目文档\", \"isFull\": false, \"isHide\": false, \"isLink\": \"https://docs.spicyboy.cn\", \"isAffix\": false, \"isKeepAlive\": true}',62);
INSERT INTO `RouteAuth` VALUES (75,'/link/juejin','juejin','/link/juejin/index',NULL,'{\"icon\": \"Menu\", \"title\": \"掘金主页\", \"isFull\": false, \"isHide\": false, \"isLink\": \"https://juejin.cn/user/3263814531551816/posts\", \"isAffix\": false, \"isKeepAlive\": true}',62);
/*!40000 ALTER TABLE `RouteAuth` ENABLE KEYS */;
DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tag` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
INSERT INTO `Tag` VALUES ('tag1','编程','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Tag` VALUES ('tag2','人工智能','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Tag` VALUES ('tag3','健身','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Tag` VALUES ('tag4','营养','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Tag` VALUES ('tag5','旅行','2024-06-27 18:26:44','2024-06-27 18:26:44');
INSERT INTO `Tag` VALUES ('tag6','爱好','2024-06-27 18:26:44','2024-06-27 18:26:44');
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `age` int DEFAULT NULL,
  `idCard` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','inactive','banned') NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCard` (`idCard`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_role` (`roleId`),
  CONSTRAINT `fk_role` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleId`),
  CONSTRAINT `users_chk_1` CHECK ((`age` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'user','female',28,'123456789012345678','alice@example.com','123 Main St, Anytown, USA','2024-06-29 07:31:30','active','avatar1.png',2,'$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm');
INSERT INTO `Users` VALUES (2,'admin','male',32,'987654321098765432','bob@example.com','456 Elm St, Othertown, USA','2024-06-29 07:31:30','active','avatar2.png',1,'$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

