const DataModule = require('./data');
const http = require('http');
const url = require('url');
let app = http.createServer((req,res)=>{
    let json = DataModule.getData();
    const queryObject = url.parse(req.url,true).query;
    let name = queryObject.name;
    json = json.filter(function(elem) {
        if(name === undefined) return true;
        return elem.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
    })

    let ingredientName = queryObject.iName;
	let dishName = queryObject.dName;
	let selIngridients = queryObject.selIngr.split(',').filter(elem => {
		return elem.length > 0;
	});
	console.log(selIngridients);
	/*Filter by ingredient name*/
    json = json.filter(function(elem) {
        if(ingredientName === undefined) return true;
		if(ingredientName.length === 0) return true;
        let ingarr = elem.ingredients.filter(ingredient => {
           if(ingredient.name.toLowerCase().indexOf(ingredientName.toLowerCase()) !== -1){
               return true;
           }

           return false;

        });
		
        return ingarr.length > 0;
    })
	/*Filter by recipe name*/
	json = json.filter(function(elem) {
		if(dishName === undefined) return true;
		if(dishName.length === 0) return true;
		if(elem.name === dishName) return true;
		return false;
	});
	
    /*Filter by ingredients containing*/
	json = json.filter(function(elem) {
        if(selIngridients.length === 0) return true;
		
		let selIngCount = selIngridients.length;
		let matchedCount = 0;
		for(let i = 0; i < elem.ingredients.length; i++) {
			for(let j = 0; j < selIngCount; j++) {
				if(elem.ingredients[i].name.toLowerCase() === selIngridients[j].toLowerCase())
				{
					matchedCount++;
				}
			}
		}
		
        return selIngCount === matchedCount;
    })
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(json))
})


app.listen(3000, '127.0.0.1');
console.log('SERVER IS RUNNING');