const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

//middlewear
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;