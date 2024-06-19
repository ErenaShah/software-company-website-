const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 5000;

const app = express();
const MONGO_URL = "mongodb+srv://reviews:reviews@reviews.tlp5orw.mongodb.net/?retryWrites=true&w=majority&appName=reviews";

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => {
  console.error("mongodb connection error", err);
});
db.once('open', () => {
  console.log("mongodb connection established");
});

const reviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

app.post('/reviews', async (req, res) => {
  try {
    const newReview = new Review({
      customerName: req.body.customerName,
      rating: req.body.rating,
      feedback: req.body.feedback,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
