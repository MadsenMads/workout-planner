// script.js

// Updated exercises object
const exercises = {
    "legs": ["Squats", "Lunges", "Leg Curls", "Leg Extensions", "Calf Raises", "Hip Thrust", "Deadlifts",  "Running"],
    "core": ["Plank", "Crunches", "Leg Raises", "Bicycle Crunch", "Mountain Climbers", "Side Bend", "Burpees", "Side Bend on floor", "Starfish Crunches", "Russian Twists"],
    "shoulder": ["Overhead Press", "Shoulder Press", "Arnold Press", "Reverse Flyes", "Upright Row", "Shoulder Shrug", "Front Raise with Rotation", "External Rotation", "Side Raises", "Front Raises"],
    "biceps": ["Dumbbell Curl", "Incline Curl", "Barbell Curl", "Crossbody Curl", "Preacher Curl", "Push-ups", "Inverted Row", "Row", "Bendover Row", "Hammer Curls", "Chin-Ups"],
    "triceps": ["Tricep Dips", "Tricep Kickbacks", "Skull Crushers"],
    "compound": ["Bench Press", "Rows", "Pull-Ups"]
};

document.addEventListener("DOMContentLoaded", function () {
    createWorkoutTable();
    createCategoryButtons();
    document.getElementById("equipment-select").addEventListener("change", updateExerciseButtons);
    updateExerciseButtons();
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
    const cellExercise = row.insertCell(0);

    for (let i = 1; i <= 5; i++) {
        const cell = row.insertCell(-1);
        cell.textContent = ""; // Initialize each set as blank
    }

    cellExercise.textContent = exercise;
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

function exportToHTML() {
    console.log("Exporting to HTML...");

    const workoutTable = document.getElementById("workout-table");

    if (!workoutTable) {
        alert("No workout plan to export.");
        return;
    }

    const currentDate = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options).replace(/\//g, '-');

    let htmlContent = "<!DOCTYPE html>\n<html>\n<head>\n<title>Workout Plan</title>\n";
    htmlContent += "<style>\n";
    htmlContent += "body { font-family: Arial, sans-serif; }\n";
    htmlContent += "table { border-collapse: collapse; width: 100%; }\n";
    htmlContent += "th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }\n";
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
