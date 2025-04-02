import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import './portfolio.css';

const Portfolio = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(
    location.state || JSON.parse(localStorage.getItem('user')) || {}
  );

  const handleTaskToggle = (goalIndex, taskIndex) => {
    const updatedUser = { ...userData };
    updatedUser.todos[goalIndex].tasks[taskIndex].completed = 
      !updatedUser.todos[goalIndex].tasks[taskIndex].completed;
    
    updatedUser.todos[goalIndex].completionPercentage = calculateCompletion(updatedUser.todos[goalIndex]);
    
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const calculateCompletion = (goal) => {
    const completedTasks = goal.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / goal.tasks.length) * 100);
  };

  function handledelete(index){
    const xuser = { ...userData }
    xuser.todos = userData.todos.filter((_, i) => i !== index);
    // console.log(new_data)
    setUserData(xuser);
    localStorage.setItem('user', JSON.stringify(xuser));
    }

  useEffect(() => {
    if (userData.todos) {
      const updatedUser = { ...userData };
      updatedUser.todos.forEach(goal => {
        if (typeof goal.completionPercentage === 'undefined') {
          goal.completionPercentage = calculateCompletion(goal);
        }
      });
      setUserData(updatedUser);
    }
  }, []);

  return (
    <>
      <Navbar/>
      <div className="main-port">
        <div className="portfolio-header">
          <h1>{userData.username}'s Portfolio</h1>
          <p className="portfolio-subtitle">
            Total Completion: {getOverallCompletion(userData.todos)}%
          </p>
        </div>
        
        <div className="goals-container">
          {userData.todos?.length > 0 ? (
            userData.todos.map((goalCategory, index) => (
              <div key={index}  className="goal-card" style={{ minHeight: `${100 + (goalCategory.tasks.length * 20)}px` }}>
                <div className="goal-header">
                  <h2 className="goal-title">{goalCategory.goalName}</h2>
                  <button className='delete' onClick={()=>handledelete(index)}>Delete</button>
                  <div className="completion-badge">
                    {goalCategory.completionPercentage}%
                  </div>
                </div>
                <div className="tasks-list">
                  
                  {goalCategory.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="task-item">
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={() => handleTaskToggle(index, taskIndex)}
                        id={`task-${index}-${taskIndex}`}
                      />
                      <label htmlFor={`task-${index}-${taskIndex}`} className="task-content">
                        <p className={`task-name ${task.completed ? 'completed' : ''}`}>
                          {task.task}
                        </p>
                        <p className="task-desc">{task.description}</p>
                      </label>
                    </div>
                      
                  ))}
                </div>
                <div className="goal-meta">
                  <span>{goalCategory.tasks.length} tasks</span>
                  <span>{new Date(goalCategory.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-portfolio">
              <p>No tasks added yet. Go generate some tasks!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const getOverallCompletion = (todos) => {
  if (!todos || todos.length === 0) return 0;
  
  const totalTasks = todos.reduce((sum, goal) => sum + goal.tasks.length, 0);
  const completedTasks = todos.reduce(
    (sum, goal) => sum + goal.tasks.filter(task => task.completed).length, 
    0
  );
  
  return Math.round((completedTasks / totalTasks) * 100) || 0;
};

export default Portfolio;