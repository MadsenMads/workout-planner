// script.js

// Define the exercises object
const exercises = {
    "legs": ["Squats", "Deadlifts", "Dumbbell Lunges", "Running"],
    "core": ["Planks", "Crunches", "Leg Raises", "Russian Twists"],
    "shoulder": ["Overhead Press", "Shoulder Press", "Lateral Raises", "Front Raises"],
    "biceps": ["Bicep Curls", "Hammer Curls", "Chin-Ups"],
    "triceps": ["Tricep Dips", "Tricep Kickbacks", "Skull Crushers"],
    "compound": ["Bench Press", "Rows", "Pull-Ups"]
};

// Function to update exercise list based on selected muscle group
function updateExerciseList() {
    const muscleGroupSelect = document.getElementById("muscle-group-select");
    const exerciseSelect = document.getElementById("exercise-select");

    const selectedMuscleGroup = muscleGroupSelect.value;
    const muscleGroupExercises = exercises[selectedMuscleGroup];

    exerciseSelect.innerHTML = "";

    if (muscleGroupExercises) {
        muscleGroupExercises.forEach(exercise => {
            const option = document.createElement("option");
            option.value = exercise;
            option.textContent = exercise;
            exerciseSelect.appendChild(option);
        });
    }
}

function planWorkout() {
    const muscleGroupSelect = document.getElementById("muscle-group-select");
    const exerciseSelect = document.getElementById("exercise-select");
    let workoutTable = document.getElementById("workout-table");

    const selectedEquipment = muscleGroupSelect.value;
    const selectedExercise = exerciseSelect.value;

    // If the table doesn't exist, create it
    if (!workoutTable) {
        createWorkoutTable();
        workoutTable = document.getElementById("workout-table"); // Update reference
    }

    // Add a row for the selected exercise
    const row = workoutTable.insertRow(-1);
    const cellExercise = row.insertCell(0);
    const cellKg = row.insertCell(1);
    const cellReps = row.insertCell(2);

    // Add columns for each set
    for (let i = 1; i <= 5; i++) {
        const cell = row.insertCell(-1);
        cell.textContent = ""; // Initialize each set as blank
    }

    cellExercise.textContent = selectedExercise;
    cellKg.textContent = ""; // Leave the kg column blank
    cellReps.textContent = ""; // Leave the reps column blank
}

function createWorkoutTable() {
    const workoutSection = document.getElementById("workout-section");
    const table = document.createElement("table");
    table.id = "workout-table";

    // Create header row
    const headerRow = table.insertRow(0);
    headerRow.insertCell(0).textContent = "Exercise";
    headerRow.insertCell(1).textContent = "Kg"; // Header for kg column
    headerRow.insertCell(2).textContent = "Reps"; // Header for reps column

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
    
    // Get the current date
    const currentDate = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options).replace(/\//g, '-');


    let htmlContent = "<!DOCTYPE html>\n<html>\n<head>\n<title>Workout Plan</title>\n";
    htmlContent += "<style>\n";
    // Add your CSS styles here
    htmlContent += "body { font-family: Arial, sans-serif; }\n";
    htmlContent += "table { border-collapse: collapse; width: 100%; }\n";
    htmlContent += "th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }\n";
    htmlContent += "</style>\n";
    htmlContent += "</head>\n<body>\n";

    // Add a header
    htmlContent += "<h2 style='text-align: center;'>Workout: " + formattedDate + "</h2>\n";

    // Generate the workout table
    htmlContent += "<table>\n";

    for (let j = 0; j < workoutTable.rows.length; j++) {
        htmlContent += "<tr>\n";

        for (let i = 0; i < workoutTable.rows[j].cells.length; i++) {
            const cellContent = workoutTable.rows[j].cells[i].textContent || "";
            const tag = (j === 0) ? "th" : "td"; // Use th for header row
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

document.getElementById("muscle-group-select").addEventListener("change", updateExerciseList);

updateExerciseList();
