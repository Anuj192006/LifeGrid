import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './home.css';

const Home = () => {
    const [suggestion, setsuggestion] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const completionPercentages = userData.todos?.map(goal => goal.completionPercentage) || [];

    const goalData = userData.todos?.map(goal => ({
        name: goal.goalName,
        percentage: goal.completionPercentage
    })) || [];

    const PieChart = ({ percentage, size = 60 }) => {
        const radius = size / 2 - 5;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size/2}
                    cy={size/2}
                    r={radius}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="8"
                />
                <circle
                    cx={size/2}
                    cy={size/2}
                    r={radius}
                    fill="none"
                    stroke="#4169E1"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
                <text 
                    x="50%" 
                    y="50%" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fill="#4169E1"
                    style={{ fontSize: size/4, fontWeight: 'bold' }}
                >
                    {percentage}%
                </text>
            </svg>
        );
    };

    

    return (
        <>
        <Navbar/>
        <div className="container">
            <h2>Welcome to LifeGrid</h2>
            <p>This your own personalized AI powered task manager and suggester</p>
            <p>Go to <strong> <a href="https://life-grid-45i5.vercel.app/add-task" style={{textDecoration:"none",color:"black"}}> Add Task </a></strong> to get your Goals ready</p>
            <div className="taskbar">
                {goalData.length > 0 ? (
                    goalData.map((goal, index) => (
                        <div className="card" key={index}>
                            <h2>{goal.name}</h2>  
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <PieChart percentage={goal.percentage} />
                            </div>
                            <p>Completed: {goal.percentage}%</p>
                        </div>
                    ))
                ) : (
                    <div className="card">
                        <h2>No Goals Yet</h2>
                        <p>Add tasks to see progress</p>
                    </div>
                )}
            </div>
            <div className="vid">
                <h1>Tutorial To add task</h1>
            <video className="vid-home" controls autoPlay muted loop>
            <source src='demo.mp4' type="video/mp4"/>
            </video>
            </div>
        </div>
    </>
    );
};

export default Home;