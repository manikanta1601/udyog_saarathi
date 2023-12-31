
const exp = require("express");
const app = exp();
const cors=require("cors");
app.use(cors());

app.use(cors({ origin: true }));
app.use(exp.json());
app.listen(5000, () => {
  console.log("server is listening in port 5000");
});
// connecting backend and frontend by server
const path = require("path");
app.use(exp.static(path.join(__dirname,"../client/build")));

require("dotenv/config");


const mclient = require("mongodb").MongoClient;


// connect to mongodb server
mclient
  .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`, { useNewUrlParser: true
  })
  .then((dbRef) => {

    // access user database
    let usersdbObj = dbRef.db("usersdb");
    let userCollection = usersdbObj.collection("usercollection");
    let jobCollection = usersdbObj.collection("jobcollection");
    let courseCollection = usersdbObj.collection("coursecollection");
    let sampleCollection = usersdbObj.collection("samplecollection");


    console.log("connected to DB successfully");

    // share collections objects to APIs
    app.set("userCollection", userCollection);
    app.set("jobCollection", jobCollection);
    app.set("courseCollection", courseCollection);
    app.set("sampleCollection", sampleCollection);
    
    
  })
  .catch((err) => console.log("database connection err is", err));

const userapp = require("./APIs/userApi");
const jobapp = require("./APIs/jobApi");
const courseapp = require("./APIs/courseApi");


app.use("/user-api", userapp);
app.use("/job-api", jobapp);
app.use("/course-api", courseapp);


// create a middleware to handle invalid path
const invalidPathHandlingMiddleware = (request, response, next) => {
  response.send({ message: "Invalid path" });
};
app.use(invalidPathHandlingMiddleware);

// create err handling middleware
const errHandler = (error, request, response, next) => {
  response.send({ "error-message": error.message });
};
app.use(errHandler);

