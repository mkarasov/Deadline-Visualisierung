const ical = require('node-ical');
const { Deadline, User } = require('../models/models');
const ApiError = require('../classes/ApiError');
const generateUidHash = require('../utils/generateUidHash');
const calculateMetadata = require('../utils/metadataCalculator');
const calculateStatistics = require('../utils/statisticCalculator');

class DeadlineController {

    // written with the aid of Google Gemeni AI
    async upload (req, res, next) {
        try {
            if (!req.files || !req.files.calendar) {
                return next(ApiError.badRequest('Die Datei ist nicht angehängt.'))
            }

            const file = req.files.calendar;
            const userId = req.user.id;

            const data = ical.sync.parseICS(file.data.toString('utf-8'));

            let count = 0;

            for (const key in data) {
                const ev = data[key];

                if (ev.type === 'VEVENT' && ev.start) {
                    const { type, weight } = calculateMetadata(ev.summary);
                    const uidHash = generateUidHash(ev.uid, userId);
                    const courseName = ev.categories ? ev.categories[0] : 'General';

                    await Deadline.findOrCreate({
                        where: {uid_hash: uidHash},
                        defaults: {
                            title: ev.summary || 'No Title',
                            deadline_date: ev.start,
                            description: ev.description ? ev.description.substring(0, 500) : null,
                            course_name: courseName,
                            type: type,
                            weight: weight,
                            userId: userId
                        }
                    });
                    count++;
                }
            }

            return res.json({message: `${count} event(s) was(were) procceed`})
        } catch (e) {
            next(ApiError.internal('Error occured while processing file ' + e.message));
        }
    }

    async getByUserId(req, res, next) {
        try {
            const userId = req.user.id;

            const deadlines = await Deadline.findAll({
                where: {userId: userId},
                order: [['deadline_date', 'ASC']]
            });

            return res.json(deadlines);

        } catch(e) {
            next(ApiError.internal(e.message));
        }
    }

    async deleteByUserId(req, res, next) {
        try {
            const userId = req.user.id;

            await Deadline.destroy({
                where: {
                    userId: userId
                }
            });

            return res.status(200).json({ message: "Deleted successfully "});

        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getStatisticByUserId(req, res, next) {
        try {
            const id = req.user.id;

            const user = await User.findOne({ where: {id: id} });
            if (!user) return next(ApiError.badRequest(`User not found`));

            const deadlines = await Deadline.findAll({ where: {userId: id} });

            const stats = calculateStatistics(deadlines);

            return res.json({
                username: user.email, 
                stats: stats
            });

        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new DeadlineController();