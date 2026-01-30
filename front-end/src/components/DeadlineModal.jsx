import React from "react";
import classes from "./DeadlineModal.module.css"; 

const DeadlineModal = ({
    open,
    title,
    deadlines,
    onClose 
}) => {
    if (!open) return null;

    const getColor = (weight) => {
        if (weight >= 10) return "#ff4d4d"; 
        if (weight >= 7) return "#ffbd2e";  
        return "#3be9f4";                   
    };

    return (
        <div className={classes.overlay} onClick={onClose}>
            
            <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
                
                <div className={classes.header}>
                    <h4 className={classes.title}>{title}</h4>
                    <button className={classes.closeButton} onClick={onClose}>&times;</button>
                </div>

                <div className={classes.list}>
                    {deadlines && deadlines.length > 0 ? (
                        deadlines.map((element, index) => {
                            const itemColor = getColor(element.weight);

                            return (
                                <div 
                                    key={index} 
                                    className={classes.listItem}
                                    style={{ borderLeftColor: itemColor }}
                                >
                                    <div className={classes.infoGroup}>
                                        <span className={classes.itemTitle}>{element.title}</span>
                                        
                                        <span 
                                            className={classes.courseTag}
                                            style={{ color: itemColor, borderColor: itemColor }}
                                        >
                                            {element.course_name || "Allgemein"} 
                                        </span>
                                    </div>

                                    <div className={classes.metaGroup}>
                                        <div className={classes.dateRow}>
                                            📅 {new Date(element.deadline_date).toLocaleDateString('de-DE')}
                                        </div>
                                        <div className={classes.prioRow} style={{ color: itemColor }}>
                                            Priority: {element.weight}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className={classes.emptyText}>Keine Deadlines an diesem Tag.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeadlineModal;