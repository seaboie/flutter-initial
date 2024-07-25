#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import Conf from "conf";
import process from "process";

const fullPath = process.cwd();
const splitFullPaths = fullPath.split("/");
const projectName = splitFullPaths[splitFullPaths.length - 1];
// console.log(projectName);

const config = new Conf({
  projectName: `${projectName}`,
});

program
  .version("1.0.0")
  .description("A CLI tool for managing tasks")
  .option("-l, --list", "List all tasks")
  .option("-a, --add", "Add a new task")
  .option("-c, --complete", "Mark a task as complete")
  .option("-e, --edit", "Edit a task")
  .option("-d, --delete", "Delete a task")
  .parse(process.argv);

const options = program.opts();

// Load tasks from storage or use default if not available
let tasks = config.get("tasks") || [
  { id: 1, text: "Buy groceries", completed: false },
  { id: 2, text: "Write report", completed: false },
  { id: 3, text: "Call mom", completed: false },
];

function saveTasks() {
  config.set("tasks", tasks);
}

async function listTasks() {
  const spinner = ora("Loading tasks").start();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  spinner.succeed("Tasks loaded");

  console.log(chalk.blue.bold("\nYour tasks:"));
  tasks.forEach((task) => {
    const status = task.completed ? chalk.green("✓") : chalk.red("✗");
    console.log(`${status} ${task.id}. ${task.text}`);
  });
}

// Add Task
async function addTask() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "newTask",
      message: "What is the new task?",
      validate: (input) => (input.length > 0 ? true : "Task cannot be empty"),
    },
  ]);

  const spinner = ora("Adding task").start();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  tasks.push({ id: newId, text: answers.newTask, completed: false });
  saveTasks();

  spinner.succeed("Task added successfully");
  await listTasks();
}
// Complete
async function completeTask() {
  const choices = tasks.map((t) => ({
    name: `${t.completed ? chalk.green("✓") : chalk.red("✗")} ${t.text}`,
    value: t.id,
  }));
  choices.push({ name: chalk.gray("None"), value: "none" }); // Add "None" option

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "taskId",
      message: "Which task do you want to mark (complete/incomplete)/skip?",
      choices: choices,
    },
  ]);

  if (answer.taskId === "none") {
    console.log(chalk.gray("No selection made."));
    return;
  }

  const spinner = ora("Updating task").start();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const task = tasks.find((t) => t.id === answer.taskId);
  task.completed = !task.completed; // Toggle completion status
  saveTasks();

  spinner.succeed("Task completion status updated");
  await listTasks();
}

// Delete
async function deleteTask() {
  const choices = tasks.map((t) => ({ name: t.text, value: t.id }));

  if (choices.length === 0) {
    console.log(chalk.yellow("No tasks to delete."));
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "taskId",
      message: "Which task do you want to delete?",
      choices: choices,
    },
  ]);

  const spinner = ora("Deleting task").start();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  tasks = tasks.filter((t) => t.id !== answer.taskId);
  saveTasks();

  spinner.succeed("Task deleted successfully");
  await listTasks();
}

// Edit
async function editTask() {
  const choices = tasks.map((t) => ({ name: t.text, value: t.id }));

  if (choices.length === 0) {
    console.log(chalk.yellow("No tasks to edit."));
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "taskId",
      message: "Which task do you want to edit?",
      choices: choices,
    },
  ]);

  const taskToEdit = tasks.find((t) => t.id === answer.taskId);

  const editOptions = [
    {
      type: "input",
      name: "newText",
      message: "Enter new task text (leave empty to keep current):",
      default: taskToEdit.text,
    },
    {
      type: "confirm",
      name: "toggleComplete",
      message: "Toggle task completion?",
      default: false,
    },
  ];

  const answers = await inquirer.prompt(editOptions);

  if (answers.newText) {
    taskToEdit.text = answers.newText;
  }
  if (answers.toggleComplete) {
    taskToEdit.completed = !taskToEdit.completed;
  }

  saveTasks();

  console.log(chalk.green("Task updated successfully!"));
  await listTasks();
}

async function main() {
  if (options.list) {
    await listTasks();
  } else if (options.add) {
    await addTask();
  } else if (options.complete) {
    await completeTask();
  } else if (options.edit) {
    await editTask();
  } else if (options.delete) {
    await deleteTask();
  } else {
    console.log(
      chalk.yellow("Please specify an option. Use --help for more information.")
    );
  }
}

main().catch((error) => {
  console.error(chalk.red("An error occurred:"), error);
});
