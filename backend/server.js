/* =========================================================
   LION CONSULTANCY
   MAIN EXPRESS API SERVER
   ========================================================= */

"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

/* =========================================================
   DATABASE
   ========================================================= */

const { connectDB } = require("./config/db");

/* =========================================================
   ROUTES
   ========================================================= */

const employeeRoutes = require("./routes/employee.routes");
const applicationRoutes = require("./routes/application.routes");

const adminRoutes = require("./routes/admin.routes");
const adminApplicationRoutes = require("./routes/admin.application.routes");
const adminDashboardRoutes = require("./routes/admin.dashboard.routes");

const studentRoutes = require("./routes/student.routes");

const inquiryRoutes = require("./routes/inquiry.routes");
const adminInquiryRoutes = require("./routes/admin.inquiry.routes");

/* =========================================================
   APP INITIALIZATION
   ========================================================= */

const app = express();

/* =========================================================
   ENVIRONMENT
   ========================================================= */

const PORT = process.env.PORT || 5000;

const NODE_ENV =
    process.env.NODE_ENV || "development";

/*
 * Frontend URL
 *
 * Set this in Render Environment Variables:
 *
 * FRONTEND_URL=https://your-frontend-url.onrender.com
 *
 * For local development:
 *
 * FRONTEND_URL=http://localhost:5500
 */

const FRONTEND_URL =
    process.env.FRONTEND_URL || "http://localhost:5500";

/* =========================================================
   DATABASE CONNECTION
   ========================================================= */

connectDB();

/* =========================================================
   GLOBAL MIDDLEWARE
   ========================================================= */

/*
 * JSON request body
 */

app.use(
    express.json({
        limit: "2mb"
    })
);

/*
 * URL encoded request body
 */

app.use(
    express.urlencoded({
        extended: true,
        limit: "2mb"
    })
);

/*
 * Cookies
 */

app.use(cookieParser());

/* =========================================================
   CORS
   ========================================================= */

app.use(
    cors({
        origin: function (origin, callback) {

            /*
             * Allow requests with no origin.
             *
             * Useful for:
             * - Postman
             * - server-to-server requests
             * - local API testing
             */

            if (!origin) {
                return callback(null, true);
            }

            /*
             * Development / local frontend
             */

            const allowedOrigins = [
                FRONTEND_URL,
                "http://localhost:5500",
                "http://127.0.0.1:5500"
            ];

            /*
             * Avoid duplicate values
             */

            const uniqueOrigins = [
                ...new Set(
                    allowedOrigins.filter(Boolean)
                )
            ];

            if (
                uniqueOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            /*
             * During development, allow the request
             * rather than crashing the API.
             *
             * In production, FRONTEND_URL should be
             * configured with the real Render frontend URL.
             */

            if (
                NODE_ENV !== "production"
            ) {
                return callback(null, true);
            }

            return callback(
                new Error(
                    "CORS policy: Origin not allowed."
                )
            );
        },

        credentials: true
    })
);

/* =========================================================
   REQUEST LOGGING
   ========================================================= */

app.use(
    (req, res, next) => {

        console.log(
            `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`
        );

        next();
    }
);

/* =========================================================
   ROOT API RESPONSE
   ========================================================= */

/*
 * IMPORTANT:
 *
 * The backend does NOT serve the frontend.
 *
 * The frontend has its own Render Static Site.
 */

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            service:
                "Lion Consultancy API",

            status:
                "online",

            message:
                "Lion Consultancy backend API is running.",

            environment:
                NODE_ENV,

            health:
                "/api/health",

            timestamp:
                new Date().toISOString()
        });
    }
);

/* =========================================================
   API HEALTH CHECK
   ========================================================= */

app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            service:
                "Lion Consultancy API",

            status:
                "online",

            environment:
                NODE_ENV,

            timestamp:
                new Date().toISOString()
        });
    }
);

/* =========================================================
   EMPLOYEE API
   ========================================================= */

app.use(
    "/api/employees",
    employeeRoutes
);

/* =========================================================
   STUDENT APPLICATION API
   ========================================================= */

app.use(
    "/api/applications",
    applicationRoutes
);

/* =========================================================
   ADMIN API
   ========================================================= */

app.use(
    "/api/admin",
    adminRoutes
);

/* =========================================================
   ADMIN APPLICATION API
   ========================================================= */

app.use(
    "/api/admin/applications",
    adminApplicationRoutes
);

/* =========================================================
   INQUIRY API
   ========================================================= */

app.use(
    "/api/inquiries",
    inquiryRoutes
);

/* =========================================================
   ADMIN DASHBOARD API
   ========================================================= */

app.use(
    "/api/admin/dashboard",
    adminDashboardRoutes
);

/* =========================================================
   ADMIN STUDENTS API
   ========================================================= */

app.use(
    "/api/admin/students",
    studentRoutes
);

/* =========================================================
   ADMIN INQUIRIES API
   ========================================================= */

app.use(
    "/api/admin/inquiries",
    adminInquiryRoutes
);

/* =========================================================
   404 HANDLER
   ========================================================= */

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API route not found.",

            path:
                req.originalUrl
        });
    }
);

/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );

        if (res.headersSent) {
            return next(err);
        }

        res.status(
            err.status || 500
        ).json({

            success: false,

            message:
                NODE_ENV === "production"
                    ? "Internal server error."
                    : err.message
        });
    }
);

/* =========================================================
   START SERVER
   ========================================================= */

const server = app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "=========================================="
        );

        console.log(
            "       LION CONSULTANCY API SERVER"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `Environment : ${NODE_ENV}`
        );

        console.log(
            `Port        : ${PORT}`
        );

        console.log(
            `Health      : /api/health`
        );

        console.log(
            `Applications: /api/applications`
        );

        console.log(
            `Employees   : /api/employees`
        );

        console.log(
            `Inquiries   : /api/inquiries`
        );

        console.log(
            `Admin       : /api/admin`
        );

        console.log(
            "=========================================="
        );

        console.log("");
    }
);

/* =========================================================
   SERVER ERROR HANDLING
   ========================================================= */

server.on(
    "error",
    (error) => {

        if (
            error.code === "EADDRINUSE"
        ) {

            console.error(
                `Port ${PORT} is already in use.`
            );

            process.exit(1);
        }

        console.error(
            "Server startup error:",
            error
        );

        process.exit(1);
    }
);

/* =========================================================
   GRACEFUL SHUTDOWN
   ========================================================= */

process.on(
    "SIGINT",
    () => {

        console.log(
            "\nShutting down Lion Consultancy server..."
        );

        server.close(
            () => {

                console.log(
                    "Server stopped."
                );

                process.exit(0);
            }
        );
    }
);

process.on(
    "SIGTERM",
    () => {

        console.log(
            "\nSIGTERM received. Shutting down..."
        );

        server.close(
            () => {

                console.log(
                    "Server stopped."
                );

                process.exit(0);
            }
        );
    }
);
