var demo = new Vue({
	el: '#app',
	data: {

	},
	methods: {

	}
});

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
