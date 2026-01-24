
// Genereated by Google Gemini AI
module.exports = (rawText) => {
    const text = (rawText || "").toLowerCase();

    if (text.includes('klausur') || text.includes('exam') || text.includes('prüfung') || text.includes('final')) {
        return { type: 'exam', weight: 1.0 };
    }
    
    if (text.includes('hackathon') || text.includes('project') || text.includes('projekt')) {
        return { type: 'project', weight: 0.8 };
    }

    if (text.includes('due') || text.includes('fällig') || text.includes('abgabe') || text.includes('exercise')) {
        return { type: 'assignment', weight: 0.5 };
    }

    return { type: 'info', weight: 0.2 };
}