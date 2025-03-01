// const pokemonSprite = data.sprites.versions["generation-viii"].icons.front_default;
// const pokemonSprite = data.sprites.versions["generation-vi"]["x-y"].front_default;
// const pokemonSprite = data.sprites.front_default;
// const pokemonSprite = data.sprites.other.dream_world.front_default;
// const pokemonSprite = data.sprites.other.home.front_default;
// const pokemonSprite = data.sprites.other["official-artwork"].front_default;
// const pokemonSprite = data.sprites.other.showdown.front_default;

// GEN 1
// const pokemonCount = 151;

// GEN 5
const pokemonCount = 649;

var pokedex = {};
window.onload = async function() {
    // Fetch each Pokémon concurrently.
    const promises = [];
    for (let i = 1; i <= pokemonCount; i++) {
        promises.push(getPokemon(i));
    }
    await Promise.all(promises);
    
    // Initially display all Pokémon.
    filterPokemons("");
    console.log(pokedex);

    // Add event listener to the search input.
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        filterPokemons(query);
    });
    
    // Add event listener to the radio buttons so that changing the mode re-filters the list.
    document.querySelectorAll('input[name="searchBy"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const query = searchInput.value.trim().toLowerCase();
            filterPokemons(query);
        });
    });
};

async function getPokemon(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();
    console.log(pokemon);

    // Get the Pokémon name.
    // Capitalize the first letter of the Pokémon name.
    let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // Get the types.
    // Capitalize the first letter of each Pokémon type.
    let pokemonTypes = pokemon.types.map(t => 
        t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
    );
    
    // Get the default front image.
    let pokemonImg = pokemon.sprites.front_default;

    // Pokemon Home Sprites
    // let pokemonImg = pokemon.sprites.other.home.front_default;

    // Pokemon Official Artwork Sprites
    // let pokemonImg = pokemon.sprites.other["official-artwork"].front_default;

    // Pokemon Gen V Animated Sprites
    // let pokemonImg = pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default;

    // On Hover/ Image 2
    let pokemonImg2 = pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default;

    // Save the data to our pokedex object.
    pokedex[num] = { "name": pokemonName, "types": pokemonTypes, "img": pokemonImg, "img2": pokemonImg2};
}

// This function creates a card element for each Pokémon.
function createCard(pokemon, id) {
    const card = document.createElement("div");
    card.className = "list-item"; // You can style this class in your CSS.

    // Mapping from type to color. (Make sure each type key is unique.)
    const typeColors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#EE99AC",  // Using the second dark color
        steel: "#B8B8D0"
    };  

    // Use the first type as the primary type for the border.
    const primaryType = pokemon.types[0].toLowerCase();
    const borderColor = typeColors[primaryType] || "#777";

    // Set a CSS variable on the card for the primary type color.
    card.style.setProperty('--primary-type-color', borderColor);

    // Create HTML for each type separately.
    let typesHTML = '';
    pokemon.types.forEach(type => {
        // Use lowercase version of the type as key.
        const color = typeColors[type.toLowerCase()] || "#777";  // Default color if not found.
        typesHTML += `<div class="pokemon-type" style="background-color: ${color};">
                          ${type}
                      </div>`;
    });

    card.innerHTML = `
        <div class="img-wrap">
            <img id=pokemonSprite src="${pokemon.img}" alt="${pokemon.name}" />
        </div>
        <div class="number-wrap body3-fonts">
            <p>#${id}</p>
        </div>
        <div class="name-wrap body1-fonts">
            <p>${pokemon.name}</p>
        </div>
        <div class="types-wrap body3-fonts">
            ${typesHTML}
        </div>
    `;

    // When the mouse enters the card, swap the image source.
    card.addEventListener('mouseenter', () => {
        const img = card.querySelector('#pokemonSprite');
        if (img) {
            img.src = pokemon.img2;
        }

        // Play hover sound
        // const hoverSound = new Audio('./sound/ruby_006C.wav');
        // const hoverSound = new Audio('./sound/ruby_006D.wav');
        // const hoverSound = new Audio('./sound/ruby_003A.wav');
        const hoverSound = new Audio('./sound/ruby_0005.wav');
        // const hoverSound = new Audio('./sound/SFX_MUTED_SNARE_1.wav');
        // const hoverSound = new Audio('./sound/ruby_0022.wav');
        // const hoverSound = new Audio('./sound/ruby_0038.wav');
        hoverSound.volume = 0.05;
        hoverSound.play();
    });

    // When the mouse leaves, change it back.
    card.addEventListener('mouseleave', () => {
        const img = card.querySelector('#pokemonSprite');
        if (img) {
            img.src = pokemon.img;
        }
    });

    card.addEventListener("click", async () => {
        const success = await fetchPokemonDataBeforeRedirect(id);
        if (success) {
            // Instantiate the Audio object (choose one)
            // const clickSound = new Audio('./sound/ruby_006C.wav');
            const clickSound = new Audio('./sound/ruby_006D.wav');
            // const clickSound = new Audio('./sound/ruby_003A.wav');
            // const clickSound = new Audio('./sound/ruby_0005.wav');
            // const clickSound = new Audio('./sound/SFX_MUTED_SNARE_1.wav');
            // const clickSound = new Audio('./sound/ruby_0022.wav');
            // const clickSound = new Audio('./sound/ruby_0001.wav');
                
            clickSound.volume = 0.4;
            clickSound.play();
    
            // Optionally, delay the redirect slightly to allow the sound to play.
            setTimeout(() => {
                window.location.href = `./species.html?id=${id}`;
            }, 480); // delay in milliseconds
        }
    });
    

    return card;
} 

async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => 
            res.json()
        ),

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
            res.json()
        ),
    ])
    return true
    } catch (error) {
        console.error("Failed to fetch Pokémon data before redirect")
    }
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
// Updated filterPokemons function with sorting
function filterPokemons(query) {
    const listWrapper = document.querySelector(".list-wrapper");
    listWrapper.innerHTML = "";
    
    // Get the search mode ("name" or "id") and the sort mode.
    const searchBy = document.querySelector('input[name="searchBy"]:checked').value;
    const sortBy = document.querySelector('input[name="sort"]:checked').value;
    
    // Build an array of Pokémon that match the search query.
    let filteredPokemons = [];
    for (let i = 1; i <= pokemonCount; i++) {
        if (pokedex[i]) {
            let pokemon = pokedex[i];
            if (
                query === "" || 
                (searchBy === "name" && pokemon.name.toLowerCase().includes(query)) || 
                (searchBy === "id" && i.toString() === query)
            ) {
                filteredPokemons.push({ id: i, pokemon: pokemon });
            }
        }
    }
    
    // Sort the filtered array based on the selected sort option.
    if (sortBy === "id-asc") {
        filteredPokemons.sort((a, b) => a.id - b.id);
    } else if (sortBy === "id-desc") {
        filteredPokemons.sort((a, b) => b.id - a.id);
    } else if (sortBy === "alpha-asc") {
        filteredPokemons.sort((a, b) => a.pokemon.name.localeCompare(b.pokemon.name));
    } else if (sortBy === "alpha-desc") {
        filteredPokemons.sort((a, b) => b.pokemon.name.localeCompare(a.pokemon.name));
    }
    
    // Display a "No Results" message if no Pokémon match the filter.
    if (filteredPokemons.length === 0) {
        listWrapper.innerHTML = `<div class="no-results">No Pokemon Found</div>`;
        return;
    }
    
    // Create and append cards for each Pokémon in the sorted list.
    filteredPokemons.forEach(item => {
        const card = createCard(item.pokemon, item.id);
        listWrapper.appendChild(card);
    });
}

// Add event listeners to the sort radio buttons to trigger filtering/sorting on change.
document.querySelectorAll('input[name="sort"]').forEach(radio => {
    radio.addEventListener("change", () => {
        const query = document.getElementById("search-input").value.trim().toLowerCase();
        filterPokemons(query);
    });
});

const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");

search_icon.addEventListener("click", handleSearchCloseOnClick);
function handleSearchCloseOnClick() {
    const searchInput = document.querySelector("#search-input");
    searchInput.value = "";
  
    // Re-filter with an empty query to display all Pokémon.
    filterPokemons("");
  }
  