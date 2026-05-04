const validateSchedule = async (req, res, next) => {
    try {
        const { day, slot } = req.body;

        if (!day || !slot) {
            return res.status(400).json({ message: "Day and slot are required." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Middleware Error", error: error.message });
    }
};

module.exports = validateSchedule;
