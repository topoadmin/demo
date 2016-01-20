(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "webuploader"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}

}(this, function($, WebUploader) {
	
	/*require(["textupload"], function() {
		$('#webupload').upload({
			url: 'server/fileupload.php',
			success: function(data) {
				console.info(data);
			},
			error: function(err) {
				console.info(err);
			}
		});
	});*/
	$.fn.extend({
		/*
		 *	上传方法 opt为参数配置;
		 *	serverCallBack回调函数 每个文件上传至服务端后,服务端返回参数,无论成功失败都会调用 参数为服务器返回信息;
		 */
		upload: function(opt, serverCallBack) {
			if (typeof opt != "object") {
				alert('参数错误!');
				return;
			}

			var $fileInput = $(this);
			var $fileInputId = $fileInput.attr('id');

			//组装参数;
			if (opt.url) {
				opt.server = opt.url;
				delete opt.url;
			}

			if (opt.success) {
				var successCallBack = opt.success;
				delete opt.success;
			}

			if (opt.error) {
				var errorCallBack = opt.error;
				delete opt.error;
			}

			//迭代出默认配置
			$.each(getOption('#' + $fileInputId), function(key, value) {
				opt[key] = opt[key] || value;
			});

			if (opt.buttonText) {
				opt['pick']['label'] = opt.buttonText;
				delete opt.buttonText;
			}

			var webUploader = getUploader(opt);
			
			if (!WebUploader.Uploader.support()) {
				alert(' 上传组件不支持您的浏览器！');
				return false;
			}

			//绑定文件加入队列事件;
			webUploader.on('fileQueued', function(file) {
				createBox($fileInput, file, webUploader);
			});

			//进度条事件
			webUploader.on('uploadProgress', function(file, percentage) {
				percentage = percentage * 100;
				showProgress(percentage.toFixed(2), file);
			});

			//全部上传结束后触发;
			webUploader.on('uploadFinished', function() {
				alert("上传结束");
			});
			//绑定发送至服务端返回后触发事件;
			webUploader.on('uploadAccept', function(object, data) {
				if (serverCallBack) serverCallBack(data);
			});
			//上传成功后触发事件;
			webUploader.on('uploadSuccess', function(file, response) {
				alert("上传成功");
				if (successCallBack) {
					successCallBack(response);
				}
			});

			//上传失败后触发事件;
			webUploader.on('uploadError', function(file, reason) {
				showProgress(0, file, '上传失败!');
				var err = '上传失败! 文件:' + file.name + ' 错误码:' + reason;
				if (errorCallBack) {
					errorCallBack(err);
				}
			});

			//选择文件错误触发事件;
			webUploader.on('error', function(code) {
				var text = '';
				switch (code) {
					case 'F_DUPLICATE':
						text = '该文件已经被选择了!';
						break;
					case 'Q_EXCEED_NUM_LIMIT':
						text = '上传文件数量超过限制!';
						break;
					case 'F_EXCEED_SIZE':
						text = '文件大小超过限制!';
						break;
					case 'Q_EXCEED_SIZE_LIMIT':
						text = '所有文件总大小超过限制!';
						break;
					case 'Q_TYPE_DENIED':
						text = '文件类型不正确或者是空文件!';
						break;
					default:
						text = '未知错误!';
						break;
				}
				console.log(text);
			});
		}
	});

	//Web Uploader默认配置;
	function getOption(objId) {
		/*
		 *	配置文件同webUploader一致,这里只给出默认配置.
		 *	具体参照:http://fex.baidu.com/webuploader/doc/index.html
		 */
		return {
			pick: {
				id: objId,
				label: "选择图片"
			},
			//类型限制;
			accept: {
				title: "Images",
				extensions: "gif,jpg,jpeg,bmp,png",
				mimeTypes: "image/*"
			},
			//配置生成缩略图的选项
			thumb: {
				width: 370,
				height: 350,
				// 图片质量，只有type为`image/jpeg`的时候才有效。
				quality: 100,
				// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
				allowMagnify: false,
				// 是否允许裁剪。
				crop: true,
				// 为空的话则保留原有图片格式。
				// 否则强制转换成指定的类型。
				type: "image/jpeg"
			},
			//文件上传方式
			method: "POST",
			//服务器地址;
			server: "",
			//是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容
			sendAsBinary: false,
			// 开起分片上传。 thinkphp的上传类测试分片无效,图片丢失;
			chunked: true,
			// 分片大小
			chunkSize: 512 * 1024,
			//最大上传的文件数量, 总文件大小,单个文件大小(单位字节);
			fileNumLimit: 5,
			fileSizeLimit: 50000 * 1024,
			fileSingleSizeLimit: 5000 * 1024
		};
	}

	//实例化Web Uploader
	function getUploader(opt) {
		return new WebUploader.Uploader(opt);;
	}

	//操作进度条;
	function showProgress(progress, file, text) {
		var $fileBox = $('#fileBox_' + file.id),
			$progress = $fileBox.find(".progress");
		if (progress == 0) {
			var i = 20;
			setInterval(function() {
				i = i + 5;
				$progress.width(i + "%").addClass("am-progress-bar-danger");
			}, 55)
		} else {
			progress = progress + '%';
		}
	}

	// 事件等等
	function createBox($fileInput, file, webUploader) {
		var newBtn = $(".new-up-btn");
		var fileId = file.id;
		//创建文件操作div;	
		var $selectBox = $("#select-img-box"),
			$startBtn = $("#start_upload"),
			$allRemove = $("#all-remove");
			
		if($fileInput.find(".open-upload").length <= 0){
			$fileInput.append(newBtn.html());
		}
//		newBtn.show();
		//开始上传,暂停上传,重新上传事件;
		var uploadStart = function() {
				webUploader.upload();
				$startBtn.text('暂停上传').one('click', function() {
					webUploader.stop();
					$(this).text('继续上传').one('click', function() {
						uploadStart();
					});
				});
			}
			//绑定开始上传按钮;
		$startBtn.one('click', uploadStart);
		//绑定取消全部按钮;
		$allRemove.one('click', function() {
			console.log(webUploader.getFiles());
			var fileArr = webUploader.getFiles('queued');
			$.each(fileArr, function(i, v) {
				webUploader.removeFile(file_id);
			});
			$selectBox.html("");
		});
		var $newUploadLi = '<li id="fileBox_' + fileId + '" class="diyUploadHover"><div class="am-gallery-item am_list_block am-text-center">' +
			'<img id="fileImg_' + fileId + '" class="am-img-thumbnail" src="../assets/img/load.gif"></br> <span>' + file.name + '</span>' +
			'<div class="am-progress am-progress-striped am-progress-sm am-active" style="margin-bottom:5px;">' +
			'<div class="am-progress-bar progress" style="width: 0%;"></div></div>' +
			'<span>11</span></div></li>';
		$selectBox.append($newUploadLi);
		var $fileBox = $selectBox.find('#fileBox_' + fileId);

		// 生成预览缩略图;
		webUploader.makeThumb(file, function(error, dataSrc) {
			if (!error) {
				$fileBox.find('#fileImg_' + fileId).attr("src", dataSrc);
			}
		});

	}
	
	//获取文件类型;
	function getFileTypeClassName(type) {
		var fileType = {};
		var suffix = '_diy_bg';
		fileType['pdf'] = 'pdf';
		fileType['zip'] = 'zip';
		fileType['rar'] = 'rar';
		fileType['csv'] = 'csv';
		fileType['doc'] = 'doc';
		fileType['xls'] = 'xls';
		fileType['xlsx'] = 'xls';
		fileType['txt'] = 'txt';
		fileType = fileType[type] || 'txt';
		return fileType + suffix;
	}
}));