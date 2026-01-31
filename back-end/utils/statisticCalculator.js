const calculateStatistics = (deadlines) => {
    if (!deadlines || deadlines.length === 0) {
        return {
            totalEvents: 0,
            averagePerDay: 0,
            busiestCourse: { name: '-', count: 0 },
            busiestDay: { date: null, count: 0 }
        };
    }

    const totalEvents = deadlines.length;
    
    const courseCounts = {};
    const dateCounts = {};

    deadlines.forEach(d => {
        const course = d.course_name || 'Allgemein';
        courseCounts[course] = (courseCounts[course] || 0) + 1;

        const dateObj = new Date(d.deadline_date);
        const dateKey = dateObj.toISOString().split('T')[0]; 
        dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    });

    let busiestCourseName = null;
    let maxCourseCount = 0;

    for (const [name, count] of Object.entries(courseCounts)) {
        if (count > maxCourseCount) {
            maxCourseCount = count;
            busiestCourseName = name;
        }
    }

    let busiestDayDate = null;
    let maxDayCount = 0;

    for (const [date, count] of Object.entries(dateCounts)) {
        if (count > maxDayCount) {
            maxDayCount = count;
            busiestDayDate = date;
        }
    }


    const activeDaysCount = Object.keys(dateCounts).length;
    const average = activeDaysCount > 0 ? (totalEvents / activeDaysCount).toFixed(1) : 0;

    return {
        totalEvents: totalEvents,
        averagePerDay: average, 
        busiestCourse: {
            name: busiestCourseName,
            count: maxCourseCount
        },
        busiestDay: {
            date: busiestDayDate,
            count: maxDayCount
        }
    };
};

module.exports = calculateStatistics;