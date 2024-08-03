const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const NewUser = require("./models/NewUser");
const Todo = require("./models/Todo");

const { authenticateToken } = require("./middleware/authMiddleware"); 


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Signup route
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await NewUser.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email already exists. Please try logging in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new NewUser({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "You can log in now" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await NewUser.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "User not registered. Please sign up." });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//applying middleware for authentication
app.use("/api/todos", authenticateToken); 

//fetch todos based on userid 
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.email });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/todos", async (req, res) => {
  const { text } = req.body;
  try {
    const newTodo = new Todo({
      text,
      userId: req.user.email,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server started and running on localhost:${PORT}`);
});
