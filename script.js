// script.js

// Updated exercises object
const exercises = {
    "Legs": ["Squats", "Lunges", "Leg Curls", "Leg Extensions", "Calf Raises", "Hip Thrust", "Deadlifts"],
    "Core": ["Plank", "Crunches", "Leg Raises", "Bicycle Crunch", "Mountain Climbers", "Side Bend", "Burpees", "Side Bend on floor", "Starfish Crunches", "Russian Twists"],
    "Shoulder": ["Overhead Press", "Shoulder Press", "Arnold Press", "Reverse Flyes", "Upright Row", "Shoulder Shrug", "Front Raise with Rotation", "External Rotation", "Side Raises", "Front Raises"],
    "Biceps": ["Dumbbell Curl", "Incline Curl", "Barbell Curl", "Crossbody Curl", "Preacher Curl", "Push-ups", "Inverted Row", "Row", "Bendover Row", "Hammer Curls", "Chin-Ups"],
    "Triceps": ["Narrow Benchpress", "Dumbbell Pullover", "Diamond Pushups", "Dips", "Tricep Kickbacks", "Skull Crushers"],
    "Chest": ["Benchpress", "Incline Benchpress", "Dumbbell Benchpress", "Flyes"],
    "Back/Lats": ["Rows", "Wide Pull-ups", "Reverse Flyes"],
    "Compound": ["Deadlift", "Rows", "Pull-Ups", "Squats"],
    "Cardio": ["Running", "Jump Rope", "Mountaint Climbers", "Jumping Jacks", "Burpees"]
};

document.addEventListener("DOMContentLoaded", function () {
    createWorkoutTable();
    createCategoryButtons();
    document.getElementById("equipment-select").addEventListener("change", updateExerciseButtons);
    updateExerciseButtons();
    generateTableFromUrl();
});

function createCategoryButtons() {
    const categoryButtons = document.getElementById("category-buttons");

    Object.keys(exercises).forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.addEventListener("click", function () {
            updateExerciseButtons(category);
        });
        categoryButtons.appendChild(button);
    });
}

function updateExerciseButtons(category) {
    const exerciseButtons = document.getElementById("exercise-buttons");
    exerciseButtons.innerHTML = "";

    exercises[category].forEach(exercise => {
        const button = document.createElement("button");
        button.textContent = exercise;
        button.addEventListener("click", function () {
            addExerciseToPlan(exercise);
        });
        exerciseButtons.appendChild(button);
    });
}

function addExerciseToPlan(exercise) {
    const workoutTable = document.getElementById("workout-table");

    if (!workoutTable) {
        alert("Workout table not found.");
        return;
    }

    const row = workoutTable.insertRow(-1);

    for (let i = 0; i < 6; i++) { // Assuming 6 columns in the table (adjust if needed)
        const cell = row.insertCell(-1);
        cell.textContent = ""; // Initialize each cell as blank

        // Make all cells editable
        cell.contentEditable = true;
    }

    // Set exercise name in the first cell
    row.cells[0].textContent = exercise;

    // Update URL with new plan
    updateURLWithPlan();
}

function createWorkoutTable() {
    const workoutSection = document.getElementById("workout-section");
    const table = document.createElement("table");
    table.id = "workout-table";

    const headerRow = table.insertRow(0);
    headerRow.insertCell(0).textContent = "Exercise";

    for (let i = 1; i <= 5; i++) {
        const headerCell = headerRow.insertCell(i);
        headerCell.textContent = `set ${i}`;
    }

    workoutSection.appendChild(table);
}

// Function to update URL with workout plan using shorthand notation
function updateURLWithPlan() {
    const workoutTable = document.getElementById("workout-table");
    if (!workoutTable) return;

    let shorthandPlan = [];
    for (let i = 1; i < workoutTable.rows.length; i++) {
        const exerciseName = workoutTable.rows[i].cells[0].textContent;
        const categoryIndex = getCategoryIndex(exerciseName);
        const exerciseIndex = exercises[Object.keys(exercises)[categoryIndex]].indexOf(exerciseName);
        shorthandPlan.push(`${categoryIndex}-${exerciseIndex}`);
    }

    history.pushState({}, '', '?plan=' + shorthandPlan.join(","));
}

// Function to get category index from exercise name
function getCategoryIndex(exerciseName) {
    return Object.keys(exercises).findIndex(category => exercises[category].includes(exerciseName));
}

// Function to generate table from URL parameters with debugging
function generateTableFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get("plan");
    console.log("Plan from URL:", planParam); // Debugging: Log the plan parameter

    if (!planParam) return;

    const workoutTable = document.getElementById("workout-table");
    if (!workoutTable) {
        console.log("Workout table not found."); // Debugging: Check if table is found
        return;
    }

    // Simplified handling: Process only the first pair for debugging
    const firstPair = planParam.split(",")[0];
    const [categoryIndex, exerciseIndex] = firstPair.split("-").map(Number);
    const categoryName = Object.keys(exercises)[categoryIndex];
    const exerciseName = exercises[categoryName][exerciseIndex];

    console.log("Adding exercise from URL:", categoryName, exerciseName); // Debugging: Log the exercise being added

    addExerciseToPlan(exerciseName);
}


function exportToHTML() {
    console.log("Exporting to HTML...");

    const workoutTable = document.getElementById("workout-table");

    if (!workoutTable) {
        alert("No workout plan to export.");
        return;
    }

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-GB', options).replace(/\//g, '-');

    let htmlContent = "<!DOCTYPE html>\n<html>\n<head>\n<title>Workout Plan</title>\n";
    htmlContent += "<style>\n";
    htmlContent += "body { font-family: Arial, sans-serif; }\n";
    htmlContent += "table { border-collapse: collapse; width: 100%; }\n";
    htmlContent += "th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }\n";
    htmlContent += "tr > :first-child { border: 1px solid #ddd; padding: 8px; width: 1%; white-space: nowrap; }\n";
    htmlContent += "</style>\n";
    htmlContent += "</head>\n<body>\n";

    htmlContent += `<h2 style='text-align: center;'>Workout: ${formattedDate}</h2>\n`;

    htmlContent += "<table>\n";

    for (let j = 0; j < workoutTable.rows.length; j++) {
        htmlContent += "<tr>\n";

        for (let i = 0; i < workoutTable.rows[j].cells.length; i++) {
            const cellContent = workoutTable.rows[j].cells[i].textContent || "";
            const tag = (j === 0) ? "th" : "td";
            htmlContent += `<${tag}>${cellContent}</${tag}>\n`;
        }

        htmlContent += "</tr>\n";
    }

    htmlContent += "</table>\n</body>\n</html>";

    downloadHTMLFile(htmlContent);
}

function downloadHTMLFile(content) {
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "workout_plan.html";
    a.click();
}