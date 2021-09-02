const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
const axios = require("axios");

require("dotenv").config();

// Main Type
const MainType = new GraphQLObjectType({
  name: "Main",
  fields: {
    temp: { type: GraphQLFloat },
    pressure: { type: GraphQLFloat },
    humidity: { type: GraphQLFloat },
    temp_min: { type: GraphQLFloat },
    temp_max: { type: GraphQLFloat },
  },
});

// Weather Type
const WeatherType = new GraphQLObjectType({
  name: "Weather",
  fields: {
    id: { type: GraphQLString },
    main: { type: GraphQLString },
    description: { type: GraphQLString },
    icon: { type: GraphQLString },
  },
});

// City Type
const CityType = new GraphQLObjectType({
  name: "City",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    weather: { type: GraphQLList(WeatherType) },
    main: { type: MainType },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    city: {
      type: CityType,
      args: {
        city: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios
          .get(
            `http://api.openweathermap.org/data/2.5/weather?q=${args.city}&appid=${process.env.WEATHER_API_KEY}`
          )
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
