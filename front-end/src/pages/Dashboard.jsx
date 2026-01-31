import React, { useState, useEffect, useRef } from 'react'; 
import Sketch from "react-p5";
import { $authHost } from '../http';
import ConfirmModal from '../components/ConfirmModal';
import classes from './Dashboard.module.css'; 
import DeadlineModal from '../components/DeadlineModal';

const Dashboard = () => {
    const [deadlines, setDeadlines] = useState([]);
    const [file, setFile] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeadlineModal, setShowDeadlineModal] = useState(false);
    
    const hoveredGroupRef = useRef(null);

    const [selectedEventGroup, setSelectedEventGroup] = useState(null);

    const uploadFile = async () => {
        if (!file) {
            alert("Bitte wählen Sie zuerst eine Datei aus."); 
            return;
        }

        const formData = new FormData();
        formData.append('calendar', file);

        try {
            await $authHost.post('deadline/upload', formData);
            alert("Datei erfolgreich hochgeladen!"); 
            fetchDeadlines(); 
        } catch (e) {
            alert("Fehler beim Hochladen der Datei."); 
        }
    };

    const fetchDeadlines = async () => {
        try {
            const { data } = await $authHost.get('deadline');
            setDeadlines(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = () => {
        console.log("dsadas");
        setShowConfirm(true);
    }

    const confirmDelete = async () => {
        try {
            await $authHost.delete('deadline');
            setDeadlines([]);
            setShowConfirm(false);
        } catch (e) {
            console.log(e)
        }
    }

    const getNextDeadline = () => {
        if (!deadlines || deadlines.length === 0) return null;

        const now = new Date();
        const future = deadlines.filter(d => new Date(d.deadline_date) > now);
        
        if (future.length === 0) return null;

        future.sort((a, b) => new Date(a.deadline_date) - new Date(b.deadline_date));

        return future[0];
    };

    const nextDeadline = getNextDeadline();
    
    let daysLeft = 0;
    if (nextDeadline) {
        const diff = new Date(nextDeadline.deadline_date) - new Date();
        daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    useEffect(() => {
        fetchDeadlines();
    }, []);


    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    const mousePressed = (p5) => {
        if (hoveredGroupRef.current) {
            setSelectedEventGroup(hoveredGroupRef.current);
        }
    };

    const draw = (p5) => {

        p5.background(15, 12, 41);
        p5.noStroke();

        if (deadlines.length === 0) {
            p5.fill(255);
            p5.textSize(24);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text("Bitte laden Sie eine .ics-Datei hoch", p5.width / 2, p5.height / 2);
            return;
        }

        const startX = 100;
        const endX = p5.width - 100;
        const centerY = p5.height * 0.45;
        
        const firstDate = new Date(deadlines[0].deadline_date).getTime();
        const lastDate = new Date(deadlines[deadlines.length - 1].deadline_date).getTime();

        p5.stroke(255, 255, 255, 50);
        p5.strokeWeight(2);
        p5.line(startX, centerY, endX, centerY);
        p5.noStroke();


        const today = new Date().getTime();
        if (today >= firstDate && today <= lastDate) {
            const xToday = p5.map(today, firstDate, lastDate, startX, endX);
            
            p5.stroke(0, 255, 0, 150); 
            p5.drawingContext.setLineDash([5, 5]);
            p5.line(xToday, centerY - 50, xToday, centerY + 50);
            p5.drawingContext.setLineDash([]); 
            p5.noStroke();
            p5.fill(0, 255, 0);
            p5.textSize(10);
            p5.textAlign(p5.CENTER);
            p5.text("Heute", xToday, centerY - 60);
}

        const groups = {};

        deadlines.forEach(d => {
            const dateObj = new Date(d.deadline_date);
            const dateKey = dateObj.toDateString(); 

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    date: d.deadline_date,
                    timestamp: dateObj.getTime(),
                    events: [],
                    maxWeight: 0,
                    hasExam: false,
                    hasProject: false
                };
            }
            
            groups[dateKey].events.push(d);
            
            if (d.weight > groups[dateKey].maxWeight) groups[dateKey].maxWeight = d.weight;
            if (d.type === 'exam') groups[dateKey].hasExam = true;
            if (d.type === 'project') groups[dateKey].hasProject = true;
        });

        const groupedItems = Object.values(groups);
        
        let closestGroup = null;
        let minDistance = Infinity;

        groupedItems.forEach(group => {
            const x = p5.map(group.timestamp, firstDate, lastDate, startX, endX);
            const y = centerY; 

            let size = group.maxWeight * 40 + 10;
            if (group.events.length > 1) {
                size += (group.events.length - 1) * 5; 
            }

            if (group.hasExam) p5.fill(255, 50, 80, 200);        
            else if (group.hasProject) p5.fill(255, 170, 0, 200); 
            else p5.fill(3, 233, 244, 180);                      

            p5.ellipse(x, y, size, size);

            if (group.events.length > 1) {
                p5.fill(255, 255, 255, 150);
                p5.ellipse(x, y, 6, 6); 
            }

            const d = p5.dist(p5.mouseX, p5.mouseY, x, y);
            if (d < size / 2 && d < minDistance) {
                minDistance = d;
                closestGroup = { ...group, x, y, size }; 
            }
        });

        hoveredGroupRef.current = closestGroup;

        if (closestGroup) {
            const { x, y, size, events, date } = closestGroup;

            p5.cursor(p5.HAND); 

            p5.noFill();
            p5.stroke(255);
            p5.strokeWeight(2);
            p5.ellipse(x, y, size + 8, size + 8);
            p5.noStroke();

            const lineHeight = 20; 
            const headerHeight = 35;
            const padding = 20;
            const boxWidth = 300;
            const boxHeight = headerHeight + (events.length * lineHeight) + padding;

            let boxY = y - (size / 2) - 20 - (boxHeight / 2);
            if (boxY - boxHeight/2 < 0) {
                boxY = y + (size / 2) + 20 + (boxHeight / 2);
            }

            let boxX = x;
            if (boxX - boxWidth / 2 < 10) boxX = boxWidth / 2 + 10;
            else if (boxX + boxWidth / 2 > p5.width - 10) boxX = p5.width - boxWidth / 2 - 10;

            p5.fill(10, 10, 30, 240);
            p5.stroke(255, 255, 255, 50);
            p5.strokeWeight(1);
            p5.rectMode(p5.CENTER);
            p5.rect(boxX, boxY, boxWidth, boxHeight, 10);

            p5.stroke(255, 255, 255, 100);
            if (boxY < y) p5.line(x, y - (size / 2) - 5, boxX, boxY + (boxHeight / 2));
            else p5.line(x, y + (size / 2) + 5, boxX, boxY - (boxHeight / 2));
            p5.noStroke();

            p5.textAlign(p5.CENTER, p5.TOP);
            
            p5.fill(180);
            p5.textSize(12);
            const dateStr = new Date(date).toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
            const topEdge = boxY - (boxHeight / 2) + 10;
            p5.text(dateStr, boxX, topEdge);

            p5.textSize(14);
            p5.fill(255);
            
            events.forEach((ev, index) => {
                const lineY = topEdge + 25 + (index * lineHeight);
                let title = ev.title;
                if (title.length > 35) title = title.substring(0, 32) + "...";
                
                if (ev.type === 'exam') p5.fill(255, 80, 80);
                else if (ev.type === 'project') p5.fill(255, 170, 0);
                else p5.fill(3, 233, 244);
                p5.ellipse(boxX - 130, lineY + 5, 6, 6);

                p5.fill(255);
                p5.textAlign(p5.LEFT, p5.TOP);
                p5.text(title, boxX - 115, lineY);
            });
        } else {
            p5.cursor(p5.ARROW);
        }
    };

    return (
        <div className={classes.dashboardPage}>
            
            <div className={classes.controlPanel}>
                <div className={classes.fileUploadWrapper}>
                        <input 
                        type="file" 
                        id="fileInput"
                        onChange={e => setFile(e.target.files[0])} 
                        className={classes.fileInputHidden}
                    />
                    <label htmlFor="fileInput" className={classes.fileLabel}>
                        {file ? file.name : "Datei auswählen"}
                    </label>
                </div>
                
                <button className={classes.button} onClick={uploadFile}>
                    Hochladen 
                </button>


                <button
                    className={`${classes.button} ${classes.deleteButton}`}
                    onClick={handleDelete}
                >
                    Löschen
                </button>
            </div>


            <div className={classes.uiContainer}>
                {nextDeadline && (
                    <div className={classes.nextDeadlineCard}>
                        <div className={classes.nextLabel}>Nächster Deadline:</div>
                        <div 
                            className={classes.nextTitle}
                            dangerouslySetInnerHTML={{ __html: nextDeadline.title }}
                        />
                        <div className={classes.nextMeta}>
                            <span className={classes.nextDate}>
                                📅 {new Date(nextDeadline.deadline_date).toLocaleDateString('de-DE')}
                            </span>
                            <span className={classes.nextDays}>
                                ⏳ Noch {daysLeft} Tage
                            </span>
                        </div>
                    </div>
                )}
            </div>
            
            <Sketch 
                setup={setup} 
                draw={draw} 
                windowResized={windowResized} 
                mousePressed={mousePressed} 
            />

            <ConfirmModal 
                open={!!showConfirm}
                title={"Dashboard löschen"}
                message={"Möchten Sie das Dashboard löschen?"}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />

            <DeadlineModal 
                open={!!selectedEventGroup}
                title={selectedEventGroup ? new Date(selectedEventGroup.date).toLocaleDateString() : ""}
                deadlines={selectedEventGroup ? selectedEventGroup.events : []}
                onClose={() => setSelectedEventGroup(null)}
            />
        </div>
    );
};

export default Dashboard;