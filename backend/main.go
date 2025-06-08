package main

import (
	"log"
	"strconv"
	"sync"

	"github.com/gofiber/fiber/v2"
)

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

var (
	tasks     []Task
	taskMutex sync.Mutex
	lastID    = 0
)

func main() {
	app := fiber.New()

	// Инициализация тестовой задачи
	taskMutex.Lock()
	tasks = append(tasks, Task{
		ID:          1,
		Title:       "Test Task",
		Description: "Just testing!",
	})
	lastID = 1
	taskMutex.Unlock()

	app.Static("/", "./client")

	// Маршруты для работы с задачами
	app.Get("/api/task", getTasks)          // Получить все задачи
	app.Get("/api/task/:id", getTask)       // Получить одну задачу
	app.Post("/api/task", createTask)       // Создать задачу
	app.Put("/api/task/:id", updateTask)    // Обновить задачу
	app.Delete("/api/task/:id", deleteTask) // Удалить задачу

	if err := app.Listen(":7080"); err != nil {
		log.Fatalln(err)
	}
}

// Получить все задачи
func getTasks(c *fiber.Ctx) error {
	taskMutex.Lock()
	defer taskMutex.Unlock()
	return c.JSON(tasks)
}

// Получить одну задачу по ID
func getTask(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	taskMutex.Lock()
	defer taskMutex.Unlock()

	for _, task := range tasks {
		if task.ID == id {
			return c.JSON(task)
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "Task not found",
	})
}

// Создать новую задачу
func createTask(c *fiber.Ctx) error {
	var request struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request data",
		})
	}

	if request.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Title is required",
		})
	}

	taskMutex.Lock()
	defer taskMutex.Unlock()

	lastID++
	newTask := Task{
		ID:          lastID,
		Title:       request.Title,
		Description: request.Description,
	}

	tasks = append(tasks, newTask)

	return c.Status(fiber.StatusCreated).JSON(newTask)
}

// Обновить существующую задачу
func updateTask(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	var request struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request data",
		})
	}

	if request.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Title is required",
		})
	}

	taskMutex.Lock()
	defer taskMutex.Unlock()

	for i, task := range tasks {
		if task.ID == id {
			tasks[i].Title = request.Title
			tasks[i].Description = request.Description
			return c.JSON(tasks[i])
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "Task not found",
	})
}

// Удалить задачу
func deleteTask(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	taskMutex.Lock()
	defer taskMutex.Unlock()

	for i, task := range tasks {
		if task.ID == id {
			// Удаляем задачу из слайса
			tasks = append(tasks[:i], tasks[i+1:]...)
			return c.SendStatus(fiber.StatusNoContent)
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "Task not found",
	})
}
