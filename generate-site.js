const fs = require('fs');

const talks = [
    {
        title: "Introduction to AI in Software Development",
        speakers: ["Dr. Alex Chen"],
        category: ["AI", "Software Engineering", "Future Tech"],
        duration: 60,
        description: "Explore the fundamental concepts of Artificial Intelligence and its transformative impact on modern software development practices. Learn about AI-driven tools, automation, and emerging trends."
    },
    {
        title: "Mastering Modern Frontend Frameworks",
        speakers: ["Sarah Lee"],
        category: ["Frontend", "Web Development", "JavaScript"],
        duration: 60,
        description: "Dive deep into popular frontend frameworks like React, Vue, and Angular. This talk covers best practices, performance optimization, and common pitfalls to avoid when building scalable web applications."
    },
    {
        title: "Secure Coding Practices for Web Applications",
        speakers: ["David Kim", "Emily Rodriguez"],
        category: ["Security", "Web Development"],
        duration: 60,
        description: "Understand critical security vulnerabilities in web applications and learn how to implement robust coding practices to protect against common attacks like XSS, CSRF, and SQL injection."
    },
    {
        title: "Data Science with Python: From Zero to Hero",
        speakers: ["Maria Garcia"],
        category: ["Data Science", "Python", "Machine Learning"],
        duration: 60,
        description: "An intensive introduction to data science using Python. Cover data manipulation with Pandas, numerical computing with NumPy, and machine learning basics with scikit-learn."
    },
    {
        title: "Cloud Native Architectures: A Deep Dive",
        speakers: ["John Smith"],
        category: ["Cloud", "Architecture", "DevOps"],
        duration: 60,
        description: "Explore the principles and patterns of building and deploying cloud-native applications. Topics include microservices, containers, Kubernetes, and serverless computing."
    },
    {
        title: "Effective DevOps Strategies for Continuous Delivery",
        speakers: ["Jessica Brown", "Mark Davis"],
        category: ["DevOps", "Automation", "CI/CD"],
        duration: 60,
        description: "Learn how to implement effective DevOps strategies to accelerate software delivery and improve operational efficiency. Focus on continuous integration, continuous delivery, and infrastructure as code."
    }
];

const eventStartTime = "10:00 AM";
const lunchDuration = 60; // minutes
const transitionDuration = 10; // minutes

function calculateSchedule() {
    let currentTime = new Date(`2000/01/01 ${eventStartTime}`); // Use a dummy date
    const schedule = [];

    // Advance current time by 3 talks duration + 3 transitions for lunch position
    let preLunchTalksCount = 3;
    for(let i=0; i<preLunchTalksCount; i++) {
        currentTime.setMinutes(currentTime.getMinutes() + talks[i].duration);
        currentTime.setMinutes(currentTime.getMinutes() + transitionDuration);
    }
    // Now add lunch
    currentTime.setMinutes(currentTime.getMinutes() - transitionDuration); // Remove last transition before lunch
    const lunchStartTime = new Date(currentTime);
    currentTime.setMinutes(currentTime.getMinutes() + lunchDuration);
    const lunchEndTime = new Date(currentTime);
    
    // Reset currentTime for the actual schedule generation
    currentTime = new Date(`2000/01/01 ${eventStartTime}`);

    talks.forEach((talk, index) => {
        const startTime = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + talk.duration);
        const endTime = new Date(currentTime);

        schedule.push({
            ...talk,
            startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });

        // Check if the current talk is the third talk (index 2)
        if (index === preLunchTalksCount -1) { 
            const lunchStartTimeFormatted = lunchStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const lunchEndTimeFormatted = lunchEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            schedule.push({
                title: "Lunch Break",
                isBreak: true,
                startTime: lunchStartTimeFormatted,
                endTime: lunchEndTimeFormatted
            });
            currentTime = new Date(`2000/01/01 ${lunchEndTimeFormatted}`); // Update current time to after lunch
        }
        
        if (index < talks.length - 1) { // Add transition after each talk, except the last one
            currentTime.setMinutes(currentTime.getMinutes() + transitionDuration);
        }
    });
    return schedule;
}

const scheduleData = calculateSchedule();

const css = `
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
}
.container {
    max-width: 1000px;
    margin: 20px auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
h1, h2 {
    color: #0056b3;
    text-align: center;
}
.search-bar {
    text-align: center;
    margin-bottom: 30px;
}
.search-bar input {
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    width: 60%;
    max-width: 400px;
    margin-right: 10px;
}
.search-bar button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}
.search-bar button:hover {
    background-color: #0056b3;
}
.schedule {
    display: grid;
    gap: 20px;
}
.talk-card {
    background-color: #e9f7ff;
    border-left: 5px solid #007bff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}
.talk-card.lunch-break {
    background-color: #ffeeba;
    border-left-color: #ffc107;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
}
.talk-card h3 {
    margin-top: 0;
    color: #0056b3;
}
.talk-card p {
    margin: 5px 0;
}
.talk-card .time {
    font-weight: bold;
    color: #007bff;
}
.talk-card .speakers span {
    font-style: italic;
    color: #555;
}
.talk-card .category span {
    display: inline-block;
    background-color: #007bff;
    color: white;
    padding: 3px 8px;
    border-radius: 3px;
    margin-right: 5px;
    font-size: 0.8em;
}
.talk-card.hidden {
    display: none;
}
`;

const js = `
document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const talks = JSON.parse(scheduleContainer.dataset.talks);

    function renderSchedule(data) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('talk-card');
            if (item.isBreak) {
                card.classList.add('lunch-break');
                card.innerHTML = \`
                    <p class="time">\${item.startTime} - \${item.endTime}</p>
                    <h3>\${item.title}</h3>
                \`;
            } else {
                // Use innerHTML directly for the content, it's safer when not user-generated
                card.innerHTML = \`
                    <p class="time">\${item.startTime} - \${item.endTime}</p>
                    <h3>\${item.title}</h3>
                    <p class="speakers">Speakers: \${item.speakers.join(', ')}</p>
                    <p class="category">Category: \${item.category.map(c => \`<span>\${c}</span>\`).join('')}</p>
                    <p>\${item.description}</p>
                \`;
                card.dataset.category = item.category.map(c => c.toLowerCase()).join(' ');
            }
            scheduleContainer.appendChild(card);
        });
    }

    function filterTalks() {
        const searchInput = document.getElementById('category-search').value.toLowerCase();
        const talkCards = document.querySelectorAll('.talk-card:not(.lunch-break)');

        talkCards.forEach(card => {
            const categories = card.dataset.category;
            if (searchInput === '' || (categories && categories.includes(searchInput))) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    renderSchedule(talks);
    document.getElementById('search-button').addEventListener('click', filterTalks);
    document.getElementById('category-search').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filterTalks();
        }
    });
});
