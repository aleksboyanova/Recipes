const baseUrl = 'http://localhost:3000';

let view = 'list';
let recipes = [];
let selectedIngridients = [];

function getRecipes(params = {}) {

    let param = (new URLSearchParams(params).toString())
    let url = baseUrl+"?"+param;
    $.ajax({
        method: "GET",
        url: url
    })
    .done(recipesRes => {
        recipes = recipesRes;
        renderRecipesList();
    })
    .fail(response => {
        console.log(response);
    })
    .always(() => {
        console.log('ajax completed');
    })
}

function renderRecipesList(){
    $recipesList = $('#recipes-list');
    $recipesList.empty();

    recipes.forEach(recipe => {
        const $template = getRecipesTemplate(recipe);
        $recipesList.append($template);
        console.log('test');
    })
}

function getRecipesTemplate(recipe){
    const templateSelector = `#recipes-${view}-template`;
    const $template = $($(templateSelector).html());
    $template.removeClass('d-none');
    $template.find('.fw-bold.recipes-dish-name').text(recipe.name);
    $template.find('.recipes-overview').html(getIngredientsHtml(recipe.ingredients));
    $template.find('.img-recipe').attr('src', recipe.imageURL);
    $template.find('.steps').html(getStepsHtml(recipe.steps));
    
    
    return $template;
    
}

function getIngredientsHtml(ingredients) {
    let html = '<h5>Ingredients: </h5>';
    ingredients.forEach(ingredient => {
        html += '<div>' + ingredient.name + ' - ' + ingredient.quantity + '</div>';
    });

    return html;
}

function getStepsHtml(steps) {
    let html = '<h5>Steps: </h5>';
    steps.forEach(step => {
        html += '<div>' + step +'</div>';
    });

    return html;
}

$('body').on('click','input[type=checkbox]', function() {
    let isChecked = $(this).is(':checked');
    let value = $(this).val();
    if(isChecked) {
        selectedIngridients.push(value);
    } else {
        let index = selectedIngridients.findIndex((itemVal) => value === itemVal);
        selectedIngridients.splice(index, 1);
    }

});

$('#get-recipes').on('click', () => {
    let iName = $('#iName').val();
    let dName = $('#dName').val();
    let selIngr = selectedIngridients;
    getRecipes({iName, dName, selIngr});
});

$('#grid-view').on('click', function() {
    view = 'grid';
    $(this).removeClass('btn-outline-primary');
    $(this).addClass('btn-primary');
    $('#list-view').removeClass('btn-primary');
    $('#list-view').addClass('btn-outline-primary');
    renderRecipesList();
});

$('#list-view').on('click', function() {
    view = 'list';
    $(this).removeClass('btn-outline-primary');
    $(this).addClass('btn-primary');
    $('#grid-view').removeClass('btn-primary');
    $('#grid-view').addClass('btn-outline-primary');
    renderRecipesList();
});