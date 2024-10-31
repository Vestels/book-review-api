require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Rokszin Roland Book-APIs",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Book: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Book ID',
              example: '60aebbade17c5e3420b6f1b1'
            },
            title: {
              type: 'string',
              description: 'Title of the book',
              example: 'The Great Gatsby'
            },
            author: {
              type: 'string',
              description: 'Author of the book',
              example: 'F. Scott Fitzgerald'
            },
            description: {
              type: 'string',
              description: 'Description of the book',
              example: 'A novel set in the Jazz Age.'
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: "The unique ID for the review",
              example: "615c3a8e8c9a1b0004f5c123"
            },
            book: {
              type: 'string',
              description: "The unique ID of the book that the review belongs to",
              example: "615c3a8e8c9a1b0004f5c456"
            },
            user: {
              type: 'string',
              description: "The unique ID of the user who wrote the review",
              example: "615c3a8e8c9a1b0004f5c789"
            },
            rating: {
              type: 'integer',
              description: "The rating given by the user",
              minimum: 1,
              maximum: 5,
              example: 4
            },
            text: {
              type: 'string',
              description: "The review text content",
              example: "This book was engaging and informative!"
            },
            createdAt: {
              type: 'string',
              format: "date-time",
              description: "The date and time when the review was created",
              example: "2023-10-31T14:48:00.000Z"
            },
            updatedAt: {
              type: 'string',
              format: "date-time",
              description: "The date and time when the review was last updated",
              example: "2023-11-01T09:12:00.000Z"
            }
          },
          required: [
            "book",
            "user",
            "rating",
            "text"
          ]
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const reviewRoutes = require("./routes/review");

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MongoDB kapcsolódás
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// API útvonalak
app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/books", reviewRoutes);

// Szerver indítása
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});