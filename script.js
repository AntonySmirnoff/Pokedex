var pokemons = {};
var url = "http://pokeapi.co/api/v1/pokemon/?limit=12";
var result;
var attackTypeLabels = [];
var pokemonsByAttackType = {};
var lastSelectedLabel;
window.onload = load();

function load(){
	loadMore();
	addAllLabel();
}

function addAllLabel(){
	var attackTypeLabel = document.createElement('span');
		attackTypeLabel.innerHTML = 'All';
		attackTypeLabel.className = "attackTypeLabels";
		attackTypeLabel.style.backgroundColor = '#F2F2F2';
		attackTypeLabel.onclick = selectLabel;
		attackTypeLabel.onmouseover = preSelectLabel;
		attackTypeLabel.onmouseout = unSelectLabel;
	document.getElementById('attackLabels').appendChild(attackTypeLabel);
}

var offset = $('#infodiv').offset();
var topPadding = 100;
$(window).scroll(function() {
    if ($(window).scrollTop() > offset.top) {
       $('#infodiv').stop().animate({marginTop: $(window).scrollTop() - offset.top + topPadding});
    }
    else {
        $('#infodiv').stop().animate({marginTop: document.getElementById('info').offsetHeight + 50});
    }
});

function selectLabel(){
	if (this.textContent == 'All'){
		document.getElementById('content').innerHTML = '';
		for (y in pokemons){
			pokemonPreviewDiv(pokemons[y]);
		}
	}
	else {
		var shownPokemons = pokemonsByAttackType[this.textContent];
		document.getElementById('content').innerHTML = '';
		for (j in shownPokemons){
			pokemonPreviewDiv(pokemons[shownPokemons[j]]);
		}
	}
}

function loadMore(){
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
			result = JSON.parse(request.responseText);
			for (i in result.objects){
				pokemonPreviewDiv(result.objects[i]);
				addLabel(result.objects[i]);
				addPokemons(result.objects[i]);
			}
			url = "http://pokeapi.co" + result.meta.next;
		}
	}
	request.send(null);
	document.getElementById('infodiv').innerHTML = '';
	document.getElementById('infodiv').style.border = '';
}

function pokemonsByAttack(attackType, pokemonName){
	if (!pokemonsByAttackType[attackType])
		pokemonsByAttackType[attackType] = [];
	pokemonsByAttackType[attackType].push(pokemonName);
}

function pokemonPreviewDiv(pokemon){
	var pokemonPreview = document.createElement('div');
	pokemonPreview.onclick = select;
	pokemonPreview.className = 'preview';
	pokemonPreview.id = pokemon.name;
	var pokemonImg = document.createElement('img');
	pokemonImg.src = 'http://pokeapi.co/media/img/' + pokemon.national_id + '.png';
	pokemonImg.width = 120;
	var pokemonName = document.createElement('p');
	pokemonName.innerHTML = pokemon.name;
	var attackTypes = document.createElement('div');
	document.getElementById('content').appendChild(pokemonPreview);
	document.getElementById('content').lastChild.appendChild(pokemonImg);
	document.getElementById('content').lastChild.appendChild(pokemonName);
	document.getElementById('content').lastChild.appendChild(attackTypes);
	for (k in pokemon.types){
//		pokemonsByAttack(pokemon.types[k].name, pokemon.name) 
		var attackType = document.createElement('span');
		attackType.innerHTML = pokemon.types[k].name;
		attackType.className = "attack";
		attackType.style.backgroundColor = attackLabel(pokemon.types[k].name);
//		var attackTypeLabel = attackType.cloneNode(true);
//		attackTypeLabel.className = "attackTypeLabels";
//		attackTypeLabel.onclick = selectLabel;
//		var index = attackTypeLabels.indexOf(pokemon.types[k].name);
//		if (index < 0){
//			attackTypeLabels.push(pokemon.types[k].name);
//			document.getElementById('attackLabels').appendChild(attackTypeLabel);
//		}
		document.getElementById('content').lastChild.lastChild.appendChild(attackType);
	}
}

function addLabel(pokemon){
	for (k in pokemon.types){
		pokemonsByAttack(pokemon.types[k].name, pokemon.name) 
		var attackTypeLabel = document.createElement('span');
		attackTypeLabel.innerHTML = pokemon.types[k].name;
		attackTypeLabel.className = "attackTypeLabels";
		attackTypeLabel.style.backgroundColor = attackLabel(pokemon.types[k].name);
		attackTypeLabel.onclick = selectLabel;
		attackTypeLabel.onmouseover = preSelectLabel;
		attackTypeLabel.onmouseout = unSelectLabel;
		var index = attackTypeLabels.indexOf(pokemon.types[k].name);
		if (index < 0){
			attackTypeLabels.push(pokemon.types[k].name);
			document.getElementById('attackLabels').appendChild(attackTypeLabel);
		}
	}
	$('#infodiv').stop().animate({marginTop: document.getElementById('info').offsetHeight + 50})
}

function attackLabel(attackType){
	switch(attackType){
		case 'normal':
			return '#CED8F6';
		case 'water':
			return '#81BEF7';
		case 'fire':
			return '#FC4C4C';
		case 'poison':
			return '#86B404';
		case 'electric':
			return '#F7D358';
		case 'flying':
			return '#85F3FF';
		case 'bug':
			return '#A6E480';
		case 'ground':
			return '#774949';
		case 'fairy':
			return '#F995F1';
		case 'grass':
			return '#B1814E';
		case 'fighting':
			return '#A463CB';
		default:
			return '#82974C';
	}
}

function addPokemons(obj){
	pokemons[obj.name] = obj;
}

function select(){
	
	var pokemon = pokemons[this.id];
	var pokemonImg = document.createElement('img');
	pokemonImg.src = 'http://pokeapi.co/media/img/' + pokemon.national_id + '.png';
	var pokemonParamsNames = ['Type', 'Attack', 'Defense', 'HP', 'Sp Attack', 'SP Defense', 'Speed', 'Weight', 'Total moves'];
	var pokemonParams = [pokemon.types[0].name, pokemon.attack, pokemon.defense, pokemon.hp, pokemon.sp_atk, pokemon.sp_def, pokemon.speed, pokemon.weight, pokemon.moves.length];
	var table = document.createElement("table");
	var tableBody = document.createElement("tbody");
	for (var j = 0; j < pokemonParamsNames.length; j++) {
		var row = document.createElement("tr");
		for (var i = 0; i < 2; i++) {
			var cell = document.createElement("td");
			if (i == 0)	var cellText = document.createTextNode(pokemonParamsNames[j]);
			else var cellText = document.createTextNode(pokemonParams[j]);
			cell.appendChild(cellText);
			row.appendChild(cell);
		}
		tableBody.appendChild(row);
	}
	var colPPN = document.createElement('col');
	colPPN.width = 120;
	var colPN = document.createElement('col');
	colPN.width = 60;
	table.border = 1;
	table.appendChild(tableBody);
	table.appendChild(colPPN);
	table.appendChild(colPN);
	document.getElementById('infodiv').innerHTML = '';
	document.getElementById('infodiv').appendChild(pokemonImg);
	document.getElementById('infodiv').appendChild(table);	
	document.getElementById('infodiv').style.border = "1px solid black";	
}

function preSelectLabel(){
	this.style.border = '1px solid black';
}

function unSelectLabel(){
	this.style.border = '1px solid #fff';
}
