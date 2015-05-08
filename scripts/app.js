/* global angular */
var app = angular.module("app", []);

app.controller("AppCtrl", function ($http, $scope) {
	$scope.fetchData = function () {
		document.getElementById("displayBlock").className = 'hidden';
		document.getElementById("throbber").className = 'throbber';
		document.getElementById("intermediate").className = 'unhidden';
		document.getElementById("header").className = 'step';
		var app = this, alert;

		function displayCharts() {
			document.getElementById("pieChart").innerHTML = "";
			document.getElementById("count").innerHTML = "";
			document.getElementById("languages").innerHTML = "";

			$http.get("https://api.github.com/users/" + $scope.formUsernameText + "/repos?per_page=9999").success(function (data) {
				var languages = [];
				var count = [];
				var position = 0,
					index;
				for (var item in data) {
					if (data[item].language !== null) {
						index = languages.indexOf(data[item].language);
						if (index === -1) {
							languages[position] = data[item].language;
							count[position] = 1;
							position++;
						} else {
							count[index]++;
						}
					}
				}

				//Create Pie Chart
				/* global Raphael */
				var r = new Raphael("pieChart");
				r.text(150, 50, "Language Usage Statistics").attr({
					font: "20px sans-serif"
				});
				var pie = r.piechart(100, 150, 75, count, {
					legend: languages,
					legendpos: "east"
				});
				pie.hover(function () {
					this.sector.stop();
					this.sector.scale(1.1, 1.1, this.cx, this.cy);

					if (this.label) {
						this.label[0].stop();
						this.label[0].attr({
							r: 7.5
						});
						this.label[1].attr({
							"font-weight": 800
						});
					}
				}, function () {
					this.sector.animate({
						transform: 's1 1 ' + this.cx + ' ' + this.cy
					}, 100, "bounce");

					if (this.label) {
						this.label[0].animate({
							r: 5
						}, 100, "bounce");
						this.label[1].attr({
							"font-weight": 400
						});
					}
				});

				document.getElementById("count").innerHTML = "<strong>Number of Languages:</strong> " + position;
				document.getElementById("repoStats").innerHTML = "<strong>Number of Repositories per Language:-</strong>";
				var langdata, value, datanode, valuenode, node;
				for (var language in languages) {
					if(language) {
						node = document.createElement("tr");
						langdata = document.createElement("td");
						value = document.createElement("td");
						datanode = document.createTextNode(languages[language]);
						langdata.appendChild(datanode);
						valuenode = document.createTextNode(count[language].value);
						value.appendChild(valuenode);
						node.appendChild(langdata);
						node.appendChild(value);
						document.getElementById("languages").appendChild(node);
					}
				}
			}).error(function () {
				document.getElementById("intermediate").className = 'hidden';
				document.getElementById("header").className = 'initial';
				alert("Hmm.... That doesn't look quite right!\n\n GitView couldn't find the User's data on GitHub! :-/");
			});
		}

		$http.get("https://api.github.com/users/" + $scope.formUsernameText).success(function (data) {
			app.user = data;

			$scope.name = app.user.name;
			$scope.avatar_url = app.user.avatar_url;

			if (app.user.html_url === null) {
				$scope.html_url = "Not Shared";
			} else {
				$scope.html_url = app.user.html_url;
			}
			if (app.user.company === null || app.user.company === "") {
				$scope.company = "Not Shared";
			} else {
				$scope.company = app.user.company;
			}
			if (app.user.blog === null) {
				$scope.website = "Not Shared";
				$scope.websiteLink = "";
			} else {
				$scope.website = app.user.blog;
				$scope.websiteLink = $scope.website;
			}
			if (app.user.location === null) {
				$scope.location = "Not Shared";
			} else {
				$scope.location = app.user.location;
			}
			if (app.user.email === null) {
				$scope.email = "Not Shared";
				$scope.emailLink = "";
			} else {
				$scope.email = app.user.email;
				$scope.emailLink = "mailto:" + $scope.email;
			}
			if (app.user.hireable) {
				$scope.hireable = "Yes";
			} else {
				$scope.hireable = "No";
			}

			$scope.public_repos = app.user.public_repos;
			$scope.public_gists = app.user.public_gists;
			$scope.followers = app.user.followers;
			$scope.following = app.user.following;
			var date = new Date(app.user.created_at);
			$scope.created_at = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

			//Display Block Functions
			document.getElementById("throbber").className = 'hidden';
			document.getElementById("displayBlock").className = 'unhidden';
			document.getElementById("header").className = '';

			//Call Chart Display Function
			displayCharts();

		}).error(function () {
			document.getElementById("intermediate").className = 'hidden';
			document.getElementById("header").className = 'initial';
			alert("Hmm.... That doesn't look quite right!\n\nGitView couldn't find the User's data on GitHub! :-/");
		});
	};
});