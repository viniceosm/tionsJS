var clientId = '0338f5fdfd33a577d6fa';
var clientSecret = '975d21df1f6683b67fe436b638deb7bc4f4d750f';
var authApi = `client_id=${clientId}&client_secret=${clientSecret}`;

var demo = new Vue({
	el: '#app',
	data: {
		user: '',
		repos: [],
		total_commits: 'Calculando',
		buscandoNumeroCommits: true,
		datasCommits: []
	},
	computed: {
		apiURLRepos() {
			return `https://api.github.com/users/${this.user}/repos?${authApi}`;
		},
		usuarioVazio() {
			return this.user.trim() === '';
		}
	},
	filters: {
		truncate: function (v) {
			var newline = v.indexOf('\n');
			return newline > 0 ? v.slice(0, newline) : v;
		},
		formatDate: function (v) {
			return v.replace(/T|Z/g, ' ');
		}
	},
	created() {
		let html = '';
		datasDoQuadro = [];

		for (let index = 0; index < 371; index++) {
			let data = new Date();
			data.setDate(data.getDate() - index);
			datasDoQuadro.push(data);
		}

		datasDoQuadro = datasDoQuadro.reverse();

		for (let data of datasDoQuadro) {
			html += `<div class="dias" data="${formataData(data)}"></div>`;
		}

		$("#quadro").append(html);
	},
	methods: {
		fetchRepos: function () {
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open('GET', self.apiURLRepos);
			xhr.onload = function () {
				self.repos = JSON.parse(xhr.responseText);

				self.fetchCommits();
			}
			xhr.send()
		},
		fetchCommits: function() {
			var self = this;

			datasCommits = self.datasCommits.slice(0);

			self.repos.forEach(function(repo, index) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', self.apiURLCommits(repo.full_name));
				xhr.onload = function () {
					var commits = JSON.parse(xhr.responseText);
					self.repos[index] = {
						...self.repos[index],
						numero_commits: commits.length,
						commits
					}

					let datasCommitsMap = commits.map(function (commit) {
						let date = new Date(commit.commit.author.date);
						let form = formataData(date);
						return form;
					});

					datasCommits = datasCommits.concat(datasCommitsMap);

					if (index === self.repos.length -1) {
						self.fetchCommitsEnd();
						self.repos = self.repos.slice(0);

						datasCommits = sortearPorDataString(verRepeticao(datasCommits), 1);
						self.datasCommits = datasCommits.slice(0);
						console.log(self.datasCommits);
					}
				}
				xhr.send();
			})
		},
		fetchCommitsEnd() {
			this.refreshTotalCommits();
			this.buscandoNumeroCommits = false;
		},
		refreshTotalCommits() {
			this.total_commits = this.repos.reduce(function (acc, repo) {
				return acc + repo.numero_commits;
			}, 0)
		},
		apiURLCommits(fullNameRepo) {
			return `https://api.github.com/repos/${fullNameRepo}/commits?${authApi}&author=${this.user}`;
		}
	}
})

function formataData(date) {
	return `${date.getDate().toString().padStart(2, '0')}/${date.getMonth().toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function verRepeticao(arr) {
	var valorRepeticaoIndex = [];
	var valorRepeticao = [];

	arr = arr.slice(0);
	arr.forEach(valorVerificar => {
		var i = valorRepeticaoIndex.findIndex(v => v == valorVerificar);

		if (i == -1) {
			valorRepeticaoIndex.push(valorVerificar);
			i = valorRepeticaoIndex.length - 1;
		}

		var q = ((valorRepeticao[i] != undefined) ? (valorRepeticao[i].q + 1) : 1);
		valorRepeticao[i] = { valorVerificar, q };
	});

	return valorRepeticao;
}

function sortearPorDataString(array, order) {
	let byData = array.slice(0);
	return byData.sort(function (a, b) {
		let x = a.valorVerificar.split('/').reverse();
		x = new Date(x[0], x[1], x[2]).getTime();

		let y = b.valorVerificar.split('/').reverse();
		y = new Date(y[0], y[1], y[2]).getTime();

		if (order == 1)
			return x - y;
		return y - x;
	});
}

let titleProject = document.getElementById('titleProject');

window.setInterval(() => {
	animacaoNomeProjeto();
}, 5000);

function animacaoNomeProjeto() {
	$(titleProject).fadeOut(2000, function () {
		titleProject.textContent = 'tionsJS'
		$(titleProject).fadeIn(2000);
	});
}