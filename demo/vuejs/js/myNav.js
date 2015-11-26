define(["navdata","vue"], function(navdata,Vue) {　　　　
	Vue.component('my-nav', {
		template: '<ul class="list-unstyled text-center">' +
			'<li v-for="item in nav"><a href="{{item.url}}"><h2>{{item.txt}}' +
			'</h2></a></li></ul>',
		data: function() {
			return {
				nav:navdata
			}
		}
	})
	return navdata;
});
