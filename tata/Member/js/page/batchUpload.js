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
	(function($) {
		$.fn.extend({
			batchUpload: function(opt, serverCallBack) {
				if (typeof opt != "object") {
					alert('参数错误!');
					return;
				}
				var options = $.extend({}, options);

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
					showDiyProgress(percentage.toFixed(0), file);
				});

				//全部上传结束后触发;
				webUploader.on('uploadFinished', function() {
					console.log("上传完毕");
					uploadStatus("上传成功", webUploader);
				});

				//绑定发送至服务端返回后触发事件;
				webUploader.on('uploadAccept', function(object, data) {
					if (serverCallBack) serverCallBack(data);
				});

				//上传成功后触发事件;
				webUploader.on('uploadSuccess', function(file, response) {
					fileIdUpsloadStatus(file, "上传成功");
					if (successCallBack) {
						successCallBack(response);
					}
				});

				//上传失败后触发事件;
				webUploader.on('uploadError', function(file, reason) {
					fileIdUpsloadStatus(file, "上传失败");
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
					selectError(text);
				});
			}
		});

		// 选择文件错误
		function selectError(text) {
			var mainAlert = $("#main-alert");
			if (mainAlert.length == 0) {
				var $alert = '<div class="am-alert am-alert-danger ie-warning am-text-center am-text-lg" data-am-alert id="main-alert">' +
					'<button type="button" class="am-close">&times;</button>' +
					'<i class="am-icon-warning faa-flash animated"></i> ' + text + '</div>';
			} else {
				mainAlert.find(".main-alert-text").text(text);
				mainAlert.find(".am-icon-warning").addClass("faa-flash animated");
			}
		}

		//Web Uploader默认配置;
		function getOption(objId) {
			return {
				//按钮容器;
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
					width: 230,
					height: 230,
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
				fileSizeLimit: 5000 * 1024,
				fileSingleSizeLimit: 500 * 1024
			};
		}

		//实例化Web Uploader
		function getUploader(opt) {
			return new WebUploader.Uploader(opt);;
		}

		// 单文件上传状态		
		function fileIdUpsloadStatus(file, text) {
			var $fileBox = $('#fileBox_' + file.id);
			var $progress = $fileBox.find('.progress');
			var $progressText = $fileBox.find('.progressText');
			$progressText.text(text);
			if (text == "上传失败") {
				$progress.width("5%").addClass("am-progress-bar-danger")
			}
		}

		// 上传完成的事件
		function uploadStatus(status, webUploader) {
			var fileArr = webUploader.getFiles("complete");
			var fileArrError = webUploader.getFiles("error");
			if (status) {
				var uploadAlert = $('#upload-status-alert');
				var uploadText = uploadAlert.find(".upload-status-text");
				var fatxt = '<span class="am-text-success am-text-xl">' + fileArr.length + '</span> 张图片上传成功';
				if (fileArrError.length > 0) {
					fatxt += ', <span class="am-text-danger am-text-xl">' + fileArrError.length + '</span> 张图片上传失败';
				}
				uploadText.html(fatxt);
				uploadAlert.modal({
					relatedTarget: this,
					onCancel: function() {}
				});
			}
		}

		//操作进度条;
		function showDiyProgress(progress, file) {
			var $fileBox = $('#fileBox_' + file.id);
			var $progress = $fileBox.find('.progress');
			var $progressText = $fileBox.find('.progressText');
			$progress.width(progress + "%");
			$progressText.text(progress + "%");
			if (progress > 80) {
				$progress.addClass("am-progress-bar-success").removeClass("am-progress-bar-warning am-progress-bar-danger");
			} else if (progress > 30 && progress < 80) {
				$progress.addClass("am-progress-bar-warning").removeClass("am-progress-bar-danger")
			} else {
				$progress.addClass("am-progress-bar-danger")
			}
		}

		//取消事件;	
		function removeFile($li, file_id, webUploader) {
			webUploader.removeFile(file_id);
			$li.remove();
		}

		//创建文件操作div;
		function createBox($fileInput, file, webUploader) {
			var file_id = file.id,
				$parentFileBox = $("#select-box"),
				$selectBox = $("#select-img-box"),
				$pfbBtn = $parentFileBox.find('.batchButton');

			if ($pfbBtn.length <= 0) {
				var $div = '<div class="batchButton am-text-center"> \
							<a class="batchStart am-btn am-btn-warning am-radius" href="javascript:void(0)">开始上传</a> \
							<a class="batchRemoveAll am-btn am-btn-danger am-radius" href="javascript:void(0)">全部删除</a> \
						</div>';
				$parentFileBox.append($div);
				$pfbBtn = $parentFileBox.find('.batchButton');
				var $startButton = $pfbBtn.find('.batchStart');
				var $batchRemoveAll = $pfbBtn.find('.batchRemoveAll');

				//绑定开始上传按钮;
				$startButton.on('click', function() {
					webUploader.upload();
				});

				//绑定取消全部按钮;
				$batchRemoveAll.on('click', function() {
					var fileArr = webUploader.getFiles("inited");
					$.each(fileArr, function(i, v) {
						removeFile($('#fileBox_' + v.id), v.id, webUploader);
					});
				});
			}

			var $newUploadLi = '<li id="fileBox_' + file_id + '" class="diyUploadHover"><div class="am-gallery-item am_list_block am-text-center">' +
				'<img id="fileImg_' + file_id + '" class="am-img-thumbnail" src="../assets/img/load.gif"></br> <span class="am-text-truncate am-block">' + file.name + '</span>' +
				'<div class="am-progress am-progress-striped am-progress-sm am-active" style="margin-bottom:5px;">' +
				'<div class="am-progress-bar progress" style="width: 0%;"></div></div>' +
				'<span class="progressText">等待上传</span></div></li>';

			$selectBox.append($newUploadLi);
			var $fileBox = $selectBox.find('#fileBox_' + file_id);

			// 生成预览缩略图;
			webUploader.makeThumb(file, function(error, dataSrc) {
				if (!error) {
					$fileBox.find('#fileImg_' + file_id).attr("src", dataSrc);
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

	})(jQuery);
}));