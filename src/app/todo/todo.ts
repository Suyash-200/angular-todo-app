import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { environment } from '../../../environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  imports: [NgClass,FormsModule],
  standalone: true,
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  newTaskTitle = '';
  newTaskStatus = 'Not Completed';
  taskLists = signal<any[]>([]);
  isEditMode = false;
  editingTaskId: number | null = null;
  http = inject(HttpClient);

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.http.get<any[]>(`${environment.apiUrl}/taskLists`).subscribe({
      next: (data) => this.taskLists.set(data),
      error: (err) => console.error('Failed to fetch tasks:', err)
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) {
      return; // Don't add empty tasks
    }

    const newTask = {
      task: this.newTaskTitle,
      complete: this.newTaskStatus
    };
    this.http.post(`${environment.apiUrl}/taskLists`, newTask).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.newTaskStatus = 'Not Completed';
        this.getTasks(); // Refresh the task list after adding a new task
      },
      error: (err) => console.error('Failed to add task:', err)
    });
  }

  toggleComplete(item: any) {
    const updatedStatus = item.complete === 'Completed' ? 'Not Completed' : 'Completed';
    this.http.patch(`${environment.apiUrl}/taskLists/${item.id}`, { complete: updatedStatus }).subscribe({
      next: () => this.getTasks(), // Refresh the task list after updating
      error: (err) => console.error('Failed to update task status:', err)
    });
  }

  editTask(item: any) {
  this.isEditMode = true;
  this.editingTaskId = item.id;

  this.newTaskTitle = item.task;
  this.newTaskStatus = item.complete;
}

  updateTask(){
  if (!this.editingTaskId) return;

  const updatedTask = {
      task: this.newTaskTitle,
      complete: this.newTaskStatus
  };
    this.http.put(`${environment.apiUrl}/taskLists/${this.editingTaskId}`, updatedTask).subscribe({  
      
      next: () => {this.getTasks()
                // Reset form
        this.newTaskTitle = '';
        this.newTaskStatus = 'Not Completed';

        this.isEditMode = false;
        this.editingTaskId = null;
      }, // Refresh the task list after editing
      error: (err) => console.error('Failed to edit task:', err)

    })
    
  }

  deleteTask(item: any) {
    this.http.delete(`${environment.apiUrl}/taskLists/${item.id}`).subscribe({
      next: () => this.getTasks(), // Refresh the task list after deletion
      error: (err) => console.error('Failed to delete task:', err)
    });
  }

  completedTasksCount() {
    return this.taskLists().filter(task => task.complete === 'Completed').length;
  }

  pendingTasksCount() {
    return this.taskLists().filter(task => task.complete === 'Not Completed').length;
  }
}