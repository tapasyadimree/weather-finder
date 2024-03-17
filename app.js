import express from "express";
import bodyParser from "body-parser";
import https from "https";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.render("index.ejs");

})

app.post("/", function(req,res){
    const query = req.body.cityName;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.render("index.ejs", 
                {   description : desc , 
                    locationName : query , 
                    temprature : temp , 
                    imageURL : imgURL });
        });
    });


})


app.listen(3000, function(){
    console.log("server is running on port 3000");
})