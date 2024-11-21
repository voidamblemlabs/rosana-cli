#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];

const projectPath = path.join(process.cwd(), projectName);
const templatePath = path.join(__dirname, "app");

// Colors for console output
const color = {
    red: "\x1b[31m%s\x1b[0m",
    green: "\x1b[32m%s\x1b[0m",
    blue: "\x1b[34m%s\x1b[0m",
    yellow: "\x1b[33m%s\x1b[0m",
    cyan: "\x1b[36m%s\x1b[0m",
    gold: "\x1b[38;5;220m%s\x1b[0m", // Gold color for Rosana.js
};

// Check if `rosana` is installed globally
function isRosanaGloballyInstalled() {
    try {
        execSync("npm list -g rosana", { stdio: "ignore" });
        return true;
    } catch (error) {
        return false;
    }
}

// Initialize package.json if it doesn't exist
function initPackageJson() {
    if (!fs.existsSync("package.json")) {
        console.log(color.blue, "Initializing a new package.json...");
        execSync("npm init -y", { stdio: "inherit" });
    }
}

// Modify package.json to add build and dev scripts
function updatePackageJson() {
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    packageJson.scripts = {
        ...packageJson.scripts,
        build: "vite build",
        dev: "vite",
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(color.green, "Updated package.json with build and dev scripts.");
}

// Install `rosana` if not installed globally
function installRosana() {
    if (!isRosanaGloballyInstalled()) {
        try {
            console.log(color.blue, "Installing 'rosana' globally...");
            execSync("npm install -g rosana", { stdio: "inherit" });
            console.log(color.green, "Installed 'rosana' globally.");
        } catch (error) {
            console.error(color.red, "Failed to install rosana globally:", error);
            process.exit(1);
        }
    } else {
        console.log(color.green, "'rosana' package is already globally installed.");
    }
}

// Function to recursively copy a directory
function copyDirectory(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    fs.mkdirSync(dest, { recursive: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        entry.isDirectory() ? copyDirectory(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
    }
}

// Prompt the user whether to set up TypeScript
function askTypeScriptSetup() {
    const readlineSync = require("readline-sync");
    const answer = readlineSync
        .question("Do you want to set up your project with TypeScript? (y/n): ")
        .toLowerCase();
    return answer === "y" || answer === "yes";
}

// Create a project
const createProject = () => {
    if (!projectName) {
        console.error(color.red, "Error: Please specify the project name");
        console.log(color.cyan, "Usage: cli-tool create <project-name>");
        process.exit(1);
    }

    if (fs.existsSync(projectPath)) {
        console.error(color.red, `Error: Directory ${projectName} already exists`);
        process.exit(1);
    }

    try {
        console.log(color.yellow, "🌼 Initializing project... Here's a yellow flower for you!");
        copyDirectory(templatePath, projectPath);
        console.log(color.green, `Project ${projectName} has been created at ${projectPath}`);
    } catch (error) {
        console.error(color.red, "Error copying files:", error);
        process.exit(1);
    }

    process.chdir(projectPath);

    initPackageJson();
    updatePackageJson();

    // Prompt for TypeScript setup
    if (askTypeScriptSetup()) {
        try {
            console.log(color.blue, "Setting up TypeScript...");
            execSync("npm install --save-dev typescript", { stdio: "inherit" });
            console.log(color.green, "TypeScript has been set up.");
        } catch (error) {
            console.error(color.red, "Failed to set up TypeScript:", error);
            process.exit(1);
        }
    }

    installRosana();

    console.log(color.green, "Project setup complete! Ready to start developing!");

    // Print Rosana.js in gold
    console.log(color.gold, "rosana.js");
};

// Update an existing project
const updateProject = () => {
    if (!fs.existsSync(projectPath)) {
        console.error(color.red, `Error: Directory ${projectName} does not exist`);
        process.exit(1);
    }

    console.log(color.yellow, "🌼 Updating project...");

    try {
        execSync("npm install rosana@latest", { stdio: "inherit" });
        console.log(color.green, "'rosana' package updated to the latest version.");
    } catch (error) {
        console.error(color.red, "Failed to update dependencies:", error);
        process.exit(1);
    }

    console.log(color.green, "Project updated successfully!");
};

// Execute command based on user input
switch (command) {
    case "create":
        createProject();
        break;
    case "update":
        updateProject();
        break;
    default:
        console.error(
            color.red,
            "Unknown command. Usage: cli-tool create <project-name> | update <project-name>"
        );
        process.exit(1);
}
