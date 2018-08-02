var clientId = '0338f5fdfd33a577d6fa'
var clientSecret = '975d21df1f6683b67fe436b638deb7bc4f4d750f'
var authApi = `client_id=${clientId}&client_secret=${clientSecret}`

var demo = new Vue({
	el: '#app',
	data: {
		user: '',
		branches: ['master', 'dev'],
		currentBranch: 'master',
		commits: null,
		repos: [],
		commitsRepos: [],
	},
	watch: {
		currentBranch: 'fetchData'
	},
	computed: {
		apiURLRepos() {
			return `https://api.github.com/users/${this.user}/repos?${authApi}`
		},
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
			xhr.open('GET', self.apiURLRepos)
			xhr.onload = function () {
				self.repos = JSON.parse(xhr.responseText)

				self.fetchCommits()
			}
			xhr.send()
		},
		fetchCommits: function() {
			var self = this

			this.repos.forEach(function(repo) {
				var xhr = new XMLHttpRequest()
				xhr.open('GET', self.apiURLCommits(repo.full_name))
				xhr.onload = function () {
					self.commitsRepos.push({
							full_name: repo.full_name,
							numero: JSON.parse(xhr.responseText).length
					})
				}
				xhr.send()
			})

		 },
		apiURLCommits(fullNameRepo) {
			return `https://api.github.com/repos/${fullNameRepo}/commits?${authApi}&author=${this.user}`
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
