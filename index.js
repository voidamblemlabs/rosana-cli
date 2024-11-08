#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];

if (!command) {
    console.error("\x1b[31m%s\x1b[0m", "Error: Please specify a command (create | update)");
    process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);
const templatePath = path.join(__dirname, "app");

const createProject = () => {
    if (!projectName) {
        console.error("\x1b[31m%s\x1b[0m", "Error: Please specify the project name");
        console.log("\x1b[36m%s\x1b[0m", "Usage: cli-tool create <project-name>");
        process.exit(1);
    }

    if (fs.existsSync(projectPath)) {
        console.error("\x1b[31m%s\x1b[0m", `Error: Directory ${projectName} already exists`);
        process.exit(1);
    }

    // Function to recursively copy a directory
    function copyDirectory(src, dest) {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        fs.mkdirSync(dest, { recursive: true });

        for (let entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            entry.isDirectory()
                ? copyDirectory(srcPath, destPath)
                : fs.copyFileSync(srcPath, destPath);
        }
    }

    try {
        console.log(
            "\x1b[33m%s\x1b[0m",
            "🌼 Initializing project... Here's a yellow flower for you!"
        );
        copyDirectory(templatePath, projectPath);
        console.log(
            "\x1b[32m%s\x1b[0m",
            `Project ${projectName} has been created at ${projectPath}`
        );
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "Error copying files:", error);
        process.exit(1);
    }

    process.chdir(projectPath);

    // Initialize package.json if it doesn't exist
    if (!fs.existsSync("package.json")) {
        try {
            console.log("\x1b[34m%s\x1b[0m", "Initializing a new package.json...");
            execSync("npm init -y", { stdio: "inherit" });
        } catch (error) {
            console.error("\x1b[31m%s\x1b[0m", "Error initializing package.json:", error);
            process.exit(1);
        }
    }

    // Modify package.json to add build and dev scripts
    try {
        const packageJsonPath = path.join(projectPath, "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        packageJson.scripts = { ...packageJson.scripts, build: "vite build", dev: "vite" };
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log("\x1b[32m%s\x1b[0m", "Updated package.json with build and dev scripts.");
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "Error updating package.json:", error);
        process.exit(1);
    }

    // Check if 'rosana' is installed
    if (!isRosanaInstalled()) {
        try {
            console.log("\x1b[34m%s\x1b[0m", "Installing 'rosana' package...");
            execSync("npm install rosana", { stdio: "inherit" });
            console.log("\x1b[32m%s\x1b[0m", "Installed 'rosana' package.");
        } catch (error) {
            console.error("\x1b[31m%s\x1b[0m", "Failed to install dependencies:", error);
            process.exit(1);
        }
    } else {
        console.log("\x1b[32m%s\x1b[0m", "'rosana' package is already installed.");
    }

    console.log("\x1b[32m%s\x1b[0m", "Project setup complete! Ready to start developing!");
};

const updateProject = () => {
    if (!fs.existsSync(projectPath)) {
        console.error("\x1b[31m%s\x1b[0m", `Error: Directory ${projectName} does not exist`);
        process.exit(1);
    }

    console.log("\x1b[33m%s\x1b[0m", "🌼 Updating project...");

    // Install the latest version of 'rosana'
    try {
        execSync("npm install rosana@latest", { stdio: "inherit" });
        console.log("\x1b[32m%s\x1b[0m", "'rosana' package updated to the latest version.");
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "Failed to update dependencies:", error);
        process.exit(1);
    }

    console.log("\x1b[32m%s\x1b[0m", "Project updated successfully!");
};

// Check if 'rosana' is installed
function isRosanaInstalled() {
    try {
        const installedVersion = JSON.parse(
            execSync("npm list rosana --depth=0", { encoding: "utf-8" })
        ).dependencies.rosana.version;
        const latestVersion = execSync("npm show rosana version", { encoding: "utf-8" }).trim();
        return installedVersion === latestVersion;
    } catch (error) {
        return false;
    }
}

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
            "\x1b[31m%s\x1b[0m",
            "Unknown command. Usage: cli-tool create <project-name> | update <project-name>"
        );
        process.exit(1);
}
