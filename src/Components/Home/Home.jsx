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

    const generateTasks = async () => {
        if (!suggestion.trim()) return;
        setLoading(true);
        
        try {
            const apiKey = "AIzaSyCG7f57YhdvTLkuXMWkmeAClOxZsm_0D28";
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Return exactly this JavaScript array format without any additional text or markdown: [{"task":"","description":""},...] with 3 tasks that ideal persons habit if he is interested in  ${suggestion},if my interest is not a interest or a bad habit to follow tell me "It is not a task" in the same format or if my goal is in hinglish give reply in hinglish `
                            }]
                        }]
                    })
                }
            );
            
            const data = await response.json();
            let responseText = data.candidates[0].content.parts[0].text;
            
            responseText = responseText.replace(/```javascript|```/g, '');
            const result = JSON.parse(responseText.trim());
            setTasks(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Error:", error);
            setTasks([{task: "Error", description: "Failed to load tasks. Please try again."}]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar/>
        <div className="container">
            <h2>Welcome to LifeGrid</h2>
            <p>This your own personalized AI powered task manager and suggester</p>
            <p>Go to <strong> <a href="https://life-grid-45i5.vercel.app/add-task" style={{textDecoration:"none",color:"black"}}> Add Task </a></strong> to get your Goals ready</p>
            <div className="box">
                    <input 
                        type="text" 
                        placeholder='enter your field of interest' 
                        onChange={(e) => setsuggestion(e.target.value)}
                    />
                    <button onClick={generateTasks} disabled={loading}>
                        {loading ? 'Loading...' : 'Generate suggestion'}
                    </button>
                    <ul className='list'>
                        {tasks.map((t, i) => (
                            <li className="sgst" style={{listStyle:"none"}} key={i}>{t.task}</li>
                        ))}
                    </ul>
            </div>
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
        </div>
    </>
    );
};

export default Home;