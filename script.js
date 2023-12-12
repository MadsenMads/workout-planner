// script.js

// Define the exercises object
const exercises = {
    "power-rack": ["Squats", "Deadlifts", "Overhead Press", "Pull-Ups"],
    "bench": ["Bench Press", "Dumbbell Flyes", "Tricep Dips"],
    "barbell": ["Deadlifts", "Bench Press", "Rows", "Curls"],
    "dumbbell": ["Dumbbell Lunges", "Shoulder Press", "Bicep Curls", "Tricep Kickbacks"],
    "treadmill": ["Running", "Walking Incline", "Sprints"]
};

function updateExerciseList() {
    const equipmentSelect = document.getElementById("equipment-select");
    const exerciseSelect = document.getElementById("exercise-select");

    const selectedEquipment = equipmentSelect.value;
    const equipmentExercises = exercises[selectedEquipment];

    exerciseSelect.innerHTML = "";

    if (equipmentExercises) {
        equipmentExercises.forEach(exercise => {
            const option = document.createElement("option");
            option.value = exercise;
            option.textContent = exercise;
            exerciseSelect.appendChild(option);
        });
    }
}

function planWorkout() {
    const equipmentSelect = document.getElementById("equipment-select");
    const exerciseSelect = document.getElementById("exercise-select");
    let workoutTable = document.getElementById("workout-table");

    const selectedEquipment = equipmentSelect.value;
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
function exportToTxt() {
    console.log("Exporting to TXT...");

    const workoutTable = document.getElementById("workout-table");

    if (!workoutTable) {
        alert("No workout plan to export.");
        return;
    }

    let txtContent = "Workout Plan:\n\n";

    // Get the maximum lengths for exercise, kg, and reps
    const maxLengths = { exercise: 0, kg: 0, reps: 0 };
    for (let j = 1; j < workoutTable.rows.length; j++) {
        const exercise = workoutTable.rows[j].cells[0].textContent;
        const kg = workoutTable.rows[j].cells[1].textContent;
        const reps = workoutTable.rows[j].cells[2].textContent;

        maxLengths.exercise = Math.max(maxLengths.exercise, exercise.length);
        maxLengths.kg = Math.max(maxLengths.kg, kg.length);
        maxLengths.reps = Math.max(maxLengths.reps, reps.length);
    }

    // Adjust maximum lengths based on A4 page size with 20mm margins
    const maxA4Width = 210 - 2 * 20; // A4 width minus 2 margins
    maxLengths.exercise = Math.min(maxLengths.exercise, maxA4Width / 3); // Divide by 3 for the first 3 columns
    maxLengths.kg = Math.min(maxLengths.kg, maxA4Width / 3);
    maxLengths.reps = Math.min(maxLengths.reps, maxA4Width / 3);

    // Format header
    txtContent += `| ${padString("Exercise", maxLengths.exercise)} | ${padString("Kg", maxLengths.kg)} | ${padString("Reps", maxLengths.reps)} | Days |\n`;

    for (let j = 1; j < workoutTable.rows.length; j++) {
        const exercise = workoutTable.rows[j].cells[0].textContent;
        const kg = workoutTable.rows[j].cells[1].textContent;
        const reps = workoutTable.rows[j].cells[2].textContent;

        // Format each row
        let rowContent = `| ${padString(exercise, maxLengths.exercise)} | ${padString(kg, maxLengths.kg)} | ${padString(reps, maxLengths.reps)} |`;

        for (let i = 3; i < workoutTable.rows[j].cells.length; i++) {
            const dayContent = workoutTable.rows[j].cells[i].textContent || " "; // Use a space if the cell is blank
            rowContent += ` ${dayContent} |`;
        }

        txtContent += `${rowContent}\n`;
    }

    downloadTxtFile(txtContent);
}

// Add this function to pad the string with spaces
function padString(str, length) {
    const padding = Math.max(0, length - str.length);
    return `${str}${" ".repeat(padding)}`;
}

function downloadTxtFile(content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "workout_plan.txt";
    a.click();
}

document.getElementById("equipment-select").addEventListener("change", updateExerciseList);

updateExerciseList();
