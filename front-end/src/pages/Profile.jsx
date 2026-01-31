import React, { useEffect, useState } from 'react';
import { $authHost } from '../http'; 
import classes from './Profile.module.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await $authHost.get('deadline/statistic'); 
                setProfile(data);
            } catch (e) {
                console.error("Fehler beim Laden des Profils", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className={classes.profilePage}>
            <div className={classes.loadingText}>Lade Statistik...</div>
        </div>
    );

    if (!profile) return (
        <div className={classes.profilePage}>
            <div className={classes.errorText}>Profil konnte nicht geladen werden.</div>
        </div>
    );

    const { username, stats } = profile;
    const avatarLetter = username ? username.charAt(0).toUpperCase() : "U";

    return (
        <div className={classes.profilePage}>
            
            <div className={classes.header}>
                <div className={classes.avatar}>
                    {avatarLetter}
                </div>
                <h2 className={classes.username}>{username}</h2>
                <p className={classes.subtitle}>Deine Semester-Statistik</p>
            </div>

            <div className={classes.statsGrid}>
                
                <div className={classes.card}>
                    <div className={classes.cardIcon}>📊</div>
                    <div className={classes.cardValue}>{stats.totalEvents}</div>
                    <div className={classes.cardLabel}>Deadlines gesamt</div>
                </div>

                <div className={`${classes.card} ${classes.cardWarn}`}>
                    <div className={classes.cardIcon}>🔥</div>
                    <div className={classes.cardValueSmall}>
                        {stats.busiestCourse.name || "—"}
                    </div>
                    <div className={classes.cardLabel}>
                        Intensivster Kurs
                        <span className={classes.subLabel}>({stats.busiestCourse.count} Aufgaben)</span>
                    </div>
                </div>

                <div className={`${classes.card} ${classes.cardDanger}`}>
                    <div className={classes.cardIcon}>📅</div>
                    <div className={classes.cardValueSmall}>
                        {stats.busiestDay.date 
                            ? new Date(stats.busiestDay.date).toLocaleDateString('de-DE') 
                            : "—"}
                    </div>
                    <div className={classes.cardLabel}>
                        Stressigster Tag
                        <span className={classes.subLabel}>({stats.busiestDay.count} Deadlines!)</span>
                    </div>
                </div>

                <div className={`${classes.card} ${classes.cardInfo}`}>
                    <div className={classes.cardIcon}>⚖️</div>
                    <div className={classes.cardValue}>{stats.averagePerDay}</div>
                    <div className={classes.cardLabel}>Ø Aufgaben pro Tag</div>
                </div>

            </div>

            <button 
                className={classes.logoutButton} 
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload(); 
                }}
            >
                Abmelden
            </button>
        </div>
    );
};

export default Profile;