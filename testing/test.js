// fetch("https://pokeapi.co/api/v2/pokemon/jefef")
//     .then(response => {
        
//         if(!response.ok){
//             throw new Error("Could not fetch resource");
//         }
//         return response.json();
//     })
//     .then(data => console.log(data.id))
//     .catch(error => console.error(error));

// fetchData();

async function fetchData() {
    try{
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        // const pokemonSprite = data.sprites.versions["generation-viii"].icons.front_default;
        const pokemonSprite = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
        // const pokemonSprite = data.sprites.versions["generation-vi"]["x-y"].front_default;
        // const pokemonSprite = data.sprites.front_default;
        // const pokemonSprite = data.sprites.other.dream_world.front_default;
        // const pokemonSprite = data.sprites.other.home.front_default;
        // const pokemonSprite = data.sprites.other["official-artwork"].front_default;
        // const pokemonSprite = data.sprites.other.showdown.front_default;
        const imgElement = document.getElementById("pokemonSprite");
        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";
        imgElement.style.height = "480px"; 

        console.log(data);
    }catch(error){
        console.error(error);

    }
}