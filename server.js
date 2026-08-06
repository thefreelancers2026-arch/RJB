const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

// Setup Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'rkg-wedding-planner-secret',
    resave: false,
    saveUninitialized: false
}));

// Setup Multer for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Admin Authentication Middleware
const requireAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};

// --- PUBLIC ROUTES ---
app.get('/', (req, res) => {
    db.all("SELECT * FROM SiteContent", [], (err, contentRows) => {
        if (err) return res.status(500).send("Database error");
        let content = {};
        contentRows.forEach(row => {
            content[row.key] = row.value;
        });

        db.all("SELECT * FROM Services", [], (err, services) => {
            if (err) return res.status(500).send("Database error");
            res.render('index', { content, services });
        });
    });
});

app.get('/gallery', (req, res) => {
    db.all("SELECT * FROM Gallery", [], (err, gallery) => {
        if (err) return res.status(500).send("Database error");
        res.render('gallery', { gallery });
    });
});

// --- ADMIN ROUTES ---
app.get('/login', (req, res) => {
    if (req.session.loggedIn) return res.redirect('/admin');
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Hardcoded simple auth for MVP (Admin / admin123)
    // We use bcrypt for demonstration: bcrypt.hashSync('admin123', 10) = $2b$10$wTf2t22.gR67Y4B2O/k51ueFzFOfw26aEpsM/W3O/H10nJq4L11x2
    const adminHash = '$2b$10$CES6chtSrIRDXjLxOG5VGuOBUg5R.9YDyNMZENc/B6KE8McVjwSZW';
    
    if (username === 'Admin' && await bcrypt.compare(password, adminHash)) {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/admin', requireAuth, (req, res) => {
    db.all("SELECT * FROM SiteContent", [], (err, contentRows) => {
        let content = {};
        contentRows.forEach(row => {
            content[row.key] = row.value;
        });
        db.all("SELECT * FROM Services", [], (err, services) => {
            db.all("SELECT * FROM Gallery", [], (err, gallery) => {
                res.render('admin', { content, services, gallery });
            });
        });
    });
});

// Admin: Update Site Content (Text)
app.post('/admin/content', requireAuth, (req, res) => {
    const { hero_tagline, about_title, about_text } = req.body;
    
    const stmt = db.prepare("UPDATE SiteContent SET value = ? WHERE key = ?");
    stmt.run(hero_tagline, 'hero_tagline');
    stmt.run(about_title, 'about_title');
    stmt.run(about_text, 'about_text');
    stmt.finalize(() => {
        res.redirect('/admin');
    });
});

// Admin: Add Service
app.post('/admin/services', requireAuth, upload.single('image'), (req, res) => {
    const { title } = req.body;
    let imageUrl = req.file ? 'uploads/' + req.file.filename : 'hero.png'; // default fallback
    
    db.run("INSERT INTO Services (title, image_url) VALUES (?, ?)", [title, imageUrl], (err) => {
        res.redirect('/admin');
    });
});

// Admin: Edit Service
app.post('/admin/services/edit/:id', requireAuth, upload.single('image'), (req, res) => {
    const { title } = req.body;
    if (req.file) {
        let imageUrl = 'uploads/' + req.file.filename;
        db.run("UPDATE Services SET title = ?, image_url = ? WHERE id = ?", [title, imageUrl, req.params.id], (err) => {
            res.redirect('/admin');
        });
    } else {
        db.run("UPDATE Services SET title = ? WHERE id = ?", [title, req.params.id], (err) => {
            res.redirect('/admin');
        });
    }
});

// Admin: Delete Service
app.post('/admin/services/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM Services WHERE id = ?", [req.params.id], (err) => {
        res.redirect('/admin');
    });
});

// Admin: Add Gallery Image
app.post('/admin/gallery', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) return res.redirect('/admin');
    
    let imageUrl = 'uploads/' + req.file.filename;
    db.run("INSERT INTO Gallery (image_url) VALUES (?)", [imageUrl], (err) => {
        res.redirect('/admin');
    });
});

// Admin: Delete Gallery Image
app.post('/admin/gallery/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM Gallery WHERE id = ?", [req.params.id], (err) => {
        res.redirect('/admin');
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
module.exports = app;
