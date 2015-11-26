define(['vue'], function(Vue) {　　　　
	Vue.component('my-nav', {
		template: '<ul class="list-unstyled">' +
			'<li v-for="item in nav">{{item.li}}</li>' +
			'</ul>',
		data: function() {
			return {
				nav: [{
					li: "入门"
				}, {
					li: "列表"
				}]
			}
		}
	})
});