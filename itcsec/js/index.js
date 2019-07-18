function getUrlParam(key, url) {
	var newUrl = url || window.location;
	newUrl = decodeURI(newUrl);
	var params = {};
	var arr = newUrl.split("?");
	if(arr.length <= 1) {
		return false;
	}
	arr = arr[1].split("&");
	for(var i = 0, l = arr.length; i < l; i++) {
		var a = arr[i].split("=");
		params[a[0]] = a[1];
	}
	return key ? params[key] : params;
}

// 获取随机数
var getRandom = function(min, max) {
	/*
	 * 不传参返回随机数
	 * 传递一个数字返回当前位数的随机数
	 * 		$.getRandom(3) = nnn
	 * 传递二个数字返回范围内的随机数
	 * */
	if(min && !max) {
		var str = '9';
		var str1 = '1'
		$.each(new Array(min), function(i) {
			str += '9';
			str1 += '0';
		});
		str = parseInt(str) / 10;
		str1 = parseInt(str1) / 10;
		return parseInt(Math.random() * (str - str1 + 1) + str1)
	} else if(min || min == 0 && max) {
		return parseInt(Math.random() * (max - min + 1) + min)
	} else {
		return parseInt(Math.ceil(Math.random() * (new Date).getTime()))
	}
}

window.vueModel = new Vue({
	el: '#app',
	methods: {
		goProduct: function(id) {
			window.location = 'product.html?id=' + id;
		},
		randomKey(name) {
			name = name || 1
			return name + getRandom()
		}
	},
	created: function() {
		var _self = this;
		var productId = getUrlParam('id');
		_self.productList.forEach(function(item) {
			if(item.id == productId) {
				_self.product = item;
			}
		})
		if(!_self.product) {
			_self.caseList.forEach(function(item) {
				if(item.id == productId) {
					_self.product = item;
				}
			})
		}
		if(_self.product && _self.product.case) {
			var pUrl = 'images/product/' + _self.product.id + '/case/'
			_self.product.case = $.map(_self.product.case.split(','), function(item) {
				return pUrl + item.trim()
			})
		}
	},
	data: function() {
		var pUrl = 'images/product/'
		return {
			companyAddress: '北京市海淀区小南庄路怡秀园甲1号7层',
			companyName: '北京英孚信安科技有限公司',
			companyRecord: '',
			companyPhone: '(010)82561608',
			companyCode: '100089',
			product: false,
			productList: [{
					id: 1,
					name: '数据库安全保护系统',
					description: '公司数据库安全保护系统针对数据库提供事前、事中、事后三位一体的安全保护，有效实现访问数据库中的数据全面，解决企业中数据库中数据面临的多种安全风险',
					imgUrl: pUrl + '1/bg.jpg',
					scene: [{
						name: '数据安全风险',
						value: ['公司数据库被拖库，全部数据被黑客盗取', '第三方运维人员查询公司数据库敏感信息', '内部DBA泄露敏感信息', '开发、测试环节中造成敏感信息泄露', '公司个人信息泄露']
					}],
					descript: [{
						name: '数据合规',
						value: '个人信息95%存保在数据库中，近年来，国家对个人信息法律法规发布较多，如《中华人民共和国网络安全法》明确个人信息保护不当行为涉及违法，2017年5月9号全国最高检对刑法253条解释，明确泄露50条或以上个人信息达到刑法量刑标准。2018年4月《公安机关互联网安全监督检查规定》规定，个人信息保护不当未达到量刑标准，可罚款100万元。所以企业需要对数据库进行全方位保护。'
					}],
					fnImg: [pUrl + '1/bg-1.jpg'],
					fn: [{
						name: '数据控制访问',
						value: [
							'根据“用户账号”、“客户端IP地址”和“客户端应用程序类型”等方式对用户访问数据（个人信息）库进行访问控制，实现数据库最小权限访问',
							'实现对“表、列、行”等访问控制，确保只有授权的可以访问到相应表、列、行',
							'对不同的用户，访问数据行进行限制（如限制访问3行数据），确保只有少量的数据能被访问到'
						]
					}, {
						name: '数据防泄漏',
						value: ['公司数据库被拖库，全部数据被黑客盗取', '第三方运维人员查询公司数据库敏感信息', '内部DBA泄露敏感信息', '开发、测试环节中造成敏感信息泄露', '公司个人信息泄露']
					}],
					decorate: [pUrl + '1/bg-2.jpg'],
					earnings: [{
						name: '快速符合国家相关法律',
						value: [
							'符合国家相关法律要求，降低公司数据违法风险',
							'符合公安部等级保护要求',
							'符合国资委商密要求等等'
						]
					}, {
						name: '成本收益高',
						value: [
							'一套解决方案，实现数据库防火墙、数据库防泄露、数据库审计三套产品，低投入高产出',
							'一套设备维护，降低运维人员成本'
						]
					}, {
						name: '数据责任明确',
						value: [
							'通过本系统，实现内部各部门数据最小化使用与服务，实现数据职责明确。规范内部数据安全保护的责任与职责。相应数据发生风险，相关部门可即时免责'
						]
					}, {
						name: '与环境融合，无负影响',
						value: [
							'部署不改变现有网络结构',
							'部署不改变现有运维方式',
							'部署不改变现有业务方式',
							'对环境、人员无影响'
						]
					}],
					case: '1.jpg',
					caseList: [
						'河北高法财务资产内控管理平台建设',
						'某证券敏感数据安全保护实施',
						'某保险公司客户数据安全保护',
					]
				},
				{
					id: 2,
					name: '数据库脱敏系统',
					description: '（又称为数据漂白）是通过相应的脱敏算法对企业真实数据进行变形，处理生成伪真实数据，以此达到保护企业隐私数据不被泄密的技术手段',
					imgUrl: pUrl + '2/bg-2.jpg',
					scene: [{
						name: '相关法规，政策监管要求',
						value: [
							'数据泄露会对企业带来经济和名誉的双重损失',
							'相关法规要求，《网络安全法》',
							'2018年5月1号执行 《个人信息安全保护规范》',
							'企业审计要求'
						]
					}, {
						name: '建立敏感数据统一管控的平台',
						value: [
							'对敏感数据统一处理规则，统一调度，统一管理，统一发布',
							'灵活的脱敏策略满足不同系统的脱敏需求',
							'消灭信息孤岛，在多个系统应用之间维系业务关联性'
						]
					}, {
						name: '提升系统测试、应用的效率与质量',
						value: [
							'保证测试数据质量，降低系统上线风险',
							'改善系统建设应用的时效性，减轻系统开发与运维人员工作负担'
						]
					}],
					descript: [{
						name: '数据脱敏的定义',
						value: '（又称为数据漂白）是通过相应的脱敏算法对企业真实数据进行变形，处理生成伪真实数据，以此达到保护企业隐私数据不被泄密的技术手段'
					}, {
						name: '数据脱敏的目的',
						value: '通过对敏感数据（也成隐私数据）的变形处理，避免无关人员与真实数据的直接接触，从而消除敏感数据泄露的风险'
					}],
					fnImg: [pUrl + '2/bg-1.jpg'],
					fn: [{
						name: '数据控制访问',
						value: [
							'一般用在非生产环境处理静止的数据，在敏感数据从生产环境脱敏完毕之后，再在非生产环境使用。用于对数据即时性无要求的应用场景，如POC测试、用户培训、系统演示、数据共享开放等',
							'通过对敏感数据（也成隐私数据）的变形处理，避免无关人员与真实数据的直接接触，从而消除敏感数据泄露的风险'
						]
					}],
					decorate: [pUrl + '2/bg-2.jpg'],
					earnings: [
						'提高测试数据安全性，确保测试过程中不会泄露敏感数据',
						'提高离线数据库安全，确保关键数据在离线数据库中安全性',
						'满足金融、政府等单位针对数据脱敏安全要求'
					],
					case: '1.jpg',
					caseList: [
						'某移动通信公司'
					]
				},
				{
					id: 3,
					name: '综合安全审计系统',
					description: '基于规则的关联：通过事件关联引擎进行规则匹配，识别已知模式的攻击和违规',
					imgUrl: pUrl + '3/bg.jpg',
					scene: [{
						name: '合规需求',
						value: [
							'《中华人民共和国网络安全法》',
							'《信息系统安全等级化保护基本要求》',
							'《关键信息基础设施安全保护条例》',
							'《个人信息安全规范》',
							'《企业内控要求》',
							'《ISO27001》'
						]
					}, {
						name: '运维需求',
						value: [
							'对IT设备（服务器、数据库、网络设备等）进行性能监控',
							'及时发现各IT设备事件，及时警告',
							'提供故障、事件快速分析与溯源，快速排除故障'
						]
					}, {
						name: '安全需求',
						value: [
							'统一内部所有安全设备数据，解决安全防护措施数据孤岛',
							'建立集中安全事件分析中心，归并、优化对安全事件处理与响应，降低内部安全风险',
							'以日志数据为基础，构建内部安全管理中心（预警中心），优化信息安全运维管理'
						]
					}],
					fnImg: [pUrl + '3/bg-1.jpg', pUrl + '3/bg-1-1.jpg'],
					fn: [{
						name: '数据整合',
						value: [
							'通过API、协议、采集器、文件上传、FTP、SNMP等方式接入所有结构化与非结构的机器数据并整合'
						]
					}, {
						name: '实时与离线分析',
						value: [
							'利用引擎分析技术，对采集的数据进行实时分析，利用Spark算法对离线数据进行分析，全面响应用户需求'
						]
					}, {
						name: '用户及设备画像',
						value: [
							'通过用户、设备画像技术，分析交易行为、攻击行为，防范交易欺诈、APT攻击'
						]
					}],
					decorate: [pUrl + '3/bg-2.jpg'],
					earnings: [{
						name: '安全合规',
						value: [
							'快速满足等保、网络安全法、关键基础设施安全保护条例 等法律法规要求',
							'满足企业内部控制针对审计与检查的安全要求'
						]
					}, {
						name: '降低安全事件',
						value: [
							'全面采集、归并、分析信息安全事件，降低安全事件噪音，提升安全事件有效性与处理率',
							'及时预警信息安全攻击，快速处理信息安全事件，提高内部安全事件处理能力'
						]
					}, {
						name: '审计追溯',
						value: [
							'精准定位内部信息安全事件，快速回溯原始事件活动',
							'追溯内部人员或外部人员对关键业务或资产非法操作行为'
						]
					}],
					case: '1.jpg',
					caseList: [
						'某涉密研究所SOC系统',
						'某公安系统网络行为监控',
						'第三方支付人行评级',
					]
				},
				{
					id: 4,
					name: '业务安全解决方案',
					description: '通用业务行为分析，全面对业务操作进行分析与监控，产品适用多大部分企业',
					imgUrl: pUrl + '4/bg.jpg',
					scene: [{
						name: '信息化条件下业务如何安全',
						value: [
							'业务办理人员在操作业务时出现误操作而隐而不报怎么办? ',
							'业务办理人员在操作业务时利用合法权限来满足个人利益怎么办? ',
							'业务办理人员和审批人员狼狈为奸进行看似合法的违规操作怎么办? ',
							'业务办理人员和外部人员里应外合获取非法利益怎么办? ',
							'业务办理人员在操作业务时利用合法权限来满足个人利益怎么办? ',
						]
					}, {
						name: '法律法规',
						value: [
							'《企业内部控制基本规范》',
							'《SOX 404》',
							'《商业银行操作风险指引》'
						]
					}],
					fn: [{
						name: '操作违规监测',
						value: [
							'帐号操作越权',
							'帐号操作绕权',
							'僵尸帐号事件透视'
						]
					}, {
						name: '高频操作违规监测',
						value: [
							'批量查询及下载',
							'高频率查询',
							'高频率下载'
						]
					}, {
						name: '操作办理误操作监测',
						value: [
							'操作误确认',
							'查询错误',
							'下载错误'
						]
					}, {
						name: '系统违规渗透监测',
						value: [
							'内部违规扫描',
							'帐号密码暴力破解'
						]
					}, {
						name: '资产安全透视',
						value: [
							'资产智能化梳理',
							'风险提前把握'
						]
					}, {
						name: '敏感信息安全监测',
						value: [
							'敏感信息批量查询、下载',
							'敏感信息高频查询、下载'
						]
					}],
					fnImg: [pUrl + '4/bg-1-1.jpg', pUrl + '4/bg-1-2.jpg'],
					decorate: [pUrl + '4/bg-2.jpg'],
					earnings: [
						'产品业务梳理、业务建模、异常行为告警、敏感信息深度检测、实施告警及违规行为回溯等功能于一身。对业务相关的参与者(业务人员、管理人员、研发人员、软件外包公司、运维人员、审计人员和普通用户等所有能接触到业务系统的相关人员)进行业务操作行为分析与监控,以此实现业务违规预警，及时发现业务潜在风险目的 '
					],
					//						case: '1.jpg',
					//						caseList: [
					//							'某涉密研究所SOC系统',
					//							'某公安系统网络行为监控',
					//							'第三方支付人行评级',
					//						]
				}
			],
			caseList: [{
					id: 101,
					name: '河北高法财务资产内控管理平台建设',
					imgUrl: pUrl + '101/bg.jpg'
				},
				{
					id: 102,
					name: '某证券敏感数据安全保护实施',
					imgUrl: pUrl + '102/bg.jpg',
				},
				{
					id: 103,
					name: '中石油安全检查项目',
					imgUrl: pUrl + '103/bg.jpg'
				},
				{
					id: 104,
					name: '某保险公司客户数据安全保护',
					imgUrl: pUrl + '104/bg.jpg'
				},
				{
					id: 105,
					name: '某公安系统网络行为监控',
					imgUrl: pUrl + '105/bg.jpg'
				},
				{
					id: 106,
					name: '青岛港安全总体规划',
					imgUrl: pUrl + '106/bg.jpg'
				}
			],
			jointList: [{
					name: '中国交通建设股份有限公司',
					imgUrl: 'zg_jiaotong.png'
				},
				{
					name: '国家粮食局',
					imgUrl: 'zg_niangshi.jpg'
				},
				{
					name: '中国石化',
					imgUrl: 'zg_shihua.png'
				},
				{
					name: '中国石油',
					imgUrl: 'zg_shiyou.png'
				},
				{
					name: '中国生态环境部',
					imgUrl: 'zg_sthj.png'
				},
				{
					name: '中国国家外汇管理局',
					imgUrl: 'zg_waihui.png'
				},
				{
					name: '中国人民武装警察部队',
					imgUrl: 'zg_wzjc.jpg'
				},
				{
					name: '中国移动',
					imgUrl: 'zg_yidong.jpg'
				},
				{
					name: '新华社',
					imgUrl: 'xinhuashe.png'
				},
				{
					name: '中国石油大学(北京)',
					imgUrl: 'zg_bj_shiyoudaxue.png'
				},
				{
					name: '国家测绘地里信息局',
					imgUrl: 'zg_chdl.png'
				},
				{
					name: '中国国防科技大学',
					imgUrl: 'zg_ghkj.jpg'
				},
				{
					name: '中国国际航空公司',
					imgUrl: 'zg_gjhg.png'
				},
				{
					name: '中国国家海洋局',
					imgUrl: 'zg_haiyang.png'
				},
				{
					name: '中国航天科技集团',
					imgUrl: 'zg_hangtian.jpg'
				},
				{
					name: '中国华能',
					imgUrl: 'zg_huangneng.jpg'
				},
				{
					name: '华泰保险',
					imgUrl: 'huataibaoxian.jpg'
				},
				{
					name: '廊坊银行',
					imgUrl: 'lf_yinghang.png'
				},
				{
					name: '洛阳银行',
					imgUrl: 'ly_yinhang.png'
				},
				{
					name: '梅花集团',
					imgUrl: 'meihua.jpg'
				},
				{
					name: '内蒙古气象',
					imgUrl: 'nmg_qixiang.png'
				},
				{
					name: '青岛港',
					imgUrl: 'qingdaogang.png'
				},
				{
					name: '四川测绘',
					imgUrl: 'sc_cehuidili.png'
				},
				{
					name: '四川广电',
					imgUrl: 'sc_guangdian.png'
				},
				{
					name: '首都国际机场',
					imgUrl: 'sd_gjjc.png'
				},
				{
					name: '我买网',
					imgUrl: 'womaiwang.png'
				},
				{
					name: '阳光保险',
					imgUrl: 'yangguangbaoxian.webp'
				},
				{
					name: '北京奔驰',
					imgUrl: 'bj_benchi.png'
				},
				{
					name: '北京环境保护',
					imgUrl: 'bj_huanjingbaohu.png'
				},
				{
					name: '北京气象',
					imgUrl: 'bj_qixiang.png'
				},
				{
					name: '北控水务',
					imgUrl: 'beikongshuiwu.png'
				},
				{
					name: '北京现代',
					imgUrl: 'bj_xd.jpg'
				},
				{
					name: '财达证卷',
					imgUrl: 'caidazhengjuan.png'
				},
				{
					name: '湖北中医院',
					imgUrl: 'hb_zyy.png'
				}
			]
		}
	}
})

$(function() {
	/* 隐藏的左侧栏脚本 */
	function nfun(that, the) {
		$('.nav-cut a').removeAttr('style');
		the.children('a').css('color', '#fff');
		that.parent('ul').find('.background').css({
			'top': the.index() * 36
		});
	}

	var $win = $(window)
	var $navCut = $('.nav-cut')

	function navFn(that, the) {
		$navCut.find('a').removeAttr('style')
		the.children('a').css('color', '#fff')
		that.parent('ul').find('.background').css({
			'top': the.index() * 36
		})
	}

	nfun($navCut.find('li.nav1.active'), $navCut.find('li.nav1.active'))
	$navCut.find('li.nav1').mouseover(function() {
		if($win.width() >= 768) {
			that = $(this);
			nfun(that, that);
			that.find('>ul').css('top', that.offset().top - $win.scrollTop() + 36 / 2);
		}
	}).mouseout(function() {
		if($win.width() >= 768) {
			nfun($(this), $('.nav-cut>ul>li.nav1.active'));
		}
	}).click(function() {
		if($win.width() < 768) {
			that = $(this);
			nfun(that, that);
			that.find('>ul').css('top', that.offset().top - $win.scrollTop() + 36 / 2);
		}
	});

	$navCut.find('>ul>li>a, >ul>li>ul>li>a').click(function() {
		if($win.width() < 768) {
			if($(this).next('ul').css('display') == 'none') {
				$('.nav-cut>ul>li>ul').hide();
				$(this).next('ul').show();
			} else {
				$(this).next('ul').hide();
			}
		}
	})
})

$(function(e) {
	/* 返回顶部 */
	var $win = $(window)
	$(".met-scroll-top").click(function() {
		if(typeof windowSwiper != 'undefined') {
			windowSwiper.slideTo(0)
		}
		$('html,body').animate({
			'scrollTop': 0
		}, 333)
	})

	var IE9 = (navigator.userAgent.indexOf("MSIE 9.0") > 0) ? true : false

	var $headRightsIcon = $('.head-rights ol')
	var $headingBox = $('section[role=main],header[role=heading]')
	$('body').on('click', function() {
		// 左侧栏展开时，点击body会收起左侧栏
		if($headRightsIcon.hasClass('active')) {
			$headRightsIcon.removeClass('active')
			$headingBox.removeClass('active');
		}
	}).on('click', 'header[role=heading]', function(event) {
		event.stopPropagation()
	})

	$headRightsIcon.click(function(e) {
		// 头部右侧方块点击展开侧边栏
		if($headRightsIcon.hasClass('active')) {
			$headRightsIcon.removeClass('active');
			$headingBox.removeClass('active');
		} else {
			$headRightsIcon.addClass('active');
			$headingBox.addClass('active');
		}
		e.stopPropagation()
	})

	$('.sidebar-icon').click(function() {
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
			$headingBox.removeClass('active');
		} else {
			$(this).addClass('active');
			$headingBox.addClass('active');
		}
	});

	function wfun($el) {
		// 头部导航滑条
		var active = $el || $('.window-head ul li.active')
		if(active.length > 0) {
			var left = active.offset().left + 15
			var width = active.width() + 10
			$('.window-head hr').css({
				'left': left,
				'width': width
			})
		}
	}
	$win.on('resize', function() {
		wfun()
	})

	$('.window-head ul').on('mouseover', 'li', function() {
		wfun($(this))
	}).on('mouseout', 'li', function() {
		wfun()
	})

	var bannerSwiper, bannerSpanSwiper, jointSwiper, aboutSwiper, productSwiper, caseSwiper;

	vueModel.$nextTick(function() {
		if($.fn.lazyload) {
			$("img.lazy").lazyload({
				effect: "fadeIn",
				threshold: 200
			})
		}

		if($('.banner-box').length > 0) {
			bannerSwiper = new Swiper('.banner-box', {
				wrapperClass: 'banner-cut',
				slideClass: 'banner-bin',
				speed: 500,
				loop: true,
				autoplay: 4500,
				autoplayDisableOnInteraction: true,
				grabCursor: true,
				keyboardControl: true,
				slidesPerView: 1,
				pagination: '.banner-pager',
				paginationClickable: true
			});
			$('.banner-ctrl .ctrl-left').click(function() {
				bannerSwiper.slidePrev();
			});
			$('.banner-ctrl .ctrl-right').click(function() {
				bannerSwiper.slideNext();
			});
		}

		if($('.banner-span').length > 0) {
			bannerSpanSwiper = new Swiper('.banner-span', {
				autoplayDisableOnInteraction: true,
				wrapperClass: 'banner-ol',
				slideClass: 'banner-li',
				direction: 'vertical',
				loop: true,
				speed: 1000,
				autoplay: 2500,
				slidesPerView: 1,
				bulletActiveClass: 'active'
			});
		}

		if($('#product .case-box').length > 0) {
			var case_number = $('.case-bin').length;
			productSwiper = new Swiper('#product .case-box', {
				wrapperClass: 'case-cut',
				slideClass: 'case-bin',
				keyboardControl: true,
				width: 1260,
				loop: case_number >= 4,
				autoplay: 3500,
				slidesPerView: 4,
				spaceBetween: 20,
				grabCursor: true,
				breakpoints: {
					1599: {
						width: 940,
						slidesPerView: 3,
						loop: case_number >= 3
					},
					1200: {
						width: 620,
						slidesPerView: 2,
						loop: case_number >= 2
					},
					767: {
						width: 460,
						slidesPerView: 2,
						loop: case_number >= 2,
						spaceBetween: 30
					},
					479: {
						width: 300,
						slidesPerView: 1,
						loop: case_number >= 1
					},
					400: {
						width: 230,
						slidesPerView: 1,
						loop: case_number >= 1
					}
				}
			});
			$('#product .case-ctrl .ctrl-left').click(function() {
				productSwiper.slidePrev();
			});
			$('#product .case-ctrl .ctrl-right').click(function() {
				productSwiper.slideNext();
			});
			productSwiper.container[0].onmouseover = function() {
				productSwiper.stopAutoplay();
			}
			productSwiper.container[0].onmouseout = function() {
				productSwiper.startAutoplay();
			}
		}

		if($('#case .case-box').length > 0) {
			var case_number = $('.case-bin').length;
			caseSwiper = new Swiper('#case .case-box', {
				wrapperClass: 'case-cut',
				slideClass: 'case-bin',
				keyboardControl: true,
				width: 1260,
				loop: case_number >= 4,
				autoplay: 3500,
				slidesPerView: 4,
				spaceBetween: 20,
				grabCursor: true,
				breakpoints: {
					1599: {
						width: 940,
						slidesPerView: 3,
						loop: case_number >= 3
					},
					1200: {
						width: 620,
						slidesPerView: 2,
						loop: case_number >= 2
					},
					767: {
						width: 460,
						slidesPerView: 2,
						loop: case_number >= 2,
						spaceBetween: 30
					},
					479: {
						width: 300,
						slidesPerView: 1,
						loop: case_number >= 1
					},
					400: {
						width: 230,
						slidesPerView: 1,
						loop: case_number >= 1
					}
				}
			});
			$('#case .case-ctrl .ctrl-left').click(function() {
				caseSwiper.slidePrev();
			});
			$('#case .case-ctrl .ctrl-right').click(function() {
				caseSwiper.slideNext();
			});
			caseSwiper.container[0].onmouseover = function() {
				caseSwiper.stopAutoplay();
			}
			caseSwiper.container[0].onmouseout = function() {
				caseSwiper.startAutoplay();
			}
		}

		if($('.joint-box').length > 0) {
			var joint_arr, joint_num, joint_htm
			if(IE9 && $('.joint-bin').length > 5) {
				joint_arr = [];
				joint_num = 0;
				joint_htm = '';
				$('.joint-bin').each(function(index, element) {
					joint_arr[index] = $(this).html();
					joint_num++;
				});
				joint_len = Math.ceil(joint_num / 3);
				for(i = 0; i < joint_len; i++) {
					joint_htm += '<li class="joint-bin" style="width:230px;">' + joint_arr[i] + '</li>';
				}
				$('.joint-cut').html(joint_htm);
			}
			jointSwiper = new Swiper('.joint-box', {
				wrapperClass: 'joint-cut',
				slideClass: 'joint-bin',
				slidesPerView: 5,
				slidesPerColumn: IE9 ? 1 : 3,
				slidesPerColumnFill: 'row',
				speed: 500,
				width: 1150,
				autoplay: 4500,
				grabCursor: true,
				keyboardControl: true,
				breakpoints: {
					1440: {
						width: 1000,
						slidesPerView: 4,
						slidesPerColumn: 2
					},
					1200: {
						width: 750,
						slidesPerView: 3,
						slidesPerColumn: 2
					},
					992: {
						width: 500,
						slidesPerView: 2,
						slidesPerColumn: 3
					},
					767: {
						width: 480,
						slidesPerView: 3,
						slidesPerColumn: 2
					},
					480: {
						width: 319,
						slidesPerView: 2,
						slidesPerColumn: 4
					},
					320: {
						width: 319,
						slidesPerView: 2,
						slidesPerColumn: 3
					}
				}
			});
			if(IE9 && $('.joint-bin').length > 5) {
				joint_htm = '';
				for(i = joint_len; i < joint_num; i++) {
					joint_htm += '<li class="joint-bin" style="width:230px;">' + joint_arr[i] + '</li>';
				}
				$('.joint-cut').append('<div>' + joint_htm + '</div>');
			}
			$('.joint-ctrl .ctrl-left').click(function() {
				jointSwiper.slidePrev();
			});
			$('.joint-ctrl .ctrl-right').click(function() {
				jointSwiper.slideNext();
			});
		}

		if($('.about-box').length > 0) {
			aboutSwiper = new Swiper('.about-box', {
				wrapperClass: 'about-cut',
				slideClass: 'about-bin',
				keyboardControl: true,
				autoplay: 3500,
				autoheight: true,
				speed: 500,
				spaceBetween: 10,
				slidesPerView: 1,
				pagination: '.about-nav ul',
				bulletClass: 'cut',
				bulletActiveClass: 'active',
				paginationClickable: true,
				paginationBulletRender: function(swiper, index, className) {
					var title = $('.about-bin').eq(index).attr('title') || '';
					return '<li class="' + className + '" data-index="' + (index + 1) + '">' + title + '</li>';
				}
			});

			function about_height() {
				var about_back = $('.window-bin[data-hash=about] .window-back').height() - 70;
				if($('.about-bottom').css('display') == 'block') about_back = about_back - $('.about-bottom').height();
				if($('.about-nav').css('position') == 'relative') about_back = about_back - $('.about-nav').height();
				about_back = about_back - $('.about-box').css('margin-top').replace('px', '');
				$('.about-bin').css('max-height', about_back);
			}
			about_height();
			$win.resize(function() {
				about_height();
			});
		}

		if($('.window-box').length > 0) {
			if(IE9) $('.window-bin').height($('body').height());
			window.windowSwiper = new Swiper('.window-box', {
				wrapperClass: 'window-cut',
				slideClass: 'window-bin',
				direction: 'vertical',
				lazyLoading: true,
				lazyLoadingInPrevNext: true,
				lazyLoadingOnTransitionStart: true,
				speed: 700,
				hashnav: true,
				bulletClass: 'cut',
				roundLengths: true,
				slidesPerView: 'auto',
				resistanceRatio: 0,
				keyboardControl: true,
				mousewheelControl: IE9 ? false : true,
				pagination: '.window-head ul',
				bulletActiveClass: 'active',
				paginationClickable: true,
				paginationBulletRender: function(swiper, index, className) {
					var title = $('.window-bin').eq(index).find('.window-back').attr('data-title') || '';
					if(title != '') return '<li class="' + className + '" data-index="' + (index + 1) + '">' + title + '</li>';
				},
				onInit: function() {
					wfun()
				},
				onSlideChangeStart: function(swiper) {
					if(swiper.activeIndex == 0) {
						$('.met-scroll-top').addClass('hide')
						$('.window-head').removeClass('active');
					} else {
						$('.met-scroll-top').removeClass('hide')
						$('.window-head').addClass('active');
					}
					setTimeout(function() {
						wfun();
					}, 400)
					if(typeof(bannerSwiper) != 'undefined') bannerSwiper.stopAutoplay();
					if(typeof(bannerSpanSwiper) != 'undefined') bannerSpanSwiper.stopAutoplay();
					if(typeof(productSwiper) != 'undefined') productSwiper.stopAutoplay();
					if(typeof(caseSwiper) != 'undefined') caseSwiper.stopAutoplay();
					if(typeof(jointSwiper) != 'undefined') jointSwiper.stopAutoplay();
					if(typeof(aboutSwiper) != 'undefined') aboutSwiper.stopAutoplay();
					switch($('.window-bin').eq(swiper.activeIndex).attr('data-hash')) {
						case 'banner':
							if(typeof(bannerSwiper) != 'undefined') bannerSwiper.startAutoplay();
							if(typeof(bannerSpanSwiper) != 'undefined') bannerSpanSwiper.startAutoplay();
							break;
						case 'business':
							break;
						case 'product':
							if(typeof(productSwiper) != 'undefined') productSwiper.startAutoplay();
							break;
						case 'case':
							if(typeof(caseSwiper) != 'undefined') caseSwiper.startAutoplay();
							break;
						case 'joint':
							if(typeof(jointSwiper) != 'undefined') jointSwiper.startAutoplay();
							break;
						case 'about':
							if(typeof(aboutSwiper) != 'undefined') aboutSwiper.startAutoplay();
							break;
						case 'contact':

							break;
					}
				}
			});
			if(IE9) {
				var window_time = '';
				window.onmousewheel = function(e) {
					clearTimeout(window_time);
					window_time = window.setTimeout(function() {
						if(e.wheelDelta > 0) {
							windowSwiper.slidePrev();
						} else {
							windowSwiper.slideNext();
						}
					}, 500);
				}
			}
			if(typeof(windowSwiper) != 'undefined') {
				$('.banner-down').click(function() {
					windowSwiper.slideNext();
				});
				$('.head-left').click(function() {
					windowSwiper.slideTo(0);
				});
			}
		}
	})
})