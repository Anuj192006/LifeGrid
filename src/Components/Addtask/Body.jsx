import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import './Body.css';

const Body = () => {
    const [goal, setGoal] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [number, setnumber] = useState(3);
    const navigate = useNavigate();

    const generateTasks = async () => {
        if (!goal.trim()) return;
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
                                text: `Return exactly this JavaScript array format without any additional text or markdown: [{"task":"","description":""},...] with ${number} tasks that ideal person would do for a goal: ${goal} ,if my goal is not a daily task or a bad habit to follow tell me "It is not a task" in the same format or if my goal is in hinglish give reply in hinglish`
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

    const addToPortfolio = () => {
        if (tasks.length === 0) {
            alert('No tasks to add!');
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!userData) {
            alert('Please login first!');
            return;
        }

        const newCategory = {
            goalName: goal.trim(),
            tasks: [...tasks],
            createdAt: new Date().toISOString()
        };

        const existingTodos = userData.todos || [];
        
        const existingGoalIndex = existingTodos.findIndex(
            item => item.goalName.toLowerCase() === goal.trim().toLowerCase()
        );

        let updatedTodos;
        if (existingGoalIndex >= 0) {
            updatedTodos = [...existingTodos];
            updatedTodos[existingGoalIndex].tasks.push(...tasks);
        } else {
            updatedTodos = [...existingTodos, newCategory];
        }

        const updatedUser = {
            ...userData,
            todos: updatedTodos
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        const x= localStorage.getItem('users')
        const multi_user=JSON.parse(x)
        let newMultiUser= multi_user.map((ele)=>{
            if (ele.username===updatedUser.username){
                return updatedUser
            }
            else{
                return ele
            }
        })
        localStorage.setItem('users',JSON.stringify(newMultiUser))
        navigate('/portfolio', { state: updatedUser });
    };

    return (
        <>
            <Navbar/>
            <div className="container">
                <div className="inp-cont">
                    <input
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Enter your goal (e.g., DSA, Web Development)"
                    />
                    <label>Select Number Of Task
                        <select name="numbers" onChange={(e) => setnumber(e.target.value)}>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>
                    </label>
                </div>
                <div className="btn-cont">
                    <button onClick={generateTasks} disabled={loading}>
                        {loading ? 'Loading...' : 'Get Tasks'}
                    </button>
                    <button onClick={addToPortfolio} disabled={loading || tasks.length === 0}>
                        {loading ? 'Processing...' : 'Add to Portfolio'}
                    </button>
                </div>
                <div className="tasks">
                    {tasks.map((t, i) => (
                        <div key={i} className="task">
                            <h4><input type="checkbox" />{t.task}</h4>
                            <p>{t.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Body;