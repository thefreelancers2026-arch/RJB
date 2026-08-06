const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create SiteContent table
        db.run(`CREATE TABLE IF NOT EXISTS SiteContent (
            key TEXT PRIMARY KEY,
            value TEXT
        )`, (err) => {
            if (!err) {
                // Insert default content if empty
                db.get("SELECT COUNT(*) as count FROM SiteContent", (err, row) => {
                    if (row && row.count === 0) {
                        const defaultContent = [
                            ['hero_tagline', "RPG Catering is Cuddalore's trusted event planner,<br>delivering premium wedding catering services —<br>crafting unforgettable memories since 2005."],
                            ['about_title', "RPG CATERING"],
                            ['about_text', "<p>At <strong>RPG Catering</strong>, we believe every celebration deserves extraordinary food and seamless hospitality. We create unforgettable dining experiences tailored to your vision.</p><p>Our team delivers freshly prepared cuisine and flawless event execution. From intimate family gatherings to grand weddings, we ensure your guests enjoy every moment.</p><p class=\"about-studio__signature\">Your Celebration. Our Passion.</p>"]
                        ];
                        const stmt = db.prepare("INSERT INTO SiteContent (key, value) VALUES (?, ?)");
                        defaultContent.forEach(item => stmt.run(item));
                        stmt.finalize();
                    }
                });
            }
        });

        // Create Services table
        db.run(`CREATE TABLE IF NOT EXISTS Services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            image_url TEXT
        )`, (err) => {
            if (!err) {
                db.get("SELECT COUNT(*) as count FROM Services", (err, row) => {
                    if (row && row.count === 0) {
                        const defaultServices = [
                            ["Wedding Catering", "wedding_catering.png"],
                            ["🎂 Birthday Party Catering", "event_catering.png"],
                            ["❤️ Anniversary Catering", "hero.png"],
                            ["🎉 Event Catering", "decor.png"],
                            ["🍽 Buffet & Live Counters", "buffet_catering.png"],
                            ["👨‍🍳 Professional Service Staff", "service_staff.png"]
                        ];
                        const stmt = db.prepare("INSERT INTO Services (title, image_url) VALUES (?, ?)");
                        defaultServices.forEach(item => stmt.run(item));
                        stmt.finalize();
                    }
                });
            }
        });

        // Create Gallery table
        db.run(`CREATE TABLE IF NOT EXISTS Gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT
        )`, (err) => {
            if (!err) {
                db.get("SELECT COUNT(*) as count FROM Gallery", (err, row) => {
                    if (row && row.count === 0) {
                        const defaultGallery = [
                            ["hero.png"],
                            ["decor.png"],
                            ["catering.png"],
                            ["hero.png"],
                            ["wedding_catering.png"],
                            ["event_catering.png"]
                        ];
                        const stmt = db.prepare("INSERT INTO Gallery (image_url) VALUES (?)");
                        defaultGallery.forEach(item => stmt.run(item));
                        stmt.finalize();
                    }
                });
            }
        });
    }
});

module.exports = db;
