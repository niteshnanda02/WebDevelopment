//jshine eversion: 6

const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitDB",{ useNewUrlParser: true , useUnifiedTopology: true });

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: Number,
    review: String
});

const Fruit = mongoose.model("Fruit",fruitSchema);

const fruit = new Fruit({
    name: "Watermelon",
    rating: 10,
    review: "Yummy!"
});

//fruit.save();

/*Fruit.deleteOne({name: "Watermelon"},function(err){
    if(err)
        console.log(err);
    else
        console.log("Data deleted successfully!");
});*/

Fruit.deleteMany({name: "Orange",name: "Kiwi"},function(err){
    if(err)
        console.log(err);
    else
        console.log("Deleted");
});


const personSchema =new mongoose.Schema({
    name: String,
    age: Number
});

const Person = mongoose.model("Person",personSchema);

const person=new Person({
    name: "John",
    age: "35"
});

const kiwi =new Fruit({
    name: "kiwi",
    rating: "9",
    review: "Very Costly!"
});

const banana = new Fruit({
    name: "Banana",
    rating: 8,
    review: "Gym lovers!"
});

const orange=new Fruit({
    name: "Orange",
    rating: 8,
    review: "Juice lovers!"
});

/*Fruit.insertMany([kiwi,banana,orange], function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Successfully inserted all fruits");
    }
});
*/
Fruit.find(function(err, fruits){
    if(err)
        console.log(err);
    else{
        mongoose.connection.close();
        fruits.forEach(function(fruit){
            console.log(fruit.name);
        });
    }
});