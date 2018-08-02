var demo = new Vue({
	el: '#app',
	data: {
		user: '',
		branches: ['master', 'dev'],
		currentBranch: 'master',
		commits: null,
		repos: []
	},
	watch: {
		currentBranch: 'fetchData'
	},
	computed: {
		apiURL() {
			return `https://api.github.com/users/${this.user}/repos`
		}
	},
	filters: {
		truncate: function (v) {
			var newline = v.indexOf('\n')
			return newline > 0 ? v.slice(0, newline) : v
		},
		formatDate: function (v) {
			return v.replace(/T|Z/g, ' ')
		}
	},

	methods: {
		fetchData: function () {
			var xhr = new XMLHttpRequest()
			var self = this
			xhr.open('GET', this.apiURL)
			xhr.onload = function () {
				self.repos = JSON.parse(xhr.responseText)
			}
			xhr.send()
		}
	}
})

let titleProject = document.getElementById('titleProject');

window.setInterval(() => {
	animacaoNomeProjeto();
}, 5000);

function animacaoNomeProjeto() {
	$(titleProject).fadeOut(2000, function () {
		titleProject.textContent = 'tionsJS'
		$(titleProject).fadeIn(2000);
	});
};
