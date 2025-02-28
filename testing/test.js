// async function fetchData() {
//     try{
//         // const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
//         // const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
//         const pokemonID = document.getElementById("pokemonName").value;
//         const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        

//         if(!response.ok){
//             throw new Error("Could not fetch resource");
//         }

//         const data = await response.json();
//         const pokemonSprite = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
//         const imgElement = document.getElementById("pokemonSprite");
//         imgElement.src = pokemonSprite;
//         imgElement.style.display = "block";
//         imgElement.style.height = "480px"; 

//         console.log(data);
//     }catch(error){
//         console.error(error);

//     }
// }

// const pokemonSprite = data.sprites.versions["generation-viii"].icons.front_default;
// const pokemonSprite = data.sprites.versions["generation-vi"]["x-y"].front_default;
// const pokemonSprite = data.sprites.front_default;
// const pokemonSprite = data.sprites.other.dream_world.front_default;
// const pokemonSprite = data.sprites.other.home.front_default;
// const pokemonSprite = data.sprites.other["official-artwork"].front_default;
// const pokemonSprite = data.sprites.other.showdown.front_default;


const pokemonCount = 100;
var pokedex = {};

window.onload = async function() {
    // Fetch each Pokémon
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
    }
    
    // Once all are fetched, display them
    displayPokemons();
    console.log(pokedex);
}

async function getPokemon(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();
    console.log(pokemon);

    // Get the Pokémon name.
    let pokemonName = pokemon.name;

    // Get the types as a comma-separated string.
    let pokemonTypes = pokemon.types.map(t => t.type.name);
    
    // Get the default front image.
    // let pokemonImg = pokemon.sprites.front_default;

    // Pokemon Home Sprites
    let pokemonImg = pokemon.sprites.other.home.front_default;

    // Pokemon Official Artwork Sprites
    // let pokemonImg = pokemon.sprites.other["official-artwork"].front_default;

    // Pokemon Gen V Animated Sprites
    // let pokemonImg = pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default;

    // Save the data to our pokedex object.
    pokedex[num] = { "name": pokemonName, "types": pokemonTypes, "img": pokemonImg };
}

// This function creates a card element for each Pokémon.
function createCard(pokemon, id) {
    const card = document.createElement("div");
    card.className = "list-item"; // You can style this class in your CSS.

    // Create HTML for each type separately.
    let typesHTML = '';
    pokemon.types.forEach(type => {
        typesHTML += `<div class="pokemon-type">${type}</div>`;
    });

    card.innerHTML = `
        <div class="img-wrap">
            <img id=pokemonSprite src="${pokemon.img}" alt="${pokemon.name}" />
        </div>
        <div class="number-wrap body2-fonts">
            <p>#${id}</p>
        </div>
        <div class="name-wrap body1-fonts">
            <p>${pokemon.name}</p>
        </div>
        <div class="types-wrap">
            ${typesHTML}
        </div>
    `;
    return card;
}

function displayPokemons() {
    // Use querySelector to get the first element with the class "list-wrapper"
    const listWrapper = document.querySelector(".list-wrapper");
    listWrapper.innerHTML = ""; // Clear any previous content

    for (let i = 1; i <= pokemonCount; i++) {
        if (pokedex[i]) {
            const card = createCard(pokedex[i], i);
            listWrapper.appendChild(card);
        }
    }
}
